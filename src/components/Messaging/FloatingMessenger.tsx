"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MessageText1,
  CloseCircle,
  Send,
  SearchNormal1,
  More,
  TickCircle,
  Clock,
  ArrowLeft2,
  Add,
  User,
  Calendar,
  Location,
  People,
  Shop,
  Ticket,
} from "iconsax-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: "organizer" | "vendor" | "attendee";
  content: string;
  timestamp: Date;
  read: boolean;
}

interface EventChat {
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
  messages: Message[];
  isOrganizer?: boolean;
  isVendor?: boolean;
}

const FloatingMessenger: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock event chats - Replace with API call
  const [eventChats, setEventChats] = useState<EventChat[]>([
    {
      id: "1",
      eventId: "1",
      eventName: "Tech Fest Lagos 2024",
      eventDate: "March 15, 2024",
      eventLocation: "Lagos Convention Centre",
      eventImage: undefined,
      organizerName: "Tech Events Nigeria",
      participantCount: 1247,
      unreadCount: 5,
      lastMessage: "Sarah: Can't wait for this event! 🔥",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      isOrganizer: true,
      messages: [
        {
          id: "m1",
          senderId: "user1",
          senderName: "Sarah Johnson",
          senderRole: "attendee",
          content: "Hey everyone! Is anyone carpooling from Victoria Island?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m2",
          senderId: "user2",
          senderName: "Mike Chen",
          senderRole: "attendee",
          content: "I'm coming from VI! We can share a ride.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
          read: true,
        },
        {
          id: "m3",
          senderId: "organizer",
          senderName: "Tech Events Nigeria",
          senderRole: "organizer",
          content: "Great to see the community connecting! Don't forget to bring your ID for registration.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m4",
          senderId: "vendor1",
          senderName: "Elite Photography",
          senderRole: "vendor",
          content: "We'll be covering the event! Say hi if you see us 📸",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          read: true,
        },
        {
          id: "m5",
          senderId: "user3",
          senderName: "Alex Johnson",
          senderRole: "attendee",
          content: "Can't wait for this event! 🔥",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
        },
        {
          id: "m6",
          senderId: "user4",
          senderName: "David Williams",
          senderRole: "attendee",
          content: "What time should we arrive?",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          read: false,
        },
      ],
    },
    {
      id: "2",
      eventId: "2",
      eventName: "Design Conference 2025",
      eventDate: "Feb 10, 2025",
      eventLocation: "Eko Hotel & Suites",
      eventImage: undefined,
      organizerName: "Design Hub Lagos",
      participantCount: 450,
      unreadCount: 0,
      lastMessage: "Organizer: Welcome everyone!",
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isVendor: true,
      messages: [
        {
          id: "m7",
          senderId: "organizer",
          senderName: "Design Hub Lagos",
          senderRole: "organizer",
          content: "Welcome everyone! We're excited to have you all here.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: true,
        },
      ],
    },
    {
      id: "3",
      eventId: "3",
      eventName: "Afro Nation Festival",
      eventDate: "Mar 15, 2025",
      eventLocation: "Tafawa Balewa Square",
      eventImage: undefined,
      organizerName: "Music Events Co",
      participantCount: 5000,
      unreadCount: 12,
      lastMessage: "Emma: Who's performing first?",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      messages: [
        {
          id: "m8",
          senderId: "user5",
          senderName: "Emma Wilson",
          senderRole: "attendee",
          content: "Who's performing first?",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
        },
      ],
    },
  ]);

  const totalUnreadCount = eventChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat, eventChats]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && activeChat && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    const conversation = conversations.find((c) => c.id === activeConversation);
    if (!conversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "current",
      senderName: "You",
      content: messageInput.trim(),
      timestamp: new Date(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.timestamp,
              messages: [...conv.messages, newMessage],
            }
          : conv
      )
    );

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversation);
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
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

      {/* Messages Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-background border border-foreground/10 rounded-2xl shadow-2xl flex flex-col ${
            // Mobile: full screen
            "bottom-0 left-0 right-0 top-0 rounded-none md:rounded-2xl md:bottom-20 md:right-6 md:left-auto md:top-auto md:w-[420px] md:h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-background">
            {activeConversation ? (
              <>
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
                </button>
                <div className="flex items-center gap-3 flex-1">
                  {activeConv?.participantAvatar ? (
                    <img
                      src={activeConv.participantAvatar}
                      alt={activeConv.participantName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={20} color="currentColor" variant="Bold" className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {activeConv?.participantName}
                    </h3>
                    {activeConv?.isOnline && (
                      <p className="text-xs text-green-500">Online</p>
                    )}
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseCircle size={20} color="currentColor" variant="Outline" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground">Messages</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
                    <Add size={20} color="currentColor" variant="Outline" />
                  </button>
                  <button
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <CloseCircle size={20} color="currentColor" variant="Outline" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeConversation ? (
              // Chat View
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConv?.messages.map((message) => {
                    const isOwnMessage = message.senderId === "current";
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                            {activeConv?.participantAvatar ? (
                              <img
                                src={activeConv.participantAvatar}
                                alt={message.senderName}
                                className="w-full h-full rounded-full"
                              />
                            ) : (
                              <User size={16} color="currentColor" variant="Bold" className="text-foreground/60" />
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] ${
                            isOwnMessage ? "items-end" : "items-start"
                          } flex flex-col gap-1`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-foreground/5 text-foreground rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-foreground/50 px-1">
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwnMessage && (
                              <>
                                {message.read ? (
                                  <TickCircle size={12} color="currentColor" variant="Bold" />
                                ) : (
                                  <Clock size={12} color="currentColor" variant="Outline" />
                                )}
                              </>
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
                  <div className="flex items-end gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
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
              // Conversations List
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
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageText1
                        size={48}
                        color="currentColor"
                        variant="Outline"
                        className="text-foreground/30 mx-auto mb-3"
                      />
                      <p className="text-foreground/60">
                        {searchQuery ? "No conversations found" : "No messages yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-foreground/10">
                      {filteredConversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          onClick={() => {
                            setActiveConversation(conversation.id);
                            // Mark as read
                            setConversations((prev) =>
                              prev.map((conv) =>
                                conv.id === conversation.id
                                  ? { ...conv, unreadCount: 0, messages: conv.messages.map((m) => ({ ...m, read: true })) }
                                  : conv
                              )
                            );
                          }}
                          className="w-full p-4 hover:bg-foreground/5 transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              {conversation.participantAvatar ? (
                                <img
                                  src={conversation.participantAvatar}
                                  alt={conversation.participantName}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User size={20} color="currentColor" variant="Bold" className="text-primary" />
                                </div>
                              )}
                              {conversation.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-foreground truncate">
                                  {conversation.participantName}
                                </h4>
                                <span className="text-xs text-foreground/50 shrink-0 ml-2">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-foreground/70 truncate">
                                  {conversation.lastMessage}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
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
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingMessenger;

