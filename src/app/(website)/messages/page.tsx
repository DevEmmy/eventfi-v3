"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageText1,
  SearchNormal1,
  ArrowLeft2,
  Send,
  User,
  TickCircle,
  Clock,
} from "iconsax-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
  messages: Message[];
}

const MessagesPage = () => {
  const router = useRouter();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock conversations - Replace with API call
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participantId: "user1",
      participantName: "Sarah Johnson",
      participantAvatar: undefined,
      lastMessage: "Thanks for the amazing event!",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: "m1",
          senderId: "user1",
          senderName: "Sarah Johnson",
          content: "Hi! I'm interested in your photography services for my wedding.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m2",
          senderId: "current",
          senderName: "You",
          content: "Hello Sarah! I'd be happy to help. When is your wedding date?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
          read: true,
        },
        {
          id: "m3",
          senderId: "user1",
          senderName: "Sarah Johnson",
          content: "It's on March 15th, 2025. Do you have availability?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m4",
          senderId: "current",
          senderName: "You",
          content: "Yes, I'm available! Let me send you my portfolio.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2 * 60 * 1000),
          read: true,
        },
        {
          id: "m5",
          senderId: "user1",
          senderName: "Sarah Johnson",
          content: "Thanks for the amazing event!",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
        },
      ],
    },
    {
      id: "2",
      participantId: "user2",
      participantName: "Tech Events Nigeria",
      participantAvatar: undefined,
      lastMessage: "Can we schedule a call this week?",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: "m7",
          senderId: "user2",
          senderName: "Tech Events Nigeria",
          content: "Hi! We're organizing Tech Fest Lagos and need a photographer.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m8",
          senderId: "current",
          senderName: "You",
          content: "I'd love to help! What's the event date?",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: "m9",
          senderId: "user2",
          senderName: "Tech Events Nigeria",
          content: "Can we schedule a call this week?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
      ],
    },
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

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

  const activeConv = conversations.find((c) => c.id === activeConversation);
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
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
            {/* Conversations List */}
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
                          setConversations((prev) =>
                            prev.map((conv) =>
                              conv.id === conversation.id
                                ? { ...conv, unreadCount: 0, messages: conv.messages.map((m) => ({ ...m, read: true })) }
                                : conv
                            )
                          );
                        }}
                        className={`w-full p-4 hover:bg-foreground/5 transition-colors text-left ${
                          activeConversation === conversation.id ? "bg-primary/5" : ""
                        }`}
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
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2 bg-background border border-foreground/10 rounded-2xl flex flex-col overflow-hidden">
              {activeConversation && activeConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-foreground/10 flex items-center gap-3">
                    {activeConv.participantAvatar ? (
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{activeConv.participantName}</h3>
                      {activeConv.isOnline && (
                        <p className="text-xs text-green-500">Online</p>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConv.messages.map((message) => {
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
                              {activeConv.participantAvatar ? (
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
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-foreground/10">
                    <div className="flex items-end gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
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
                    <MessageText1
                      size={64}
                      color="currentColor"
                      variant="Outline"
                      className="text-foreground/30 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-foreground/60">
                      Choose a conversation from the list to start messaging
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

