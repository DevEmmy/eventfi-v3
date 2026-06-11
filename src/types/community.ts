import { Event } from './event';

export enum CommunityRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    CHAPTER_LEAD = 'CHAPTER_LEAD',
}

export interface CommunityChapter {
    id: string;
    name: string;
    slug: string;
}

export interface CommunityPublic {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    bannerImage?: string | null;
    chapters: CommunityChapter[];
    followersCount: number;
    isFollowing: boolean;
    myRole: CommunityRole | null;
    upcomingEvents: Event[];
}

interface ChapterStats {
    eventCount: number;
    upcomingCount: number;
    pastCount: number;
    totalAttendees: number;
    totalRevenue: number;
}

export interface CommunityChapterFull extends CommunityChapter, Partial<ChapterStats> {}

export interface CommunityMemberUser {
    id: string;
    displayName: string;
    email: string;
    avatar?: string | null;
}

export interface CommunityMember {
    id: string;
    email: string;
    role: CommunityRole;
    status: 'PENDING' | 'ACTIVE';
    chapter: CommunityChapter | null;
    user: CommunityMemberUser | null;
    createdAt: string;
}

export interface CommunityDetail {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    bannerImage?: string | null;
    chapters: CommunityChapter[];
    myRole: CommunityRole | null;
    members?: CommunityMember[];
}

export interface MyCommunity {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    bannerImage?: string | null;
    roles: { role: CommunityRole; chapter: CommunityChapter | null }[];
}

export interface CommunityOverview {
    community: { id: string; name: string; slug: string };
    totals: ChapterStats;
    unassigned: ChapterStats;
    chapters: (CommunityChapter & ChapterStats)[];
}

export interface CreateCommunityInput {
    name: string;
    description?: string;
    logo?: string;
    bannerImage?: string;
}

export interface InviteMemberInput {
    emailOrUserId: string;
    role: CommunityRole;
    chapterId?: string;
}

export interface UpdateMemberInput {
    role: CommunityRole;
    chapterId?: string;
}

export interface ChapterEventsResult {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
}
