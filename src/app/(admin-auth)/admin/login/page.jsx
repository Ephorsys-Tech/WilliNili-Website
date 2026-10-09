'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { loginAdmin } from '@/api/auth.api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
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

    try {
      await loginAdmin(formData);
      router.push('/admin');
    } catch (err) {
      setErrors({ form: err.message || 'Invalid credentials or login rate limit reached.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-theme bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="text-2xl font-extrabold text-content-main tracking-tight">
            Willy Nilly
          </span>
        </Link>
        <h2 className="text-xl font-bold text-content-main tracking-tight">
          Administrator Portal
        </h2>
        <p className="text-xs text-content-muted">
          Private administrative access for content, reservations & enquiries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card padding="p-8 sm:p-10" className="shadow-elevation space-y-6">
          {errors.form && (
            <Alert variant="error" title="Authentication Error">
              {errors.form}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Admin Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@willynilly.in"
              autoComplete="username"
              required
            />

            <Input
              label="Admin Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Sign In to Management Console
            </Button>
          </form>

          <div className="pt-4 border-t border-surface-border text-center flex items-center justify-between text-xs text-content-muted">
            <Link href="/" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Return to Public Site
            </Link>
            <span className="inline-flex items-center gap-1 text-[11px] text-content-light">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-bit Encrypted Session
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
