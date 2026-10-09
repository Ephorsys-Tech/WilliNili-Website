'use client';

import React from 'react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { ShieldCheck } from 'lucide-react';

export function AdminHeader({ title, subtitle }) {
  return (
    <header className="bg-surface border-b border-surface-border px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-content-main tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-content-muted mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Authenticated Session</span>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

export default AdminHeader;
