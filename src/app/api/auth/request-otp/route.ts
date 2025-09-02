import { NextRequest, NextResponse } from "next/server";
// import { redis } from '@/lib/redis'
import { twilio } from '@/lib/twilio'

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // await redis.set(phone, otp, { ex: 300 }); // 5 minutes

  // TODO: send text msg
  // twilio.messages
  //   .create({
  //     body: `Your Shuttlez verification code is: ${otp}. This code will expire in 5 minutes.`,
  //     from: '+18883086757',
  //     to: phone
  //   })

  twilio.verify.v2.services("VAe4fa808fabae6893375a8cc14e04ade2")
    .verifications
    .create({
      to: phone, 
      channel: 'sms',
    })

  return NextResponse.json({ ok: true });
}
