import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
    '/profile',
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
        '/profile/:path*',
        '/vendor/create',
        '/vendor/edit',
        '/events/create',
        '/events/:id/manage/:path*',
        '/events/:id/edit',
        '/messages',
        '/notifications',
        '/settings/:path*',
    ],
};
