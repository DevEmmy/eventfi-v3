"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MessageText1,
  CloseCircle,
  Send,
  SearchNormal1,
  TickCircle,
  Clock,
  ArrowLeft2,
  User,
  Calendar,
  Location,
  People,
  Refresh,
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
  lastMessageTime: Date;
  userRole?: ChatRole;
}

const FloatingMessenger: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const chatStore = useChatStore();
  const {
    isOpen,
    activeEventId: storeActiveEventId,
    openMessenger,
    closeMessenger,
    toggleMessenger,
    clearActiveEvent,
  } = useMessengerStore();

  const [localActiveEventId, setLocalActiveEventId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventChats, setEventChats] = useState<EventChatPreview[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Sync store's activeEventId with local state
  const activeEventId = storeActiveEventId || localActiveEventId;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalUnreadCount = eventChats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const activeEventChat = eventChats.find((c) => c.eventId === activeEventId);

  // Load user's event chats on mount
  useEffect(() => {
    if (user?.id && isOpen) {
      loadEventChats();
    }
  }, [user?.id, isOpen]);

  // Connect to WebSocket when opening a chat
  useEffect(() => {
    if (activeEventId) {
      initializeChat(activeEventId);
    }

    return () => {
      if (activeEventId) {
        chatSocket.leaveRoom();
      }
    };
  }, [activeEventId]);

  // Setup WebSocket event handlers
  useEffect(() => {
    chatSocket.on("chat:joined", (data) => {
      chatStore.setMessages(data.recentMessages);
      chatStore.setChatInfo(data.chat);
      chatStore.setConnected(true);
    });

    chatSocket.on("chat:message", (data) => {
      chatStore.addMessage(data.message);
      // Update event chat preview
      setEventChats((prev) =>
        prev.map((c) =>
          c.eventId === activeEventId
            ? {
              ...c,
              lastMessage: `${data.message.sender.name}: ${data.message.content}`,
              lastMessageTime: new Date(data.message.createdAt),
            }
            : c
        )
      );
    });

    chatSocket.on("chat:typing", (data) => {
      chatStore.setTypingUsers(data.users.filter((u) => u.id !== user?.id));
    });

    chatSocket.on("chat:error", (data) => {
      customToast.error(data.message);
    });

    return () => {
      chatSocket.off("chat:joined");
      chatSocket.off("chat:message");
      chatSocket.off("chat:typing");
      chatSocket.off("chat:error");
    };
  }, [activeEventId, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeEventId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatStore.messages, activeEventId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && activeEventId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeEventId]);

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

      // Get chat info
      const joinResult = await ChatService.joinChat(eventId);

      if (!joinResult.canJoin) {
        chatStore.setCanJoin(false, joinResult.reason);
        customToast.error(
          joinResult.reason === "NO_TICKET"
            ? "You need a ticket to join this chat"
            : joinResult.reason === "CHAT_DISABLED"
              ? "Chat is disabled for this event"
              : "Cannot join chat"
        );
        return;
      }

      chatStore.setChatInfo(joinResult.chat);
      chatStore.setCanJoin(true);

      // Connect to WebSocket and join room
      chatSocket.connect(WS_URL);
      chatSocket.joinRoom(eventId);

      // Load pinned messages
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

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeEventId) return;

    const content = messageInput.trim();
    setMessageInput("");

    if (chatSocket.isConnected()) {
      chatSocket.sendMessage({ content, type: "TEXT" });
    } else {
      // Fallback to REST
      ChatService.sendMessage(activeEventId, { content, type: "TEXT" })
        .then((message) => {
          chatStore.addMessage(message);
        })
        .catch((error) => {
          customToast.error(error.response?.data?.message || "Failed to send message");
        });
    }
  }, [messageInput, activeEventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      chatSocket.sendTyping();
    }

    // Clear typing after delay
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (eventId: string) => {
    setLocalActiveEventId(eventId);
    // Mark as read
    setEventChats((prev) =>
      prev.map((c) => (c.eventId === eventId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleBack = () => {
    chatSocket.leaveRoom();
    chatStore.reset();
    setLocalActiveEventId(null);
    clearActiveEvent();
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

  const formatTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
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
      case "ORGANIZER":
        return "bg-primary/20 text-primary border-primary/30";
      case "MODERATOR":
        return "bg-secondary/20 text-secondary border-secondary/30";
      default:
        return "bg-foreground/5 text-foreground border-foreground/10";
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleMessenger}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer ${isOpen ? "scale-90" : "scale-100 hover:scale-110"
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

      {/* Messages Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-background border border-foreground/10 rounded-2xl shadow-2xl flex flex-col ${"bottom-0 left-0 right-0 top-0 rounded-none md:rounded-2xl md:bottom-20 md:right-6 md:left-auto md:top-auto md:w-[420px] md:h-[600px]"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-background">
            {activeEventId ? (
              <>
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Back to chat list"
                >
                  <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
                </button>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {activeEventChat?.eventImage ? (
                    <img
                      src={activeEventChat.eventImage}
                      alt={activeEventChat.eventName}
                      className="w-10 h-10 rounded-xl object-cover"
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
                        {chatStore.chatInfo?.onlineCount || 0} online
                        {chatStore.typingUsers.length > 0 && (
                          <span className="text-primary ml-2">
                            {chatStore.typingUsers.map((u) => u.name).join(", ")} typing...
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => router.push(`/events/${activeEventId}`)}
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                    title="View Event"
                  >
                    <Calendar size={18} color="currentColor" variant="Outline" />
                  </button>
                  <button
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                    onClick={closeMessenger}
                  >
                    <CloseCircle size={20} color="currentColor" variant="Outline" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground">Event Chats</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                    onClick={loadEventChats}
                    disabled={loadingChats}
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
                    onClick={closeMessenger}
                  >
                    <CloseCircle size={20} color="currentColor" variant="Outline" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeEventId ? (
              // Chat View
              <>
                {/* Event Info Banner */}
                {activeEventChat && (
                  <div className="p-3 bg-primary/5 border-b border-foreground/10">
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                      <Calendar size={14} color="currentColor" variant="Outline" />
                      <span>{activeEventChat.eventDate}</span>
                      <span>•</span>
                      <Location size={14} color="currentColor" variant="Outline" />
                      <span className="truncate">{activeEventChat.eventLocation}</span>
                    </div>
                  </div>
                )}

                {/* Loading / Joining State */}
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
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Messages */}
                {!chatStore.isJoining && !chatStore.error && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Load more button */}
                      {chatStore.hasMoreMessages && (
                        <button
                          onClick={loadMoreMessages}
                          disabled={chatStore.isLoadingMessages}
                          className="w-full py-2 text-sm text-primary hover:underline disabled:opacity-50"
                        >
                          {chatStore.isLoadingMessages ? "Loading..." : "Load older messages"}
                        </button>
                      )}

                      {chatStore.messages.map((message) => {
                        const isOwnMessage = message.sender.id === user?.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                          >
                            {!isOwnMessage && (
                              <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                                {message.sender.avatar ? (
                                  <img
                                    src={message.sender.avatar}
                                    alt={message.sender.name}
                                    className="w-full h-full rounded-full"
                                  />
                                ) : (
                                  <User
                                    size={16}
                                    color="currentColor"
                                    variant="Bold"
                                    className="text-foreground/60"
                                  />
                                )}
                              </div>
                            )}
                            <div
                              className={`max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"
                                } flex flex-col gap-1`}
                            >
                              {!isOwnMessage && (
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

                              {/* Reply preview */}
                              {message.replyTo && (
                                <div className="px-3 py-1 bg-foreground/5 rounded-lg text-xs text-foreground/60 border-l-2 border-primary">
                                  <span className="font-medium">{message.replyTo.senderName}</span>
                                  <p className="truncate">{message.replyTo.content}</p>
                                </div>
                              )}

                              <div
                                className={`px-4 py-2 rounded-2xl ${message.type === "ANNOUNCEMENT"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : message.type === "SYSTEM"
                                    ? "bg-foreground/5 text-foreground/60 text-center w-full"
                                    : isOwnMessage
                                      ? "bg-primary text-white rounded-br-sm"
                                      : "bg-foreground/5 text-foreground rounded-bl-sm"
                                  }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-foreground/50 px-1">
                                <span>{formatTime(message.createdAt)}</span>
                                {message.isPinned && (
                                  <span className="text-primary">📌</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-foreground/10 bg-background">
                      {chatStore.isMuted ? (
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
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                            className="w-11 h-11 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
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
              // Event Chats List
              <>
                {/* Search */}
                <div className="p-4 border-b border-foreground/10">
                  <div className="relative">
                    <SearchNormal1
                      size={20}
                      color="currentColor"
                      variant="Outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search events..."
                      className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
                    />
                  </div>
                </div>

                {/* Event Chats */}
                <div className="flex-1 overflow-y-auto">
                  {loadingChats ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredChats.length === 0 ? (
                    <div className="p-8 text-center">
                      <Calendar
                        size={48}
                        color="currentColor"
                        variant="Outline"
                        className="text-foreground/30 mx-auto mb-3"
                      />
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
                                <Calendar
                                  size={24}
                                  color="currentColor"
                                  variant="Bold"
                                  className="text-primary"
                                />
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
                                  <>
                                    <span>•</span>
                                    <span className="text-primary font-medium">Organizer</span>
                                  </>
                                )}
                                {chat.userRole === "MODERATOR" && (
                                  <>
                                    <span>•</span>
                                    <span className="text-secondary font-medium">Moderator</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-foreground/70 truncate">
                                  {chat.lastMessage}
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
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMessenger}
        />
      )}
    </>
  );
};

export default FloatingMessenger;
