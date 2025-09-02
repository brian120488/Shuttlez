import { NextRequest, NextResponse } from 'next/server';
import { twilio } from '@/lib/twilio';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
  const { phone, otp } = await req.json();

  const verification_check = await twilio.verify.v2
    .services('VAe4fa808fabae6893375a8cc14e04ade2')
    .verificationChecks.create({ to: phone, code: otp });

  if (verification_check.status === 'approved') {
    // Create JWT using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: phone })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('1h')
      .sign(secret);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'authToken',
      value: token,
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ ok: true, token });
  }

  return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 400 });
}
