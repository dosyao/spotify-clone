import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req: req as any, secret: process.env.JWT_SECRET as string });

    const { pathname } = req.nextUrl;

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    if (!token && pathname !== '/login') {
        return NextResponse.redirect('/login');
    }
}
