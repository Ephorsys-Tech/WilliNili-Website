'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Home,
  ShieldCheck,
  Check,
  X,
  KeyRound,
} from 'lucide-react';
import { resetPassword } from '@/api/auth.api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function LeafIcon({ className = 'w-4 h-4 text-[#C59B27]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  // Real-time password criteria
  const criteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const isPasswordStrong =
    criteria.length && criteria.upper && criteria.lower && criteria.number && criteria.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!token.trim()) {
      errs.token = 'Reset token is missing or invalid. Please request a new link.';
    }
    if (!password) {
      errs.password = 'New password is required';
    } else if (!isPasswordStrong) {
      errs.password = 'Password does not meet all security criteria';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await resetPassword({
        token: token.trim(),
        password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to reset password. The link may have expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-[#fbfbf8] rounded-[32px] sm:rounded-[36px] border-2 border-[#C59B27]/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] p-7 sm:p-10 md:p-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-900/10 border border-emerald-900/15 flex items-center justify-center text-[#0E3D2B]">
          <Lock className="w-6 h-6 text-[#0E3D2B]" />
        </div>

        <h3 className="font-heading-serif text-2xl sm:text-3xl font-bold text-[#0E3D2B] tracking-tight">
          Set New Password
        </h3>
        <p className="text-xs sm:text-sm text-stone-500">
          {email ? (
            <span>
              Updating credentials for <strong className="text-stone-700">{email}</strong>
            </span>
          ) : (
            'Enter your secure reset token and choose a new password.'
          )}
        </p>

        {/* Decorative Leaf Ornament Line */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] bg-stone-300 w-16" />
          <LeafIcon className="w-3.5 h-3.5 text-[#C59B27]" />
          <div className="h-[1px] bg-stone-300 w-16" />
        </div>
      </div>

      {/* Error Alert */}
      {errors.form && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="leading-relaxed block">{errors.form}</span>
            <Link
              href="/admin/forgot-password"
              className="text-emerald-800 underline font-semibold hover:text-emerald-900 block pt-1"
            >
              Request a new password reset link
            </Link>
          </div>
        </div>
      )}

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* If token is missing from URL, show token input */}
          {!searchParams.get('token') && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Reset Token <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <KeyRound className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  name="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste 64-character token"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-stone-300 text-stone-800 text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15"
                />
              </div>
              {errors.token && (
                <p className="text-[11px] text-rose-600 pl-2">{errors.token}</p>
              )}
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 block">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.form) setErrors({});
                }}
                placeholder="Choose strong password"
                autoComplete="new-password"
                required
                className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 pl-2">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 block">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({});
                }}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-600 pl-2">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Strength Checklist */}
          <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-[11px] space-y-1.5">
            <span className="font-semibold text-stone-700 block text-xs">Security Requirements:</span>
            <div className="grid grid-cols-2 gap-1.5 text-stone-600">
              <span className={`flex items-center gap-1.5 ${criteria.length ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.length ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                8+ characters
              </span>
              <span className={`flex items-center gap-1.5 ${criteria.upper ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.upper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                Uppercase letter (A-Z)
              </span>
              <span className={`flex items-center gap-1.5 ${criteria.lower ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.lower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                Lowercase letter (a-z)
              </span>
              <span className={`flex items-center gap-1.5 ${criteria.number ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.number ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                Number (0-9)
              </span>
              <span className={`flex items-center gap-1.5 ${criteria.special ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.special ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                Special symbol (@, #, !)
              </span>
              <span className={`flex items-center gap-1.5 ${criteria.match ? 'text-emerald-700 font-semibold' : ''}`}>
                {criteria.match ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-stone-400" />}
                Passwords match
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0B3B28] hover:bg-[#07281B] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#F5D061]" />
                  <span>Update &amp; Lock New Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Success Screen */
        <div className="space-y-5 pt-2 text-center animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-bold text-[#0E3D2B]">Password Reset Complete</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Your administrator credentials have been securely updated. All previous active sessions across all devices have been automatically invalidated.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0B3B28] hover:bg-[#07281B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Decorative Leaf Divider */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="h-[1px] bg-stone-300 w-full" />
        <LeafIcon className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
        <div className="h-[1px] bg-stone-300 w-full" />
      </div>

      {/* Copyright Text */}
      <p className="text-[11px] text-stone-400 text-center tracking-wide">
        &copy; {new Date().getFullYear()} Willy Nilly. All rights reserved.
      </p>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      {/* ─── Landscape Panoramic Background (Pahad, Village, Sunrise) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg"
          alt="Rural Landscape with Mountains and Village Cottages"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50" />
      </div>

      {/* ─── Main Content Container ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Emblem */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <img
                src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png"
                alt="Willy Nilly Official Emblem Logo"
                className="w-24 sm:w-28 md:w-32 h-auto drop-shadow-2xl"
              />
            </Link>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#F5D061] drop-shadow-md">
                WILLY NILLY
              </h1>

              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-[#C59B27]">
                <span className="w-10 sm:w-12 h-[1px] bg-[#C59B27]/60" />
                <LeafIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                <span className="w-10 sm:w-12 h-[1px] bg-[#C59B27]/60" />
              </div>
            </div>

            <div className="space-y-3 pt-2 max-w-lg">
              <h2 className="font-heading-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                Secure Credential Reset
              </h2>
              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Create a high-entropy password to secure your admin account. Passwords are encrypted with 12-round bcrypt salts.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#F5D061]" />
                <span>Return to Login</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-md"
              >
                <Home className="w-3.5 h-3.5 text-[#F5D061]" />
                <span>Return to Website</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Reset Form Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <Suspense
              fallback={
                <div className="w-full max-w-[500px] bg-[#fbfbf8] rounded-[36px] p-12 flex items-center justify-center shadow-2xl">
                  <LoadingSpinner text="Loading security credentials..." />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

