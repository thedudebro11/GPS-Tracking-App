'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MailIcon, LockIcon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#3896ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="bg-[#3896ff] p-4 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">
            Welcome to SafeSteps
          </h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue.</p>

          {/* Email Input */}
          <div className="relative w-full mb-4">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full mb-4">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Continue Button */}
          <Button
            className="w-full bg-[#3896ff] hover:bg-[#2e7ee1] text-white font-medium mb-4"
          >
            Continue
          </Button>

          {/* Separator */}
          <div className="w-full flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full mb-2 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          {/* Apple Login */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FaApple size={20} />
            Continue with Apple
          </Button>

          {/* Sign Up Link */}
          <p className="text-sm text-gray-500 mt-6">
            Don’t have an account?{' '}
            <a href="/signup" className="text-[#3896ff] font-medium">
              Sign up
            </a>
          </p>

          {/* Footer */}
          <p className="text-[11px] text-gray-400 mt-4">SafeSteps © 2025</p>
        </div>
      </div>
    </div>
  );
}
