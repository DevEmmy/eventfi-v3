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
    if (!messageInput.trim() || !activeChat) return;

    const eventChat = eventChats.find((c) => c.id === activeChat);
    if (!eventChat) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "current",
      senderName: "You",
      senderRole: eventChat.isOrganizer ? "organizer" : eventChat.isVendor ? "vendor" : "attendee",
      content: messageInput.trim(),
      timestamp: new Date(),
      read: false,
    };

    setEventChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              lastMessage: `${newMessage.senderName}: ${newMessage.content}`,
              lastMessageTime: newMessage.timestamp,
              messages: [...chat.messages, newMessage],
            }
          : chat
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

  const activeEventChat = eventChats.find((c) => c.id === activeChat);
  const filteredChats = eventChats.filter((chat) =>
    chat.eventName.toLowerCase().includes(searchQuery.toLowerCase())
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
            {activeChat ? (
              <>
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 hover:bg-foreground/10 rounded-lg transition-colors"
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
                      <span>{activeEventChat?.participantCount.toLocaleString()} participants</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => router.push(`/events/${activeEventChat?.eventId}`)}
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                    title="View Event"
                  >
                    <Calendar size={18} color="currentColor" variant="Outline" />
                  </button>
                  <button
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
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
            {activeChat ? (
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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeEventChat?.messages.map((message) => {
                    const isOwnMessage = message.senderId === "current";
                    const roleColors = {
                      organizer: "bg-primary/20 text-primary border-primary/30",
                      vendor: "bg-secondary/20 text-secondary border-secondary/30",
                      attendee: "bg-foreground/5 text-foreground border-foreground/10",
                    };
                    const roleColor = message.senderRole ? roleColors[message.senderRole] : roleColors.attendee;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                            {message.senderAvatar ? (
                              <img
                                src={message.senderAvatar}
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
                          {!isOwnMessage && (
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-xs font-semibold text-foreground">
                                {message.senderName}
                              </span>
                              {message.senderRole && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full border ${roleColor}`}
                                >
                                  {message.senderRole}
                                </span>
                              )}
                            </div>
                          )}
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
                  {filteredChats.length === 0 ? (
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
                          onClick={() => {
                            setActiveChat(chat.id);
                            // Mark as read
                            setEventChats((prev) =>
                              prev.map((c) =>
                                c.id === chat.id
                                  ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
                                  : c
                              )
                            );
                          }}
                          className="w-full p-4 hover:bg-foreground/5 transition-colors text-left"
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
                                {chat.isOrganizer && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary font-medium">Organizer</span>
                                  </>
                                )}
                                {chat.isVendor && (
                                  <>
                                    <span>•</span>
                                    <span className="text-secondary font-medium">Vendor</span>
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
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingMessenger;

