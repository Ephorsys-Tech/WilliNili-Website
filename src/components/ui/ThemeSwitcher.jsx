'use client';

import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Theme"
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-surface-border bg-surface hover:bg-surface-muted transition-colors shadow-sm text-content-main"
      >
        <Palette className="w-3.5 h-3.5 text-primary" />
        <span className="capitalize">{theme} Theme</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-theme bg-surface border border-surface-border shadow-elevation p-2 z-50 animate-slide-up">
            <div className="px-3 py-1.5 text-xs font-semibold text-content-muted border-b border-surface-border mb-1">
              Select Dynamic Theme
            </div>
            {availableThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-theme transition-colors text-left ${
                  theme === t.id
                    ? 'bg-primary-light/40 text-primary-dark font-semibold'
                    : 'text-content-main hover:bg-surface-muted'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: t.primary }}
                  />
                  <span>{t.name}</span>
                </div>
                {theme === t.id && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeSwitcher;
