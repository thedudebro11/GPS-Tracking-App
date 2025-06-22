"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth";
import { Mail, Lock } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    if (error) setError(error.message);
    else window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#3896ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-[30px] w-full max-w-md p-8 shadow-xl text-center">
        <div className="flex flex-col items-center">
          <div className="bg-[#3896ff] p-4 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..." />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
            Create a SafeSteps Account
          </h1>
          <p className="text-sm text-gray-500 mb-6">Sign up to get started.</p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="relative w-full mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative w-full mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            className="w-full bg-[#3896ff] text-white hover:bg-[#3184e0] transition"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>

          <p className="text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold">
              Log in
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-4">SafeSteps © 2025</p>
        </div>
      </div>
    </div>
  );
}
