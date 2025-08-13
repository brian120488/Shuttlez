'use client';

import { useState } from 'react';
import { signIn, confirmSignIn } from 'aws-amplify/auth';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'enterPhone' | 'enterOtp'>('enterPhone');

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { nextStep } = await signIn({
        username: phone, // must be in E.164 format, e.g. +15551234567
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'SMS_OTP',
        },
      });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setStep('enterOtp');
        setMessage('OTP sent! Please check your phone.');
      } else if (nextStep.signInStep === 'DONE') {
        setMessage('Signed in successfully — no OTP required.');
      } else {
        setMessage(`Unexpected step: ${nextStep.signInStep}`);
      }
    } catch (error: any) {
      setMessage('Error sending OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { nextStep } = await confirmSignIn({
        challengeResponse: otp,
      });

      if (nextStep.signInStep === 'DONE') {
        setMessage('Successfully signed in!');
        // TODO: redirect or update auth state here
      } else {
        setMessage(`Unexpected step after OTP: ${nextStep.signInStep}`);
      }
    } catch (error: any) {
      setMessage('OTP verification error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In with Phone</h1>

      {step === 'enterPhone' && (
        <div className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="+1XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendOtp}
            disabled={loading || !phone}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 'enterOtp' && (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={verifyOtp}
            disabled={loading || !otp}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
