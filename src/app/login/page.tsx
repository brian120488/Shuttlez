"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Sending OTP...");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStep("otp");
        setMessage(`We sent ${phone} a code via SMS.`);
      } else {
        setMessage("Failed to send OTP.");
      }
    } catch (err) {
      setMessage(`Error sending OTP: ${err}`);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Verifying OTP...");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setMessage("Login successful!");
        router.replace('/create');
      } else {
        setMessage("Invalid OTP");
      }
    } catch (err) {
      setMessage("Error verifying OTP: " + err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign In</h1>
        {message && <p className="mb-4 text-center text-sm text-blue-600">{message}</p>}

        {step === "phone" && (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
            <input
              type="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md py-3 font-semibold hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white rounded-md py-3 font-semibold hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
