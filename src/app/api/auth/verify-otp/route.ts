import { NextRequest, NextResponse } from 'next/server'
// import { redis } from '@/lib/redis'
import jwt from 'jsonwebtoken'
import { twilio } from '@/lib/twilio'

export async function POST(req: NextRequest) {
   const { phone, otp } = await req.json();

  const verification_check = await twilio.verify.v2.services('VAe4fa808fabae6893375a8cc14e04ade2')
    .verificationChecks
    .create({
      to: phone,
      code: otp,
    });

  console.log(verification_check);
  if (verification_check.status === 'approved') {
    /* Create JWT token */
    const token = jwt.sign({ userId: 'some-user-id', phone }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({ ok: true, token: token});
  }

  return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 400 });
}
