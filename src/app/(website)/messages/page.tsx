"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SearchNormal1,
  ArrowLeft2,
  Send,
  User,
  Clock,
  Calendar,
  Location,
  People,
} from "iconsax-react";
import { ChatService } from "@/services/chat";
import { chatSocket } from "@/services/chatSocket";
import { useUserStore } from "@/store/useUserStore";
import toast from "@/lib/toast";
import type {
  EventChatPreview,
  ChatMessage,
  ChatRole,
} from "@/types/chat";

const MessagesPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [eventChats, setEventChats] = useState<EventChatPreview[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{ id: string; name: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeEventIdRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => {
    activeEventIdRef.current = activeEventId;
  }, [activeEventId]);

  // Fetch user's event chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const chats = await ChatService.getUserEventChats();
        setEventChats(chats);
      } catch {
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    chatSocket.connect(wsUrl);

    chatSocket.on("chat:message", ({ message }) => {
      setMessages((prev) => [...prev, message]);
      setEventChats((prev) =>
        prev.map((chat) =>
          chat.eventId === activeEventIdRef.current
            ? {
                ...chat,
                lastMessage: `${message.sender.name}: ${message.content.substring(0, 50)}`,
                lastMessageTime: message.createdAt,
                unreadCount: 0,
              }
            : chat
        )
      );
    });

    chatSocket.on("chat:message:deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    chatSocket.on("chat:typing", ({ users }) => {
      setTypingUsers(users.filter((u) => u.id !== user?.id));
    });

    chatSocket.on("chat:error", ({ message }) => {
      toast.error(message);
    });

    return () => {
      chatSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join chat room when selecting an event
  const handleSelectChat = useCallback(async (eventId: string) => {
    if (activeEventId === eventId) return;

    chatSocket.leaveRoom();
    setMessages([]);
    setActiveEventId(eventId);
    setMessagesLoading(true);

    try {
      chatSocket.joinRoom(eventId);

      const result = await ChatService.getMessages(eventId, { limit: 50 });
      setMessages(result.messages);
      setHasMore(result.hasMore);

      setEventChats((prev) =>
        prev.map((c) =>
          c.eventId === eventId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  }, [activeEventId]);

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!activeEventId || !hasMore || messagesLoading) return;
    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    try {
      const result = await ChatService.getMessages(activeEventId, {
        before: oldestMessage.id,
        limit: 50,
      });
      setMessages((prev) => [...result.messages, ...prev]);
      setHasMore(result.hasMore);
    } catch {
      toast.error("Failed to load older messages");
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeEventId) return;
    chatSocket.sendMessage({ content: messageInput.trim() });
    setMessageInput("");
  };

  const activeChat = eventChats.find((c) => c.eventId === activeEventId);
  const filteredChats = eventChats.filter((chat) =>
    chat.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadge = (role: ChatRole) => {
    const roleColors: Record<ChatRole, string> = {
      ORGANIZER: "bg-primary/20 text-primary border-primary/30",
      MODERATOR: "bg-amber-500/20 text-amber-600 border-amber-500/30",
      MEMBER: "bg-foreground/5 text-foreground border-foreground/10",
    };
    const roleLabels: Record<ChatRole, string> = {
      ORGANIZER: "organizer",
      MODERATOR: "moderator",
      MEMBER: "attendee",
    };
    return { color: roleColors[role], label: roleLabels[role] };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
              Messages
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Event Chats List */}
            <div className="lg:col-span-1 bg-background border border-foreground/10 rounded-2xl flex flex-col overflow-hidden">
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
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-foreground/60">Loading chats...</p>
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
                        onClick={() => handleSelectChat(chat.eventId)}
                        className={`w-full p-4 hover:bg-foreground/5 transition-colors text-left ${
                          activeEventId === chat.eventId ? "bg-primary/5" : ""
                        }`}
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
                                <>
                                  <span>·</span>
                                  <span className="text-primary font-medium">Organizer</span>
                                </>
                              )}
                              {chat.userRole === "MODERATOR" && (
                                <>
                                  <span>·</span>
                                  <span className="text-amber-600 font-medium">Moderator</span>
                                </>
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
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2 bg-background border border-foreground/10 rounded-2xl flex flex-col overflow-hidden">
              {activeEventId && activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-foreground/10 flex items-center gap-3">
                    {activeChat.eventImage ? (
                      <img
                        src={activeChat.eventImage}
                        alt={activeChat.eventName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{activeChat.eventName}</h3>
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <People size={12} color="currentColor" variant="Outline" />
                        <span>{activeChat.participantCount.toLocaleString()} participants</span>
                        <span>·</span>
                        <Calendar size={12} color="currentColor" variant="Outline" />
                        <span>{activeChat.eventDate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/events/${activeChat.eventId}`)}
                      className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      View Event
                    </button>
                  </div>

                  {/* Event Info Banner */}
                  <div className="p-3 bg-primary/5 border-b border-foreground/10">
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                      <Location size={14} color="currentColor" variant="Outline" />
                      <span className="truncate">{activeChat.eventLocation}</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {hasMore && (
                      <button
                        onClick={loadMoreMessages}
                        className="w-full text-center text-sm text-primary hover:underline py-2"
                      >
                        Load older messages
                      </button>
                    )}

                    {messagesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-foreground/50 text-sm">
                        No messages yet. Be the first to say hello!
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwnMessage = message.sender.id === user?.id;
                        const badge = getRoleBadge(message.sender.role);

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
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User size={16} color="currentColor" variant="Bold" className="text-foreground/60" />
                                )}
                              </div>
                            )}
                            <div
                              className={`max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}
                            >
                              {!isOwnMessage && (
                                <div className="flex items-center gap-2 px-1">
                                  <span className="text-xs font-semibold text-foreground">
                                    {message.sender.name}
                                  </span>
                                  {message.sender.role !== "MEMBER" && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                                      {badge.label}
                                    </span>
                                  )}
                                </div>
                              )}
                              {message.replyTo && (
                                <div className="px-3 py-1 bg-foreground/5 border-l-2 border-primary/50 rounded text-xs text-foreground/60">
                                  <span className="font-medium">{message.replyTo.senderName}</span>: {message.replyTo.content}
                                </div>
                              )}
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  message.type === "ANNOUNCEMENT"
                                    ? "bg-amber-500/10 text-foreground border border-amber-500/20"
                                    : message.type === "SYSTEM"
                                    ? "bg-foreground/5 text-foreground/60 italic text-center w-full"
                                    : isOwnMessage
                                    ? "bg-primary text-white rounded-br-sm"
                                    : "bg-foreground/5 text-foreground rounded-bl-sm"
                                }`}
                              >
                                {message.type === "ANNOUNCEMENT" && (
                                  <span className="text-xs font-medium text-amber-600 block mb-1">Announcement</span>
                                )}
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-foreground/50 px-1">
                                <span>{formatTime(message.createdAt)}</span>
                                {message.isPinned && <span className="text-amber-500">pinned</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                      <div className="text-xs text-foreground/50 italic px-1">
                        {typingUsers.map((u) => u.name).join(", ")}{" "}
                        {typingUsers.length === 1 ? "is" : "are"} typing...
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-foreground/10">
                    <div className="flex items-end gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => {
                          setMessageInput(e.target.value);
                          chatSocket.sendTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="w-11 h-11 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Send size={20} color="currentColor" variant="Bold" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar
                      size={64}
                      color="currentColor"
                      variant="Outline"
                      className="text-foreground/30 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Select an event chat
                    </h3>
                    <p className="text-foreground/60">
                      Choose an event from the list to join the community chat
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
