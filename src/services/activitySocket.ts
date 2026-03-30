/**
 * Activity socket — delegates to the existing chatSocket connection.
 *
 * The Socket.IO server listens on path /ws/chat.  Creating a second
 * independent connection from activitySocket (which used the default
 * /socket.io/ path) caused every connection attempt to fail.  Instead
 * we reuse chatSocket's already-connected socket so there is exactly
 * one WebSocket connection per client session.
 */

import { chatSocket } from "./chatSocket";

// ---------------------------------------------------------------------------
// Event payload types (re-exported for consumers)
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

// ---------------------------------------------------------------------------
// Emit payload types
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
// Facade — all calls go through chatSocket's raw socket
// ---------------------------------------------------------------------------

class ActivitySocketFacade {
    _pendingEventId: string | null = null;

    /** No-op: connection is owned by chatSocket */
    connect(_wsUrl: string): void {
        // chatSocket manages the connection; nothing to do here.
        // Re-join room if we already have one (handles reconnects)
        if (this._pendingEventId) {
            this.joinEventRoom(this._pendingEventId);
        }
    }

    /** Join the activity room for an event */
    joinEventRoom(eventId: string): void {
        this._pendingEventId = eventId;
        chatSocket.emitRaw("activity:join_event", { eventId });
    }

    // ── Organizer emits ────────────────────────────────────────────────────

    emitStart(payload: ActivityStartEmit): void {
        chatSocket.emitRaw("activity:start", payload);
    }

    emitBroadcastDraw(payload: ActivityBroadcastDrawEmit): void {
        chatSocket.emitRaw("activity:broadcast_draw", payload);
    }

    emitEnd(payload: ActivityEndEmit): void {
        chatSocket.emitRaw("activity:end", payload);
    }

    // ── Attendee emits ─────────────────────────────────────────────────────

    emitTap(payload: ActivityTapEmit): void {
        chatSocket.emitRaw("activity:tap", payload);
    }

    // ── Event listener registration ────────────────────────────────────────

    on(event: string, handler: (data: any) => void): void {
        chatSocket.onRaw(event, handler);
    }

    off(event: string): void {
        chatSocket.offRaw(event);
    }
}

export const activitySocket = new ActivitySocketFacade();
