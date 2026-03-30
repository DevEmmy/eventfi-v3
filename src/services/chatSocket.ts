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
    "chat:settings": ChatEventHandler<ChatSettingsEvent>;
    "chat:error": ChatEventHandler<ChatErrorEvent>;
}

class ChatSocketService {
    private socket: Socket | null = null;
    private eventId: string | null = null;
    private handlers: Partial<ChatSocketEvents> = {};
    private typingTimeout: NodeJS.Timeout | null = null;

    /**
     * Connect to the chat WebSocket server.
     * Accepts the full API URL (e.g. https://host/api/v1 or wss://host/api/v1)
     * and normalises it to just the origin so Socket.IO connects correctly.
     * The server uses path /ws/chat — this is set explicitly here.
     */
    connect(wsUrl: string): void {
        if (this.socket?.connected) return;

        const token = localStorage.getItem("token");

        // Strip any pathname — Socket.IO must receive just the origin.
        // Also normalise wss:// → https:// (Socket.IO handles the WS upgrade).
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
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
            console.log("[ChatSocket] Connected");
            // Rejoin room if we had one
            if (this.eventId) {
                this.joinRoom(this.eventId);
            }
        });

        this.socket.on("disconnect", (reason) => {
            console.log("[ChatSocket] Disconnected:", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.error("[ChatSocket] Connection error:", error);
        });

        // Register all event handlers
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
     * Join a chat room
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
     * Send typing indicator (debounced)
     */
    sendTyping(): void {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
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
     * Register event handlers
     */
    on<K extends keyof ChatSocketEvents>(
        event: K,
        handler: ChatSocketEvents[K]
    ): void {
        this.handlers[event] = handler;
    }

    /**
     * Remove event handler
     */
    off<K extends keyof ChatSocketEvents>(event: K): void {
        delete this.handlers[event];
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

    /** Register a one-off event listener on the underlying socket */
    onRaw(event: string, handler: (data: any) => void): void {
        // Remove previous listener for this event first to avoid duplicates
        this.socket?.off(event);
        this.socket?.on(event, handler);
    }

    /** Remove a raw event listener */
    offRaw(event: string): void {
        this.socket?.off(event);
    }

    /**
     * Get current event ID
     */
    getCurrentEventId(): string | null {
        return this.eventId;
    }

    /**
     * Setup all WebSocket event listeners
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
