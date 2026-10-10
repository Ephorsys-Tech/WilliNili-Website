'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  BookOpenCheck,
  Trees,
  Compass,
  Flower2,
  Store,
  Images,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Business Info', href: '/admin/business-info', icon: Building2 },
  { label: 'Guest House Rooms', href: '/admin/guest-house', icon: BedDouble },
  { label: 'Booking Requests', href: '/admin/bookings', icon: BookOpenCheck },
  { label: 'Farm House Events', href: '/admin/farm-house', icon: Trees },
  { label: 'Resort (Coming Soon)', href: '/admin/resort', icon: Compass },
  { label: 'Horticulture Plants', href: '/admin/horticulture', icon: Flower2 },
  { label: 'Shop Rental', href: '/admin/shop-rental', icon: Store },
  { label: 'Gallery Curation', href: '/admin/gallery', icon: Images },
  { label: 'Enquiries & Messages', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Settings & Modules', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ onLogout, currentAdmin }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-surface border-r border-surface-border flex flex-col h-screen sticky top-0 transition-colors shadow-sm z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/logo.png"
            alt="Willy Nilly"
            className="h-10 w-auto object-contain"
          />
          <div>
            <span className="text-sm font-bold text-primary tracking-tight block uppercase leading-tight">
              Willy Nilly
            </span>
            <span className="text-[10px] text-secondary font-semibold tracking-wider uppercase block">
              Admin Portal
            </span>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="p-1.5 rounded-theme text-content-muted hover:text-primary hover:bg-surface-muted transition-colors flex-shrink-0"
          title="View Live Public Website"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-content-inverted shadow-card font-semibold'
                  : 'text-content-muted hover:text-content-main hover:bg-surface-muted'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-surface-border bg-surface-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-xs font-semibold text-content-main truncate">
              {currentAdmin?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-content-light truncate">
              {currentAdmin?.email || 'admin@willynilly.in'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-theme text-status-error bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Securely</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
