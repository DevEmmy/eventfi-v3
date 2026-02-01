// Event Chat Types

export type MessageType = 'TEXT' | 'IMAGE' | 'ANNOUNCEMENT' | 'SYSTEM';
export type ChatRole = 'MEMBER' | 'MODERATOR' | 'ORGANIZER';

// Message sender info
export interface ChatMessageSender {
    id: string;
    name: string;
    avatar?: string;
    role: ChatRole;
}

// Reply reference
export interface MessageReply {
    id: string;
    content: string;
    senderName: string;
}

// Chat message
export interface ChatMessage {
    id: string;
    content: string;
    type: MessageType;
    sender: ChatMessageSender;
    replyTo?: MessageReply;
    isPinned: boolean;
    createdAt: string;
}

// Chat member
export interface ChatMember {
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    role: ChatRole;
    isMuted: boolean;
    isOnline: boolean;
    joinedAt: string;
}

// Chat room info
export interface EventChatInfo {
    id: string;
    eventId: string;
    isActive: boolean;
    slowMode: number;
    membersOnly: boolean;
    memberCount: number;
    onlineCount: number;
    userRole: ChatRole;
    isMuted: boolean;
}

// ============ API Response Types ============

export interface JoinChatResponse {
    chat: EventChatInfo;
    canJoin: boolean;
    reason: 'NO_TICKET' | 'CHAT_DISABLED' | 'EVENT_ENDED' | null;
}

export interface ChatMessagesResponse {
    messages: ChatMessage[];
    hasMore: boolean;
}

export interface ChatMembersResponse {
    members: ChatMember[];
    total: number;
    online: number;
}

// ============ Request Payload Types ============

export interface SendMessagePayload {
    content: string;
    type?: MessageType;
    replyToId?: string;
}

export interface ModerateMessagePayload {
    action: 'delete' | 'pin' | 'unpin';
}

export interface MuteUserPayload {
    duration: number; // minutes, 0 = unmute
}

export interface UpdateChatSettingsPayload {
    slowMode?: number;
    isActive?: boolean;
}

export interface MessagesQueryParams {
    before?: string;
    limit?: number;
}

export interface MembersQueryParams {
    online?: boolean;
    limit?: number;
}

// ============ WebSocket Event Types ============

export interface ChatJoinPayload {
    eventId: string;
}

export interface ChatLeavePayload {
    eventId: string;
}

export interface ChatMessagePayload {
    content: string;
    type?: MessageType;
    replyToId?: string;
}

export interface ChatReadPayload {
    eventId: string;
    messageId: string;
}

// Server events
export interface ChatJoinedEvent {
    chat: EventChatInfo;
    recentMessages: ChatMessage[];
}

export interface ChatMessageEvent {
    message: ChatMessage;
}

export interface ChatMessageDeletedEvent {
    messageId: string;
    deletedBy: string;
}

export interface ChatMessagePinnedEvent {
    message: ChatMessage;
}

export interface ChatMemberJoinedEvent {
    member: ChatMember;
}

export interface ChatMemberLeftEvent {
    userId: string;
}

export interface ChatMemberMutedEvent {
    userId: string;
    until: string | null;
}

export interface ChatTypingEvent {
    users: Array<{ id: string; name: string }>;
}

export interface ChatSettingsEvent {
    slowMode: number;
    isActive: boolean;
}

export interface ChatErrorEvent {
    code: string;
    message: string;
}

// Error codes
export type ChatErrorCode =
    | 'CHAT_NOT_FOUND'
    | 'NO_TICKET'
    | 'CHAT_DISABLED'
    | 'USER_MUTED'
    | 'SLOW_MODE'
    | 'MESSAGE_TOO_LONG'
    | 'NOT_AUTHORIZED';
