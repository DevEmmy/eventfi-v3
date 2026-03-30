"use client";

import { useEffect, useCallback, useRef } from "react";
import { useActivityStore } from "@/store/useActivityStore";
import { ActivityService, EventActivity, DrawResult } from "@/services/activity";
import { activitySocket } from "@/services/activitySocket";
import { chatSocket } from "@/services/chatSocket";
import customToast from "@/lib/toast";

const COUNTDOWN_SECONDS = 10;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000";

export function useActivity(eventId: string, isOrganizer: boolean = false) {
    const store = useActivityStore();
    const isInitialized = useRef(false);
    const applauseTickRef = useRef<NodeJS.Timeout | null>(null);

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

    // Helper: start the applause countdown ticker
    const startApplauseTicker = useCallback((endsAt: number) => {
        if (applauseTickRef.current) clearInterval(applauseTickRef.current);
        const tick = () => {
            const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
            store.setApplauseTimeLeft(left);
            if (left <= 0) {
                clearInterval(applauseTickRef.current!);
                applauseTickRef.current = null;
            }
        };
        tick();
        applauseTickRef.current = setInterval(tick, 500);
    }, []);

    // Connect socket, join the activity room, and listen for WS activity events
    useEffect(() => {
        if (!eventId) return;

        // Ensure chatSocket is connected — activitySocket is a facade on top of it
        if (!chatSocket.isConnected()) {
            chatSocket.connect(WS_URL);
        }
        // Join the dedicated activity room so we receive game events
        activitySocket.joinEventRoom(eventId);

        activitySocket.on("activity:started", (data: any) => {
            ActivityService.getActive(eventId)
                .then((activity) => {
                    if (activity) {
                        store.setActiveActivity(activity);
                        // If applause meter with a duration, start local ticker
                        if (
                            activity.type === "APPLAUSE_METER" &&
                            data?.durationSeconds > 0 &&
                            data?.startedAt
                        ) {
                            const endsAt = data.startedAt + data.durationSeconds * 1000;
                            store.setApplauseDuration(data.durationSeconds);
                            startApplauseTicker(endsAt);
                        }
                    }
                })
                .catch(() => {});
        });

        // Countdown: tick from COUNTDOWN_SECONDS down to 0
        activitySocket.on("activity:draw_countdown", (_data: any) => {
            store.setDrawCountdown(COUNTDOWN_SECONDS);
            let n = COUNTDOWN_SECONDS;
            const tick = setInterval(() => {
                n -= 1;
                if (n <= 0) {
                    clearInterval(tick);
                    store.setDrawCountdown(null);
                } else {
                    store.setDrawCountdown(n);
                }
            }, 1000);
        });

        activitySocket.on("activity:draw_result", (data: any) => {
            store.setDrawResult(data.winners, data.totalPool);
            store.setDrawCountdown(null);
            store.showReveal();
        });

        activitySocket.on("activity:tap_update", (data: any) => {
            store.setTapCount(
                data.totalTaps,
                data.participantCount,
                undefined,    // myTaps comes from tap_ack, not broadcast
                data.leaderboard
            );
        });

        // Server ack with this user's personal tap count
        activitySocket.on("activity:tap_ack", (data: any) => {
            store.setTapCount(
                store.totalTaps,   // keep current broadcast total
                store.participantCount,
                data.myTaps
            );
        });

        activitySocket.on("activity:ended", (_data: any) => {
            store.setActiveActivity(null);
            store.setDrawCountdown(null);
            store.setApplauseTimeLeft(null);
            if (applauseTickRef.current) {
                clearInterval(applauseTickRef.current);
                applauseTickRef.current = null;
            }
            // Keep results visible for a few seconds before clearing
            setTimeout(() => store.reset(), 5000);
        });

        return () => {
            activitySocket.off("activity:started");
            activitySocket.off("activity:draw_countdown");
            activitySocket.off("activity:draw_result");
            activitySocket.off("activity:tap_update");
            activitySocket.off("activity:tap_ack");
            activitySocket.off("activity:ended");
            if (applauseTickRef.current) {
                clearInterval(applauseTickRef.current);
                applauseTickRef.current = null;
            }
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

                const durationSeconds: number = config.durationSeconds || 0;

                // Broadcast to all attendees via WS
                activitySocket.emitStart({
                    eventId,
                    activityId: started.id,
                    type: started.type,
                    durationSeconds,
                });

                // Organizer starts local applause ticker immediately
                if (type === "APPLAUSE_METER" && durationSeconds > 0) {
                    const endsAt = Date.now() + durationSeconds * 1000;
                    store.setApplauseDuration(durationSeconds);
                    startApplauseTicker(endsAt);
                }

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
        [eventId, startApplauseTicker]
    );

    const performDraw = useCallback(
        async (activityId: string): Promise<DrawResult> => {
            store.setIsLoading(true);
            try {
                const result = await ActivityService.draw(eventId, activityId);
                // Store the result but don't reveal yet — countdown first
                store.setDrawResult(result.winners, result.totalPool);
                // Broadcast to all attendees (server adds 10s delay before draw_result)
                activitySocket.emitBroadcastDraw({
                    eventId,
                    activityId,
                    winners: result.winners,
                    totalPool: result.totalPool,
                });
                // Organizer also counts down locally (server will echo back via WS too)
                store.setDrawCountdown(COUNTDOWN_SECONDS);
                let n = COUNTDOWN_SECONDS;
                const tick = setInterval(() => {
                    n -= 1;
                    if (n <= 0) {
                        clearInterval(tick);
                        store.setDrawCountdown(null);
                        store.showReveal();
                    } else {
                        store.setDrawCountdown(n);
                    }
                }, 1000);
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
                store.setApplauseTimeLeft(null);
                if (applauseTickRef.current) {
                    clearInterval(applauseTickRef.current);
                    applauseTickRef.current = null;
                }
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
        (activityId: string): void => {
            if (store.hasUserTapped) return; // Debounce
            store.setHasUserTapped(true);

            // Optimistic: increment local counts immediately so UI feels instant
            store.setTapCount(
                store.totalTaps + 1,
                store.participantCount,
                store.myTaps + 1
            );

            // Emit via socket — server persists and broadcasts real totals to all
            activitySocket.emitTap({ eventId, activityId });

            // Re-enable after 150ms (fast but prevents runaway clicks)
            setTimeout(() => store.setHasUserTapped(false), 150);
        },
        [eventId, store.hasUserTapped, store.totalTaps, store.participantCount, store.myTaps]
    );

    return {
        // State
        activeActivity: store.activeActivity,
        drawWinners: store.drawWinners,
        drawTotalPool: store.drawTotalPool,
        showDrawReveal: store.showDrawReveal,
        drawCountdown: store.drawCountdown,
        totalTaps: store.totalTaps,
        participantCount: store.participantCount,
        myTaps: store.myTaps,
        leaderboard: store.leaderboard,
        applauseTimeLeft: store.applauseTimeLeft,
        isLoading: store.isLoading,
        // Actions
        createAndStart,
        performDraw,
        endActivity,
        tapApplause,
        hideReveal: store.hideReveal,
    };
}
