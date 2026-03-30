import { io, Socket } from "socket.io-client";

// ---------------------------------------------------------------------------
// Activity socket event payloads
// ---------------------------------------------------------------------------

export interface ActivityStartedEvent {
    activityId: string;
    type: string;
}

export interface ActivityDrawCountdownEvent {
    activityId: string;
    seconds: number;
}

export interface ActivityDrawResultEvent {
    activityId: string;
    winners: Array<{
        userId: string;
        name: string;
        avatar: string | null;
        username: string | null;
    }>;
    totalPool: number;
}

export interface ActivityTapUpdateEvent {
    activityId: string;
    totalTaps: number;
    participantCount: number;
}

export interface ActivityEndedEvent {
    activityId: string;
    results: Record<string, any> | null;
}

type ActivityEventHandler<T> = (data: T) => void;

interface ActivitySocketEvents {
    "activity:started": ActivityEventHandler<ActivityStartedEvent>;
    "activity:draw_countdown": ActivityEventHandler<ActivityDrawCountdownEvent>;
    "activity:draw_result": ActivityEventHandler<ActivityDrawResultEvent>;
    "activity:tap_update": ActivityEventHandler<ActivityTapUpdateEvent>;
    "activity:ended": ActivityEventHandler<ActivityEndedEvent>;
}

// ---------------------------------------------------------------------------
// Activity emit payloads
// ---------------------------------------------------------------------------

interface ActivityStartEmit {
    eventId: string;
    activityId: string;
    type: string;
}

interface ActivityBroadcastDrawEmit {
    eventId: string;
    activityId: string;
    winners: Array<{
        userId: string;
        name: string;
        avatar: string | null;
        username: string | null;
    }>;
    totalPool: number;
}

interface ActivityTapEmit {
    eventId: string;
    activityId: string;
    totalTaps: number;
    participantCount: number;
}

interface ActivityEndEmit {
    eventId: string;
    activityId: string;
    results: Record<string, any> | null;
}

// ---------------------------------------------------------------------------
// Client class
// ---------------------------------------------------------------------------

class ActivitySocketService {
    private socket: Socket | null = null;
    private handlers: Partial<ActivitySocketEvents> = {};
    _pendingEventId: string | null = null;

    /**
     * Connect to the activity WebSocket namespace.
     * Reuses the same server URL as the chat socket but connects independently
     * so activity events are isolated from chat events.
     */
    connect(wsUrl: string): void {
        if (this.socket?.connected) return;

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        this.socket = io(wsUrl, {
            auth: { token },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
            console.log("[ActivitySocket] Connected");
            // Re-join room if we have a pending eventId
            if (this._pendingEventId) {
                this.socket?.emit("activity:join_event", { eventId: this._pendingEventId });
            }
        });

        this.socket.on("disconnect", (reason) => {
            console.log("[ActivitySocket] Disconnected:", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.error("[ActivitySocket] Connection error:", error);
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
        }
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    /**
     * Register an event handler
     */
    on<K extends keyof ActivitySocketEvents>(
        event: K,
        handler: ActivitySocketEvents[K]
    ): void {
        this.handlers[event] = handler;
    }

    /**
     * Remove an event handler
     */
    off<K extends keyof ActivitySocketEvents>(event: K): void {
        delete this.handlers[event];
    }

    // ---------------------------------------------------------------------------
    // Room management
    // ---------------------------------------------------------------------------

    joinEventRoom(eventId: string): void {
        this._pendingEventId = eventId;
        if (this.socket?.connected) {
            this.socket.emit("activity:join_event", { eventId });
        }
    }

    // ---------------------------------------------------------------------------
    // Emit helpers (organizer)
    // ---------------------------------------------------------------------------

    emitStart(payload: ActivityStartEmit): void {
        this.socket?.emit("activity:start", payload);
    }

    emitBroadcastDraw(payload: ActivityBroadcastDrawEmit): void {
        this.socket?.emit("activity:broadcast_draw", payload);
    }

    emitEnd(payload: ActivityEndEmit): void {
        this.socket?.emit("activity:end", payload);
    }

    // ---------------------------------------------------------------------------
    // Emit helpers (attendee)
    // ---------------------------------------------------------------------------

    emitTap(payload: ActivityTapEmit): void {
        this.socket?.emit("activity:tap", payload);
    }

    // ---------------------------------------------------------------------------
    // Private
    // ---------------------------------------------------------------------------

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on("activity:started", (data: ActivityStartedEvent) => {
            this.handlers["activity:started"]?.(data);
        });

        this.socket.on(
            "activity:draw_countdown",
            (data: ActivityDrawCountdownEvent) => {
                this.handlers["activity:draw_countdown"]?.(data);
            }
        );

        this.socket.on(
            "activity:draw_result",
            (data: ActivityDrawResultEvent) => {
                this.handlers["activity:draw_result"]?.(data);
            }
        );

        this.socket.on(
            "activity:tap_update",
            (data: ActivityTapUpdateEvent) => {
                this.handlers["activity:tap_update"]?.(data);
            }
        );

        this.socket.on("activity:ended", (data: ActivityEndedEvent) => {
            this.handlers["activity:ended"]?.(data);
        });
    }
}

// Export singleton instance
export const activitySocket = new ActivitySocketService();
