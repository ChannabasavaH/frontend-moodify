import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ['/', '/signup', '/login', '/dashboard'],
};

export const middleware = (req: NextRequest) => {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const url = req.nextUrl;

    if (refreshToken && (url.pathname.startsWith('/signup') || url.pathname.startsWith('/login'))) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!refreshToken && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
};
