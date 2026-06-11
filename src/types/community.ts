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
