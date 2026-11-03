'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Home,
  ShieldCheck,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { requestPasswordReset } from '@/api/auth.api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function LeafIcon({ className = 'w-4 h-4 text-[#C59B27]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: 'Please enter your registered email address' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await requestPasswordReset({ email: trimmedEmail });
      setIsSubmitted(true);
      setSuccessInfo(res?.data || {});
    } catch (err) {
      setErrors({ form: err.message || 'Unable to request password reset. Please try again shortly.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      {/* ─── Landscape Panoramic Background (Pahad, Village, Sunrise) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg"
          alt="Rural Landscape with Mountains and Village Cottages"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Soft Contrast & Lighting Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50" />
      </div>

      {/* ─── Main Content Container ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Emblem, Leaf Divider & Welcome Back */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Willy Nilly Emblem Logo */}
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <img
                src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png"
                alt="Willy Nilly Official Emblem Logo"
                className="w-24 sm:w-28 md:w-32 h-auto drop-shadow-2xl"
              />
            </Link>

            {/* Brand Title in Gold Serif */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#F5D061] drop-shadow-md">
                WILLY NILLY
              </h1>

              {/* Decorative Leaf Ornament Divider */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-[#C59B27]">
                <span className="w-10 sm:w-12 h-[1px] bg-[#C59B27]/60" />
                <LeafIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                <span className="w-10 sm:w-12 h-[1px] bg-[#C59B27]/60" />
              </div>
            </div>

            {/* Security Context Heading */}
            <div className="space-y-3 pt-2 max-w-lg">
              <h2 className="font-heading-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                Admin Access Recovery
              </h2>
              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Enterprise-grade cryptographic token authentication protects your estate management console.
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#F5D061]" />
                <span>Back to Admin Login</span>
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

          {/* Right Column: Elevated Cream / Ivory Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] bg-[#fbfbf8] rounded-[32px] sm:rounded-[36px] border-2 border-[#C59B27]/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] p-7 sm:p-10 md:p-12 space-y-6">
              {/* Card Header with Key/Shield Icon */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#C59B27]">
                  <KeyRound className="w-6 h-6 text-[#C59B27]" />
                </div>

                <h3 className="font-heading-serif text-2xl sm:text-3xl font-bold text-[#0E3D2B] tracking-tight">
                  Forgot Password
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto">
                  Enter your registered administrator email to receive a secure, 15-minute password reset link.
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
                  <span className="leading-relaxed">{errors.form}</span>
                </div>
              )}

              {!isSubmitted ? (
                /* Forgot Password Request Form */
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <div className="relative flex items-center">
                      <Mail className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email || errors.form) setErrors({});
                        }}
                        placeholder="Admin email address"
                        autoComplete="email"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15 transition-all shadow-xs"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-600 pl-2">{errors.email}</p>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/5 border border-emerald-900/10 text-[11px] text-stone-600 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>
                      For your protection, password reset tokens are single-use, 256-bit encrypted, and automatically expire after 15 minutes.
                    </span>
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
                          <span>Send Reset Link</span>
                          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="space-y-4 pt-1 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>Request Processed</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-xs">
                      If an account matching <strong className="font-semibold text-emerald-900">{email}</strong> exists, password reset instructions and an encrypted 15-minute token link have been generated.
                    </p>
                  </div>

                  {/* Development / Local Testing Direct Shortcut Box */}
                  {successInfo?.debugResetUrl && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-900 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <KeyRound className="w-4 h-4 text-amber-700" />
                        <span>Development / Local Testing Shortcut:</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Because this is running in a local environment, you can click directly to test password reset:
                      </p>
                      <a
                        href={successInfo.debugResetUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        <span>Open Password Reset Form</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/admin/login"
                      className="w-full py-3 px-4 rounded-2xl bg-[#0B3B28] hover:bg-[#07281B] text-white font-bold text-xs sm:text-sm text-center shadow-sm transition-all"
                    >
                      Return to Sign In
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                        setSuccessInfo(null);
                      }}
                      className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-700 transition-colors text-center"
                    >
                      Send for a different email address
                    </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

