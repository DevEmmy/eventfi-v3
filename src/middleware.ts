import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
    '/profile/edit',
    '/organizer',
    '/vendor/create',
    '/vendor/edit',
    '/events/create',
    '/messages',
    '/notifications',
    '/settings',
];

// Dynamic protected routes that need pattern matching
const PROTECTED_PATTERNS = [
    /^\/events\/[^/]+\/manage/,
    /^\/events\/[^/]+\/edit/,
    /^\/events\/[^/]+\/checkout/,
    /^\/events\/[^/]+\/review/,
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth-token')?.value;

    const isProtected =
        PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
        PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));

    if (isProtected && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/edit',
        '/organizer/:path*',
        '/vendor/create',
        '/vendor/edit',
        '/events/create',
        '/events/:id/manage/:path*',
        '/events/:id/edit',
        '/events/:id/checkout',
        '/events/:id/review',
        '/messages',
        '/notifications',
        '/settings/:path*',
    ],
};
