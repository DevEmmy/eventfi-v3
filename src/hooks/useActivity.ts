"use client";

import { useEffect, useCallback, useRef } from "react";
import { useActivityStore } from "@/store/useActivityStore";
import { ActivityService, EventActivity, DrawResult } from "@/services/activity";
import { activitySocket } from "@/services/activitySocket";
import customToast from "@/lib/toast";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

export function useActivity(eventId: string, isOrganizer: boolean = false) {
    const store = useActivityStore();
    const isInitialized = useRef(false);

    // Fetch active activity on mount
    useEffect(() => {
        if (!eventId || isInitialized.current) return;
        isInitialized.current = true;

        ActivityService.getActive(eventId)
            .then((activity) => {
                if (activity) {
                    store.setActiveActivity(activity);

                    if (activity.type === "APPLAUSE_METER" && activity.results) {
                        const r = activity.results as any;
                        store.setTapCount(
                            r.totalTaps || 0,
                            r.participantCount || 0
                        );
                    }

                    if (activity.type === "LUCKY_DRAW" && activity.results) {
                        const r = activity.results as any;
                        if (r.winners) {
                            store.setDrawResult(r.winners, r.totalPool || 0);
                        }
                    }
                }
            })
            .catch(() => {});
    }, [eventId]);

    // Connect socket and listen for WS activity events
    useEffect(() => {
        if (!eventId) return;

        activitySocket.connect(WS_URL);

        activitySocket.on("activity:started", (_data) => {
            ActivityService.getActive(eventId)
                .then((activity) => {
                    if (activity) store.setActiveActivity(activity);
                })
                .catch(() => {});
        });

        activitySocket.on("activity:draw_result", (data) => {
            store.setDrawResult(data.winners, data.totalPool);
            store.showReveal();
        });

        activitySocket.on("activity:tap_update", (data) => {
            store.setTapCount(data.totalTaps, data.participantCount);
        });

        activitySocket.on("activity:ended", (_data) => {
            store.setActiveActivity(null);
            // Keep results visible for a few seconds before clearing
            setTimeout(() => store.reset(), 5000);
        });

        return () => {
            activitySocket.off("activity:started");
            activitySocket.off("activity:draw_result");
            activitySocket.off("activity:tap_update");
            activitySocket.off("activity:ended");
        };
    }, [eventId]);

    // -------------------------------------------------------------------------
    // ORGANIZER ACTIONS
    // -------------------------------------------------------------------------

    const createAndStart = useCallback(
        async (
            type: "LUCKY_DRAW" | "APPLAUSE_METER",
            config: Record<string, any> = {}
        ): Promise<EventActivity> => {
            store.setIsLoading(true);
            try {
                const activity = await ActivityService.create(
                    eventId,
                    type,
                    config
                );
                const started = await ActivityService.start(
                    eventId,
                    activity.id
                );
                store.setActiveActivity(started);
                // Broadcast to all attendees via WS
                activitySocket.emitStart({
                    eventId,
                    activityId: started.id,
                    type: started.type,
                });
                return started;
            } catch (e: any) {
                customToast.error(
                    e.response?.data?.message ||
                        e.message ||
                        "Failed to start activity"
                );
                throw e;
            } finally {
                store.setIsLoading(false);
            }
        },
        [eventId]
    );

    const performDraw = useCallback(
        async (activityId: string): Promise<DrawResult> => {
            store.setIsLoading(true);
            try {
                const result = await ActivityService.draw(eventId, activityId);
                store.setDrawResult(result.winners, result.totalPool);
                store.showReveal();
                // Broadcast draw result via WS
                activitySocket.emitBroadcastDraw({
                    eventId,
                    activityId,
                    winners: result.winners,
                    totalPool: result.totalPool,
                });
                return result;
            } catch (e: any) {
                customToast.error(
                    e.response?.data?.message || e.message || "Draw failed"
                );
                throw e;
            } finally {
                store.setIsLoading(false);
            }
        },
        [eventId]
    );

    const endActivity = useCallback(
        async (activityId: string): Promise<EventActivity> => {
            store.setIsLoading(true);
            try {
                const activity = await ActivityService.end(eventId, activityId);
                activitySocket.emitEnd({
                    eventId,
                    activityId,
                    results: activity.results ?? null,
                });
                store.setActiveActivity(null);
                setTimeout(() => store.reset(), 3000);
                return activity;
            } catch (e: any) {
                customToast.error(
                    e.response?.data?.message ||
                        e.message ||
                        "Failed to end activity"
                );
                throw e;
            } finally {
                store.setIsLoading(false);
            }
        },
        [eventId]
    );

    // -------------------------------------------------------------------------
    // ATTENDEE ACTIONS
    // -------------------------------------------------------------------------

    const tapApplause = useCallback(
        async (activityId: string): Promise<void> => {
            if (store.hasUserTapped) return; // Debounce
            store.setHasUserTapped(true);
            try {
                const result = await ActivityService.tap(eventId, activityId);
                store.setTapCount(result.totalTaps, result.participantCount);
                // Broadcast tap update via WS
                activitySocket.emitTap({
                    eventId,
                    activityId,
                    totalTaps: result.totalTaps,
                    participantCount: result.participantCount,
                });
            } catch (_e) {
                store.setHasUserTapped(false);
            }
            // Re-enable tapping after 500 ms (allow multiple taps but rate-limited)
            setTimeout(() => store.setHasUserTapped(false), 500);
        },
        [eventId, store.hasUserTapped]
    );

    return {
        // State
        activeActivity: store.activeActivity,
        drawWinners: store.drawWinners,
        drawTotalPool: store.drawTotalPool,
        showDrawReveal: store.showDrawReveal,
        totalTaps: store.totalTaps,
        participantCount: store.participantCount,
        isLoading: store.isLoading,
        // Actions
        createAndStart,
        performDraw,
        endActivity,
        tapApplause,
        hideReveal: store.hideReveal,
    };
}
