"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MessageText1,
  CloseCircle,
  Send,
  SearchNormal1,
  ArrowLeft2,
  User,
  Calendar,
  Location,
  People,
  Refresh,
  WifiSquare,
} from "iconsax-react";
import { ChatService } from "@/services/chat";
import { chatSocket } from "@/services/chatSocket";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { useMessengerStore } from "@/store/useMessengerStore";
import axiosInstance from "@/lib/axios";
import customToast from "@/lib/toast";
import { ChatMessage, EventChatInfo, ChatRole } from "@/types/chat";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

interface EventChatPreview {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  organizerName: string;
  participantCount: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string | null;
  userRole?: ChatRole;
}

const FloatingMessenger: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const chatStore = useChatStore();
  const {
    isOpen,
    activeEventId: storeActiveEventId,
    closeMessenger,
    toggleMessenger,
    clearActiveEvent,
  } = useMessengerStore();

  const [localActiveEventId, setLocalActiveEventId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventChats, setEventChats] = useState<EventChatPreview[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [slowModeRemaining, setSlowModeRemaining] = useState(0);

  // Sync store's activeEventId with local state
  const activeEventId = storeActiveEventId || localActiveEventId;

  // Stable refs — let handlers always read the latest values without re-registering
  const activeEventIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const lastSentAtRef = useRef<number>(0);
  const slowModeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typing accumulation: map of userId → { id, name } with per-user clear timers
  const typingUsersMapRef = useRef<Map<string, { id: string; name: string }>>(new Map());
  const typingClearTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTypingRef = useRef(false);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const totalUnreadCount = eventChats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const activeEventChat = eventChats.find((c) => c.eventId === activeEventId);
  const slowModeSeconds = chatStore.chatInfo?.slowMode ?? 0;

  // Keep refs in sync
  useEffect(() => { activeEventIdRef.current = activeEventId; }, [activeEventId]);
  useEffect(() => { userIdRef.current = user?.id; }, [user?.id]);

  // ── Stable socket event handlers (set up once, use refs for current values) ─

  useEffect(() => {
    // Connection state tracking
    const unsubConnect = chatSocket.onConnect(() => setIsSocketConnected(true));
    const unsubDisconnect = chatSocket.onDisconnect(() => setIsSocketConnected(false));
    setIsSocketConnected(chatSocket.isConnected());

    chatSocket.on("chat:joined", (data) => {
      chatStore.setMessages(data.recentMessages);
      chatStore.setChatInfo(data.chat);
      chatStore.setOnlineCount(data.chat.onlineCount);
      chatStore.setConnected(true);
    });

    chatSocket.on("chat:message", (data) => {
      chatStore.addMessage(data.message);
      setEventChats((prev) =>
        prev.map((c) =>
          c.eventId === activeEventIdRef.current
            ? {
                ...c,
                lastMessage: `${data.message.sender.name}: ${data.message.content}`,
                lastMessageTime: data.message.createdAt,
                unreadCount: 0, // already viewing this chat
              }
            : c
        )
      );
    });

    chatSocket.on("chat:message:deleted", (data) => {
      chatStore.removeMessage(data.messageId);
    });

    chatSocket.on("chat:message:pinned", (data) => {
      chatStore.updateMessage(data.message.id, { isPinned: data.message.isPinned });
      if (data.message.isPinned) {
        chatStore.addPinnedMessage(data.message);
      } else {
        chatStore.removePinnedMessage(data.message.id);
      }
    });

    chatSocket.on("chat:member:joined", (data) => {
      chatStore.addMember(data.member);
    });

    chatSocket.on("chat:member:left", (data) => {
      chatStore.removeMember(data.userId);
    });

    chatSocket.on("chat:member:muted", (data) => {
      if (data.userId === userIdRef.current) {
        chatStore.setIsMuted(data.until !== null);
        if (data.until !== null) {
          customToast.error("You have been muted in this chat");
        }
      }
    });

    chatSocket.on("chat:typing", (data) => {
      data.users.forEach((u) => {
        if (u.id === userIdRef.current) return;
        typingUsersMapRef.current.set(u.id, u);

        // Auto-clear this user's typing indicator after 4 s
        const existing = typingClearTimersRef.current.get(u.id);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => {
          typingUsersMapRef.current.delete(u.id);
          typingClearTimersRef.current.delete(u.id);
          chatStore.setTypingUsers(Array.from(typingUsersMapRef.current.values()));
        }, 4000);
        typingClearTimersRef.current.set(u.id, timer);
      });
      chatStore.setTypingUsers(Array.from(typingUsersMapRef.current.values()));
    });

    chatSocket.on("chat:typing:stop", (data) => {
      typingUsersMapRef.current.delete(data.userId);
      const timer = typingClearTimersRef.current.get(data.userId);
      if (timer) { clearTimeout(timer); typingClearTimersRef.current.delete(data.userId); }
      chatStore.setTypingUsers(Array.from(typingUsersMapRef.current.values()));
    });

    chatSocket.on("chat:settings", (data) => {
      // Use getState() to avoid stale closure on chatInfo
      const { chatInfo, setChatInfo } = useChatStore.getState();
      if (chatInfo) {
        setChatInfo({ ...chatInfo, slowMode: data.slowMode, isActive: data.isActive, readOnly: data.readOnly ?? !data.isActive });
      }
    });

    chatSocket.on("chat:error", (data) => {
      customToast.error(data.message);
    });

    return () => {
      unsubConnect();
      unsubDisconnect();
      chatSocket.off("chat:joined");
      chatSocket.off("chat:message");
      chatSocket.off("chat:message:deleted");
      chatSocket.off("chat:message:pinned");
      chatSocket.off("chat:member:joined");
      chatSocket.off("chat:member:left");
      chatSocket.off("chat:member:muted");
      chatSocket.off("chat:typing");
      chatSocket.off("chat:typing:stop");
      chatSocket.off("chat:settings");
      chatSocket.off("chat:error");
    };
  }, []); // stable — refs handle latest values

  // ── Load event chats when drawer opens ───────────────────────────────────

  useEffect(() => {
    if (user?.id && isOpen) {
      loadEventChats();
    }
  }, [user?.id, isOpen]);

  // ── Connect / join room when activeEventId changes ────────────────────────

  useEffect(() => {
    if (activeEventId) {
      initializeChat(activeEventId);
    }
    return () => {
      if (activeEventId) {
        chatSocket.leaveRoom();
        // Clear typing state for the room we're leaving
        typingUsersMapRef.current.clear();
        typingClearTimersRef.current.forEach((t) => clearTimeout(t));
        typingClearTimersRef.current.clear();
      }
    };
  }, [activeEventId]);

  // ── Auto-scroll on new messages ───────────────────────────────────────────

  useEffect(() => {
    if (activeEventId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatStore.messages.length, activeEventId]);

  // ── Focus input when chat opens ───────────────────────────────────────────

  useEffect(() => {
    if (isOpen && activeEventId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, activeEventId]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const loadEventChats = async () => {
    try {
      setLoadingChats(true);
      const response = await axiosInstance.get<{ status: string; data: EventChatPreview[] }>(
        "/user/event-chats"
      );
      if (response.data.status === "success") {
        setEventChats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load event chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const initializeChat = async (eventId: string) => {
    try {
      chatStore.setJoining(true);
      chatStore.setError(null);

      const joinResult = await ChatService.joinChat(eventId);

      if (!joinResult.canJoin) {
        chatStore.setCanJoin(false, joinResult.reason);
        customToast.error(
          joinResult.reason === "NO_TICKET"
            ? "You need a ticket to join this chat"
            : "Cannot join chat"
        );
        return;
      }

      chatStore.setChatInfo(joinResult.chat);
      chatStore.setCanJoin(true);

      // Connect socket (no-op if already connected)
      chatSocket.connect(WS_URL);
      // Join the room — will be sent immediately if connected, or queued until connection
      chatSocket.joinRoom(eventId);

      const pinnedMessages = await ChatService.getPinnedMessages(eventId);
      chatStore.setPinnedMessages(pinnedMessages);
    } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      chatStore.setError(error.response?.data?.message || "Failed to join chat");
      customToast.error("Failed to join chat");
    } finally {
      chatStore.setJoining(false);
    }
  };

  const startSlowModeCountdown = (seconds: number) => {
    if (slowModeIntervalRef.current) clearInterval(slowModeIntervalRef.current);
    setSlowModeRemaining(seconds);
    slowModeIntervalRef.current = setInterval(() => {
      setSlowModeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(slowModeIntervalRef.current!);
          slowModeIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeEventId) return;

    // Slow mode check
    if (slowModeSeconds > 0) {
      const elapsed = (Date.now() - lastSentAtRef.current) / 1000;
      if (elapsed < slowModeSeconds) {
        customToast.error(`Slow mode: wait ${Math.ceil(slowModeSeconds - elapsed)}s`);
        return;
      }
    }

    const content = messageInput.trim();
    setMessageInput("");
    lastSentAtRef.current = Date.now();

    if (slowModeSeconds > 0) {
      startSlowModeCountdown(slowModeSeconds);
    }

    if (chatSocket.isConnected()) {
      chatSocket.sendMessage({ content, type: "TEXT" });
    } else {
      // REST fallback — add optimistically, server won't WS-broadcast to us
      ChatService.sendMessage(activeEventId, { content, type: "TEXT" })
        .then((message) => {
          chatStore.addMessage(message);
        })
        .catch((error) => {
          customToast.error(error.response?.data?.message || "Failed to send message");
        });
    }
  }, [messageInput, activeEventId, slowModeSeconds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Debounced typing indicator
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      chatSocket.sendTyping();
    }
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (eventId: string) => {
    setLocalActiveEventId(eventId);
    setEventChats((prev) =>
      prev.map((c) => (c.eventId === eventId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleBack = () => {
    chatSocket.leaveRoom();
    chatStore.reset();
    setLocalActiveEventId(null);
    clearActiveEvent();
    setSlowModeRemaining(0);
    if (slowModeIntervalRef.current) {
      clearInterval(slowModeIntervalRef.current);
      slowModeIntervalRef.current = null;
    }
  };

  const handleClose = () => {
    // If in a chat, leave and reset before closing so next open shows list
    if (activeEventId) {
      chatSocket.leaveRoom();
      chatStore.reset();
      setLocalActiveEventId(null);
    }
    setSlowModeRemaining(0);
    if (slowModeIntervalRef.current) {
      clearInterval(slowModeIntervalRef.current);
      slowModeIntervalRef.current = null;
    }
    closeMessenger();
  };

  const loadMoreMessages = async () => {
    if (chatStore.isLoadingMessages || !chatStore.hasMoreMessages || !activeEventId) return;
    const oldestMessage = chatStore.messages[0];
    if (!oldestMessage) return;
    try {
      chatStore.setIsLoadingMessages(true);
      const result = await ChatService.getMessages(activeEventId, {
        before: oldestMessage.id,
        limit: 50,
      });
      chatStore.prependMessages(result.messages);
      chatStore.setHasMoreMessages(result.hasMore);
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      chatStore.setIsLoadingMessages(false);
    }
  };

  const filteredChats = eventChats.filter((chat) =>
    chat.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return "";
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const getRoleBadgeStyle = (role?: ChatRole) => {
    switch (role) {
      case "ORGANIZER": return "bg-primary/20 text-primary border-primary/30";
      case "MODERATOR": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-foreground/5 text-foreground border-foreground/10";
    }
  };

  const onlineCount = chatStore.onlineCount || chatStore.chatInfo?.onlineCount || 0;
  const isReadOnly = chatStore.chatInfo?.readOnly ?? false;
  const canSend = !chatStore.isMuted && !isReadOnly && slowModeRemaining === 0 && !!messageInput.trim();

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleMessenger}
        className={`fixed bottom-6 right-6 z-60 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer ${
          isOpen ? "scale-90" : "scale-100 hover:scale-110"
        }`}
        aria-label="Open messages"
      >
        {isOpen ? (
          <CloseCircle size={24} color="currentColor" variant="Bold" />
        ) : (
          <>
            <MessageText1 size={24} color="currentColor" variant="Bold" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background">
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] z-50 bg-background border-l border-foreground/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-background shrink-0">
          {activeEventId ? (
            <>
              <button
                onClick={handleBack}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Back to chat list"
              >
                <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              </button>
              <div className="flex items-center gap-3 flex-1 min-w-0 ml-1">
                {activeEventChat?.eventImage ? (
                  <img
                    src={activeEventChat.eventImage}
                    alt={activeEventChat.eventName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar size={20} color="currentColor" variant="Bold" className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {activeEventChat?.eventName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <People size={12} color="currentColor" variant="Outline" />
                    <span>
                      {onlineCount} online
                      {chatStore.typingUsers.length > 0 && (
                        <span className="text-primary ml-2">
                          {chatStore.typingUsers.map((u) => u.name).join(", ")} typing…
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Connection indicator */}
                <span
                  title={isSocketConnected ? "Connected" : "Reconnecting…"}
                  className={`w-2 h-2 rounded-full mr-1 ${
                    isSocketConnected ? "bg-green-500" : "bg-amber-400 animate-pulse"
                  }`}
                />
                <button
                  onClick={() => router.push(`/events/${activeEventId}`)}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                  title="View Event"
                >
                  <Calendar size={18} color="currentColor" variant="Outline" />
                </button>
                <button
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                  onClick={handleClose}
                >
                  <CloseCircle size={20} color="currentColor" variant="Outline" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">Event Chats</h3>
                {/* Connection dot when on list screen */}
                {isSocketConnected && (
                  <span className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                  onClick={loadEventChats}
                  disabled={loadingChats}
                  title="Refresh"
                >
                  <Refresh
                    size={20}
                    color="currentColor"
                    variant="Outline"
                    className={loadingChats ? "animate-spin" : ""}
                  />
                </button>
                <button
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                  onClick={handleClose}
                >
                  <CloseCircle size={20} color="currentColor" variant="Outline" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {activeEventId ? (
            // ── Chat View ────────────────────────────────────────────────────
            <>
              {/* Event Info Banner */}
              {activeEventChat && (
                <div className="px-4 py-2 bg-primary/5 border-b border-foreground/10 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <Calendar size={13} color="currentColor" variant="Outline" />
                    <span>{activeEventChat.eventDate}</span>
                    <span>•</span>
                    <Location size={13} color="currentColor" variant="Outline" />
                    <span className="truncate">{activeEventChat.eventLocation}</span>
                  </div>
                </div>
              )}

              {/* Slow mode banner */}
              {slowModeSeconds > 0 && (
                <div className="px-4 py-1 bg-amber-500/10 border-b border-amber-500/20 shrink-0">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Slow mode: {slowModeSeconds}s between messages
                    {slowModeRemaining > 0 && ` — wait ${slowModeRemaining}s`}
                  </p>
                </div>
              )}

              {/* Disconnected banner */}
              {!isSocketConnected && activeEventId && (
                <div className="px-4 py-2 bg-foreground/5 border-b border-foreground/10 flex items-center gap-2 shrink-0">
                  <WifiSquare size={14} color="currentColor" className="text-amber-500 animate-pulse" variant="Outline" />
                  <span className="text-xs text-foreground/60">Reconnecting…</span>
                </div>
              )}

              {/* Loading / Joining */}
              {chatStore.isJoining && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Error State */}
              {chatStore.error && !chatStore.isJoining && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <p className="text-foreground/60 text-center">{chatStore.error}</p>
                  <button
                    onClick={() => activeEventId && initializeChat(activeEventId)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Messages */}
              {!chatStore.isJoining && !chatStore.error && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {/* Load more */}
                    {chatStore.messages.length > 0 && chatStore.hasMoreMessages && (
                      <button
                        onClick={loadMoreMessages}
                        disabled={chatStore.isLoadingMessages}
                        className="w-full py-2 text-sm text-primary hover:underline disabled:opacity-50"
                      >
                        {chatStore.isLoadingMessages ? "Loading…" : "Load older messages"}
                      </button>
                    )}

                    {chatStore.messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <MessageText1 size={40} color="currentColor" variant="Outline" className="text-foreground/20 mb-3" />
                        <p className="text-foreground/50 text-sm">No messages yet. Say hi!</p>
                      </div>
                    )}

                    {chatStore.messages.map((message) => {
                      const isOwn = message.sender.id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {!isOwn && (
                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User size={16} color="currentColor" variant="Bold" className="text-foreground/60" />
                              )}
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] flex flex-col gap-1 ${
                              isOwn ? "items-end" : "items-start"
                            }`}
                          >
                            {!isOwn && (
                              <div className="flex items-center gap-2 px-1">
                                <span className="text-xs font-semibold text-foreground">
                                  {message.sender.name}
                                </span>
                                {message.sender.role && message.sender.role !== "MEMBER" && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                                      message.sender.role
                                    )}`}
                                  >
                                    {message.sender.role.toLowerCase()}
                                  </span>
                                )}
                              </div>
                            )}

                            {message.replyTo && (
                              <div className="px-3 py-1 bg-foreground/5 rounded-lg text-xs text-foreground/60 border-l-2 border-primary">
                                <span className="font-medium">{message.replyTo.senderName}</span>
                                <p className="truncate">{message.replyTo.content}</p>
                              </div>
                            )}

                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                message.type === "ANNOUNCEMENT"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : message.type === "SYSTEM"
                                  ? "bg-foreground/5 text-foreground/60 text-center w-full text-xs italic"
                                  : isOwn
                                  ? "bg-primary text-white rounded-br-sm"
                                  : "bg-foreground/5 text-foreground rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap wrap-break-word">
                                {message.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-foreground/50 px-1">
                              <span>{formatTime(message.createdAt)}</span>
                              {message.isPinned && <span title="Pinned">📌</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-foreground/10 bg-background shrink-0">
                    {isReadOnly ? (
                      <div className="text-center text-sm text-foreground/50 py-3 px-4 bg-foreground/5 rounded-xl">
                        💬 Chat is paused — you can read messages but cannot send new ones
                      </div>
                    ) : chatStore.isMuted ? (
                      <div className="text-center text-sm text-foreground/60 py-3">
                        You are muted in this chat
                      </div>
                    ) : (
                      <div className="flex items-end gap-2">
                        <input
                          ref={inputRef}
                          type="text"
                          value={messageInput}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPress}
                          placeholder={
                            slowModeRemaining > 0
                              ? `Wait ${slowModeRemaining}s…`
                              : "Type a message…"
                          }
                          disabled={slowModeRemaining > 0}
                          className="flex-1 px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40 disabled:opacity-50"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!canSend}
                          className="w-11 h-11 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                        >
                          <Send size={20} color="currentColor" variant="Bold" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            // ── Event Chats List ─────────────────────────────────────────────
            <>
              <div className="p-4 border-b border-foreground/10 shrink-0">
                <div className="relative">
                  <SearchNormal1
                    size={18}
                    color="currentColor"
                    variant="Outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events…"
                    className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {loadingChats ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-8 text-center">
                    <Calendar size={48} color="currentColor" variant="Outline" className="text-foreground/30 mx-auto mb-3" />
                    <p className="text-foreground/60">
                      {searchQuery ? "No events found" : "No event chats yet"}
                    </p>
                    <p className="text-sm text-foreground/50 mt-2">
                      Join events to start chatting with the community!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-foreground/10">
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.eventId)}
                        className="w-full p-4 hover:bg-foreground/5 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {chat.eventImage ? (
                            <img
                              src={chat.eventImage}
                              alt={chat.eventName}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-foreground truncate text-sm">
                                {chat.eventName}
                              </h4>
                              <span className="text-xs text-foreground/50 shrink-0 ml-2">
                                {formatTime(chat.lastMessageTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1 text-xs text-foreground/60">
                              <People size={12} color="currentColor" variant="Outline" />
                              <span>{chat.participantCount.toLocaleString()}</span>
                              {chat.userRole === "ORGANIZER" && (
                                <><span>•</span><span className="text-primary font-medium">Organizer</span></>
                              )}
                              {chat.userRole === "MODERATOR" && (
                                <><span>•</span><span className="text-secondary font-medium">Moderator</span></>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm text-foreground/70 truncate">
                                {chat.lastMessage || "No messages yet"}
                              </p>
                              {chat.unreadCount > 0 && (
                                <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                                  {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingMessenger;
