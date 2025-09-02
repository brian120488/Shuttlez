import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log('User ID:', payload.userId);
    return NextResponse.next();
  } catch (err) {
    console.log('JWT invalid:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = { matcher: ['/create'] };
