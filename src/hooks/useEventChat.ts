"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChatService } from "@/services/chat";
import { chatSocket } from "@/services/chatSocket";
import { useChatStore } from "@/store/useChatStore";
import customToast from "@/lib/toast";
import {
    ChatMessagePayload,
    ModerateMessagePayload,
    MuteUserPayload,
    UpdateChatSettingsPayload,
} from "@/types/chat";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

export function useEventChat(eventId: string) {
    const store = useChatStore();
    const hasJoined = useRef(false);

    // Initialize chat - join room and setup listeners
    const initializeChat = useCallback(async () => {
        if (hasJoined.current) return;

        try {
            store.setJoining(true);
            store.setError(null);

            // Get chat info and check if user can join
            const joinResult = await ChatService.joinChat(eventId);

            if (!joinResult.canJoin) {
                store.setCanJoin(false, joinResult.reason);
                return;
            }

            store.setChatInfo(joinResult.chat);
            store.setCanJoin(true);

            // Connect to WebSocket
            chatSocket.connect(WS_URL);

            // Setup event handlers
            chatSocket.on("chat:joined", (data) => {
                store.setMessages(data.recentMessages);
                store.setConnected(true);
                hasJoined.current = true;
            });

            chatSocket.on("chat:message", (data) => {
                store.addMessage(data.message);
            });

            chatSocket.on("chat:message:deleted", (data) => {
                store.removeMessage(data.messageId);
            });

            chatSocket.on("chat:message:pinned", (data) => {
                store.updateMessage(data.message.id, { isPinned: data.message.isPinned });
                if (data.message.isPinned) {
                    store.addPinnedMessage(data.message);
                } else {
                    store.removePinnedMessage(data.message.id);
                }
            });

            chatSocket.on("chat:member:joined", (data) => {
                store.addMember(data.member);
            });

            chatSocket.on("chat:member:left", (data) => {
                store.removeMember(data.userId);
            });

            chatSocket.on("chat:member:muted", (data) => {
                store.updateMember(data.userId, {
                    isMuted: data.until !== null,
                });
            });

            chatSocket.on("chat:typing", (data) => {
                store.setTypingUsers(data.users);
            });

            chatSocket.on("chat:settings", (data) => {
                if (store.chatInfo) {
                    store.setChatInfo({
                        ...store.chatInfo,
                        slowMode: data.slowMode,
                        isActive: data.isActive,
                    });
                }
            });

            chatSocket.on("chat:error", (data) => {
                store.setError(data.message);
                customToast.error(data.message);
            });

            // Join the room
            chatSocket.joinRoom(eventId);

            // Load pinned messages
            const pinnedMessages = await ChatService.getPinnedMessages(eventId);
            store.setPinnedMessages(pinnedMessages);

        } catch (error: any) {
            console.error("Failed to initialize chat:", error);
            store.setError(error.response?.data?.message || "Failed to join chat");
            customToast.error("Failed to join chat");
        } finally {
            store.setJoining(false);
        }
    }, [eventId, store]);

    // Load more messages (pagination)
    const loadMoreMessages = useCallback(async () => {
        if (store.isLoadingMessages || !store.hasMoreMessages) return;

        const oldestMessage = store.messages[0];
        if (!oldestMessage) return;

        try {
            store.setIsLoadingMessages(true);
            const result = await ChatService.getMessages(eventId, {
                before: oldestMessage.id,
                limit: 50,
            });

            store.prependMessages(result.messages);
            store.setHasMoreMessages(result.hasMore);
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            store.setIsLoadingMessages(false);
        }
    }, [eventId, store]);

    // Send a message
    const sendMessage = useCallback(
        (payload: ChatMessagePayload) => {
            if (store.isMuted) {
                customToast.error("You are muted");
                return;
            }

            if (chatSocket.isConnected()) {
                chatSocket.sendMessage(payload);
            } else {
                // Fallback to REST API
                ChatService.sendMessage(eventId, payload)
                    .then((message) => {
                        store.addMessage(message);
                    })
                    .catch((error) => {
                        customToast.error(
                            error.response?.data?.message || "Failed to send message"
                        );
                    });
            }
        },
        [eventId, store]
    );

    // Send typing indicator
    const sendTyping = useCallback(() => {
        chatSocket.sendTyping();
    }, []);

    // Moderate a message
    const moderateMessage = useCallback(
        async (messageId: string, action: ModerateMessagePayload["action"]) => {
            try {
                await ChatService.moderateMessage(eventId, messageId, { action });

                if (action === "delete") {
                    store.removeMessage(messageId);
                    customToast.success("Message deleted");
                } else if (action === "pin") {
                    const message = store.messages.find((m) => m.id === messageId);
                    if (message) {
                        store.updateMessage(messageId, { isPinned: true });
                        store.addPinnedMessage({ ...message, isPinned: true });
                    }
                    customToast.success("Message pinned");
                } else if (action === "unpin") {
                    store.updateMessage(messageId, { isPinned: false });
                    store.removePinnedMessage(messageId);
                    customToast.success("Message unpinned");
                }
            } catch (error: any) {
                customToast.error(
                    error.response?.data?.message || "Failed to moderate message"
                );
            }
        },
        [eventId, store]
    );

    // Mute/unmute a user
    const muteUser = useCallback(
        async (userId: string, payload: MuteUserPayload) => {
            try {
                await ChatService.muteUser(eventId, userId, payload);
                store.updateMember(userId, { isMuted: payload.duration > 0 });
                customToast.success(
                    payload.duration > 0 ? "User muted" : "User unmuted"
                );
            } catch (error: any) {
                customToast.error(
                    error.response?.data?.message || "Failed to mute user"
                );
            }
        },
        [eventId, store]
    );

    // Update chat settings
    const updateSettings = useCallback(
        async (payload: UpdateChatSettingsPayload) => {
            try {
                await ChatService.updateSettings(eventId, payload);
                if (store.chatInfo) {
                    store.setChatInfo({
                        ...store.chatInfo,
                        ...payload,
                    });
                }
                customToast.success("Settings updated");
            } catch (error: any) {
                customToast.error(
                    error.response?.data?.message || "Failed to update settings"
                );
            }
        },
        [eventId, store]
    );

    // Load members
    const loadMembers = useCallback(
        async (onlineOnly = false) => {
            try {
                const result = await ChatService.getMembers(eventId, {
                    online: onlineOnly,
                    limit: 50,
                });
                store.setMembers(result.members);
                store.setOnlineCount(result.online);
            } catch (error) {
                console.error("Failed to load members:", error);
            }
        },
        [eventId, store]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            chatSocket.leaveRoom();
            store.reset();
            hasJoined.current = false;
        };
    }, [eventId, store]);

    return {
        // State
        isConnected: store.isConnected,
        isJoining: store.isJoining,
        error: store.error,
        chatInfo: store.chatInfo,
        canJoin: store.canJoin,
        joinError: store.joinError,
        messages: store.messages,
        pinnedMessages: store.pinnedMessages,
        hasMoreMessages: store.hasMoreMessages,
        isLoadingMessages: store.isLoadingMessages,
        members: store.members,
        onlineCount: store.onlineCount,
        typingUsers: store.typingUsers,
        userRole: store.userRole,
        isMuted: store.isMuted,

        // Actions
        initializeChat,
        loadMoreMessages,
        sendMessage,
        sendTyping,
        moderateMessage,
        muteUser,
        updateSettings,
        loadMembers,
    };
}
