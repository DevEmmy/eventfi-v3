import { io, Socket } from "socket.io-client";
import {
    ChatJoinPayload,
    ChatMessagePayload,
    ChatReadPayload,
    ChatJoinedEvent,
    ChatMessageEvent,
    ChatMessageDeletedEvent,
    ChatMessagePinnedEvent,
    ChatMemberJoinedEvent,
    ChatMemberLeftEvent,
    ChatMemberMutedEvent,
    ChatTypingEvent,
    ChatTypingStopEvent,
    ChatSettingsEvent,
    ChatErrorEvent,
} from "@/types/chat";

type ChatEventHandler<T> = (data: T) => void;

interface ChatSocketEvents {
    "chat:joined": ChatEventHandler<ChatJoinedEvent>;
    "chat:message": ChatEventHandler<ChatMessageEvent>;
    "chat:message:deleted": ChatEventHandler<ChatMessageDeletedEvent>;
    "chat:message:pinned": ChatEventHandler<ChatMessagePinnedEvent>;
    "chat:member:joined": ChatEventHandler<ChatMemberJoinedEvent>;
    "chat:member:left": ChatEventHandler<ChatMemberLeftEvent>;
    "chat:member:muted": ChatEventHandler<ChatMemberMutedEvent>;
    "chat:typing": ChatEventHandler<ChatTypingEvent>;
    "chat:typing:stop": ChatEventHandler<ChatTypingStopEvent>;
    "chat:settings": ChatEventHandler<ChatSettingsEvent>;
    "chat:error": ChatEventHandler<ChatErrorEvent>;
}

class ChatSocketService {
    private socket: Socket | null = null;
    private eventId: string | null = null;
    private handlers: Partial<ChatSocketEvents> = {};
    private typingTimeout: NodeJS.Timeout | null = null;

    // Connection change callbacks (separate from chat event handlers)
    private connectCallbacks: Array<() => void> = [];
    private disconnectCallbacks: Array<() => void> = [];

