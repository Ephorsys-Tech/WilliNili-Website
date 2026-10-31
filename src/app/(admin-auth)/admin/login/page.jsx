'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Home,
} from 'lucide-react';
import { loginAdmin } from '@/api/auth.api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function LeafIcon({ className = 'w-4 h-4 text-[#C59B27]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: null, form: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setInfoMessage(null);

    try {
      await loginAdmin(formData);
      router.push('/admin');
    } catch (err) {
      setErrors({ form: err.message || 'Invalid admin credentials or login rate limit reached.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      {/* ─── Landscape Panoramic Background (Pahad, Village, Sunrise) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/images/village-pahad-jharna.jpg"
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
                src="/images/logo.png"
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

            {/* Welcome Back Heading */}
            <div className="space-y-3 pt-2 max-w-lg">
              <h2 className="font-heading-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Sign in to access the admin panel and manage your agro-tourism platform.
              </p>
            </div>

            {/* Return to Public Website link */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-md"
              >
                <Home className="w-3.5 h-3.5 text-[#F5D061]" />
                <span>Return to Public Site</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Elevated Cream / Ivory Login Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] bg-[#fbfbf8] rounded-[32px] sm:rounded-[36px] border-2 border-[#C59B27]/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] p-7 sm:p-10 md:p-12 space-y-6">
              
              {/* Card Header with User Avatar Icon */}
              <div className="text-center space-y-2">
                {/* Outline User Icon with ID Badge */}
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-900/10 border border-emerald-900/15 flex items-center justify-center text-[#0E3D2B]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-[#0E3D2B]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <rect x="15" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </div>

                <h3 className="font-heading-serif text-2xl sm:text-3xl font-bold text-[#0E3D2B] tracking-tight">
                  Admin Login
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Enter your credentials to continue
                </p>

                {/* Decorative Leaf Ornament Line */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="h-[1px] bg-stone-300 w-16" />
                  <LeafIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                  <div className="h-[1px] bg-stone-300 w-16" />
                </div>
              </div>

              {/* Error / Info Alert */}
              {errors.form && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errors.form}</span>
                </div>
              )}

              {infoMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed shadow-xs">
                  {infoMessage}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Email Address Input */}
                <div className="space-y-1">
                  <div className="relative flex items-center">
                    <Mail className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      autoComplete="username"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15 transition-all shadow-xs"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-600 pl-2">{errors.email}</p>
                  )}
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div className="space-y-1">
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      autoComplete="current-password"
                      required
                      className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E3D2B] focus:ring-2 focus:ring-[#0E3D2B]/15 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-600 pl-2">{errors.password}</p>
                  )}
                </div>

                {/* Forgot your password? link */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      setInfoMessage(
                        'Password reset: Please contact the system administrator or verify server environment credentials.'
                      )
                    }
                    className="text-xs font-semibold text-[#0E3D2B] hover:text-[#C59B27] transition-colors cursor-pointer"
                  >
                    Forgot your password?
                  </button>
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
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span>Log In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

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
