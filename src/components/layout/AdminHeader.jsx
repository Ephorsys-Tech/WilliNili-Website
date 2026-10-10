'use client';

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
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/20">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Authenticated Session</span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