    /**
     * Connect to the chat WebSocket server.
     * Accepts the full API URL (e.g. https://host/api/v1 or wss://host/api/v1)
     * and normalises it to just the origin so Socket.IO connects correctly.
     * The server uses path /ws/chat — this is set explicitly here.
     */
    connect(wsUrl: string): void {
        if (this.socket?.connected) return;
        // Already created but reconnecting
        if (this.socket) return;

        const token = localStorage.getItem("token");

        let origin: string;
        try {
            const parsed = new URL(wsUrl);
            const protocol =
                parsed.protocol === "wss:"
                    ? "https:"
                    : parsed.protocol === "ws:"
                    ? "http:"
                    : parsed.protocol;
            origin = `${protocol}//${parsed.host}`;
        } catch {
            origin = wsUrl;
        }

        this.socket = io(origin, {
            auth: { token },
            path: "/ws/chat",
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.socket.on("connect", () => {
            console.log("[ChatSocket] Connected");
            this.connectCallbacks.forEach((cb) => cb());
            // Rejoin room on reconnect — socket.io only fires "connect" after
            // transport is established, so queueing emit here avoids double-join
            // on first connect (the joinRoom() call queues before connect fires,
            // so the room is joined once the socket connects via the queue).
            // On *re*connect the queue is cleared, so we must emit again here.
            if (this.eventId && this.socket?.recovered === false) {
                this.socket?.emit("chat:join", { eventId: this.eventId } as ChatJoinPayload);
            }
        });

        this.socket.on("disconnect", (reason) => {
            console.log("[ChatSocket] Disconnected:", reason);
            this.disconnectCallbacks.forEach((cb) => cb());
        });

        this.socket.on("connect_error", (error) => {
            console.error("[ChatSocket] Connection error:", error.message);
        });

        this.setupEventListeners();
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.eventId = null;
        }
    }

    /**
     * Join a chat room.
     * Emits immediately if the socket is connected; otherwise the queued emit
     * will fire once the socket connects (socket.io buffers pending emits).
     * The "connect" handler does NOT re-emit on first connection, so there
     * is no double-join race.
     */
    joinRoom(eventId: string): void {
        this.eventId = eventId;
        this.socket?.emit("chat:join", { eventId } as ChatJoinPayload);
    }

    /**
     * Leave the current chat room
     */
    leaveRoom(): void {
        if (this.eventId) {
            this.socket?.emit("chat:leave", { eventId: this.eventId });
            this.eventId = null;
        }
    }

    /**
     * Send a message
     */
    sendMessage(payload: ChatMessagePayload): void {
        this.socket?.emit("chat:message", payload);
    }

    /**
     * Send typing indicator (debounced on the client side)
     */
    sendTyping(): void {
        if (this.typingTimeout) return; // already signalled within window
        this.socket?.emit("chat:typing");
        this.typingTimeout = setTimeout(() => {
            this.typingTimeout = null;
        }, 2000);
    }

    /**
     * Mark a message as read
     */
    markAsRead(messageId: string): void {
        if (this.eventId) {
            this.socket?.emit("chat:read", {
                eventId: this.eventId,
                messageId,
            } as ChatReadPayload);
        }
    }

    /**
     * Register a chat event handler (only one handler per event type is kept)
     */
    on<K extends keyof ChatSocketEvents>(event: K, handler: ChatSocketEvents[K]): void {
        this.handlers[event] = handler;
    }

    /**
     * Remove a chat event handler
     */
    off<K extends keyof ChatSocketEvents>(event: K): void {
        delete this.handlers[event];
    }

    /**
     * Register a callback for when the socket connects (or reconnects).
     * Returns an unsubscribe function.
     */
    onConnect(cb: () => void): () => void {
        this.connectCallbacks.push(cb);
        return () => {
            this.connectCallbacks = this.connectCallbacks.filter((x) => x !== cb);
        };
    }

    /**
     * Register a callback for when the socket disconnects.
     * Returns an unsubscribe function.
     */
    onDisconnect(cb: () => void): () => void {
        this.disconnectCallbacks.push(cb);
        return () => {
            this.disconnectCallbacks = this.disconnectCallbacks.filter((x) => x !== cb);
        };
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    // ── Raw socket access (used by activitySocket facade) ──────────────────

    /** Emit any event through the underlying socket */
    emitRaw(event: string, data?: any): void {
        this.socket?.emit(event, data);
    }

    /** Register a listener on the underlying socket (additive, not replacing) */
    onRaw(event: string, handler: (data: any) => void): void {
        this.socket?.on(event, handler);
    }

    /** Remove a specific raw event listener */
    offRaw(event: string, handler?: (data: any) => void): void {
        if (handler) {
            this.socket?.off(event, handler);
        } else {
            this.socket?.off(event);
        }
    }

    /**
     * Get current event ID
     */
    getCurrentEventId(): string | null {
        return this.eventId;
    }

    /**
     * Setup all WebSocket event listeners (called once on connect)
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on("chat:joined", (data: ChatJoinedEvent) => {
            this.handlers["chat:joined"]?.(data);
        });

        this.socket.on("chat:message", (data: ChatMessageEvent) => {
            this.handlers["chat:message"]?.(data);
        });

        this.socket.on("chat:message:deleted", (data: ChatMessageDeletedEvent) => {
            this.handlers["chat:message:deleted"]?.(data);
        });

        this.socket.on("chat:message:pinned", (data: ChatMessagePinnedEvent) => {
            this.handlers["chat:message:pinned"]?.(data);
        });

        this.socket.on("chat:member:joined", (data: ChatMemberJoinedEvent) => {
            this.handlers["chat:member:joined"]?.(data);
        });

        this.socket.on("chat:member:left", (data: ChatMemberLeftEvent) => {
            this.handlers["chat:member:left"]?.(data);
        });

        this.socket.on("chat:member:muted", (data: ChatMemberMutedEvent) => {
            this.handlers["chat:member:muted"]?.(data);
        });

        this.socket.on("chat:typing", (data: ChatTypingEvent) => {
            this.handlers["chat:typing"]?.(data);
        });

        this.socket.on("chat:typing:stop", (data: ChatTypingStopEvent) => {
            this.handlers["chat:typing:stop"]?.(data);
        });

        this.socket.on("chat:settings", (data: ChatSettingsEvent) => {
            this.handlers["chat:settings"]?.(data);
        });

        this.socket.on("chat:error", (data: ChatErrorEvent) => {
            this.handlers["chat:error"]?.(data);
        });
    }
}

// Export singleton instance
export const chatSocket = new ChatSocketService();
