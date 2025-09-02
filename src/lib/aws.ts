import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const sns = new SNSClient({ region: process.env.AWS_REGION });

export async function sendOTP(phone: string, otp: string) {
  const command = new PublishCommand({
    Message: `Your verification code is ${otp}`,
    PhoneNumber: phone,
  });
  await sns.send(command);
}
