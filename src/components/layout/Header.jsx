'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sprout,
  Calendar,
  PhoneCall,
  ChevronDown,
  BedDouble,
  Trees,
  Compass,
  Flower2,
  Store,
} from 'lucide-react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { getPublicSettings } from '@/api/settings.api';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(true);
  const [shopRentalActive, setShopRentalActive] = useState(false);
  const [businessName, setBusinessName] = useState('Willy Nilly');
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted && data) {
          setShopRentalActive(Boolean(data.shopRentalActive));
          if (data.businessName) {
            const cleanName = data.businessName.replace(/\s*\(.*?\)/g, '').trim();
            setBusinessName(cleanName || 'Willy Nilly');
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on page change
  useEffect(() => {
    setIsCategoryOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const categoryItems = [
    {
      label: 'Guest House',
      href: '/guest-house',
      description: 'Serene rooms & stay requests',
      icon: BedDouble,
    },
    {
      label: 'Farm House',
      href: '/farm-house',
      description: 'Open-air grounds & event enquiries',
      icon: Trees,
    },
    {
      label: 'Resort',
      href: '/resort',
      description: 'Upcoming luxury eco-sanctuary',
      icon: Compass,
      badge: 'Soon',
    },
    {
      label: 'Horticulture',
      href: '/horticulture',
      description: 'Plants & organic nursery catalogue',
      icon: Flower2,
    },
    ...(shopRentalActive
      ? [
          {
            label: 'Shop Rental',
            href: '/shop-rental',
            description: 'Commercial shop lease units',
            icon: Store,
          },
        ]
      : []),
  ];

  const isCategoryActive = categoryItems.some((item) => pathname.startsWith(item.href));

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-surface-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-theme bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <Sprout className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-content-main group-hover:text-primary transition-colors block">
                {businessName ? businessName.replace(/\s*\(.*?\)/g, '').trim() || 'Willy Nilly' : 'Willy Nilly'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors ${
                pathname === '/'
                  ? 'text-primary bg-primary-light/50 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors ${
                isActive('/about')
                  ? 'text-primary bg-primary-light/50 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              About Us
            </Link>

            {/* Categories Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`px-3.5 py-2 text-sm font-medium rounded-theme transition-colors inline-flex items-center gap-1.5 ${
                  isCategoryActive || isCategoryOpen
                    ? 'text-primary bg-primary-light/50 font-semibold'
                    : 'text-content-main hover:text-primary hover:bg-surface-muted'
                }`}
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryOpen ? 'rotate-180 text-primary' : 'text-content-muted'
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-theme bg-surface border border-surface-border shadow-elevation p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-surface-border mb-1">
                    Agro Tourism Destinations
                  </div>
                  <div className="space-y-0.5">
                    {categoryItems.map((cat) => {
                      const Icon = cat.icon;
                      const active = pathname.startsWith(cat.href);
                      return (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setIsCategoryOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-theme transition-colors group ${
                            active
                              ? 'bg-primary-light/40 text-primary-dark font-medium'
                              : 'text-content-main hover:bg-surface-muted'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-theme flex-shrink-0 transition-colors ${
                              active
                                ? 'bg-primary text-white'
                                : 'bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold truncate">{cat.label}</span>
                              {cat.badge && (
                                <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-secondary/20 text-secondary border border-secondary/30">
                                  {cat.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-content-muted truncate mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors ${
                isActive('/gallery')
                  ? 'text-primary bg-primary-light/50 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Gallery
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors ${
                isActive('/contact')
                  ? 'text-primary bg-primary-light/50 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Contact Us
            </Link>

            <Link
              href="/enquiry"
              className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors ${
                isActive('/enquiry')
                  ? 'text-primary bg-primary-light/50 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Enquiry
            </Link>
          </nav>

          {/* Actions & Theme Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeSwitcher />
            <Link
              href="/guest-house/booking"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-theme bg-primary text-content-inverted hover:bg-primary-hover shadow-card transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Stay</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-theme text-content-main hover:bg-surface-muted transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-surface-border bg-surface px-4 pt-3 pb-6 animate-slide-up shadow-elevation max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-theme text-base font-medium ${
                pathname === '/'
                  ? 'text-primary bg-primary-light/40 font-semibold'
                  : 'text-content-main hover:bg-surface-muted'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-theme text-base font-medium ${
                isActive('/about')
                  ? 'text-primary bg-primary-light/40 font-semibold'
                  : 'text-content-main hover:bg-surface-muted'
              }`}
            >
              About Us
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="border-y border-surface-border my-1 py-1">
              <button
                type="button"
                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                className={`w-full px-3 py-2.5 rounded-theme text-base font-semibold flex items-center justify-between transition-colors ${
                  isCategoryActive
                    ? 'text-primary bg-primary-light/30'
                    : 'text-content-main hover:bg-surface-muted'
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileCategoryOpen ? 'rotate-180 text-primary' : 'text-content-muted'
                  }`}
                />
              </button>

              {isMobileCategoryOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1">
                  {categoryItems.map((cat) => {
                    const Icon = cat.icon;
                    const active = pathname.startsWith(cat.href);
                    return (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-theme text-sm ${
                          active
                            ? 'text-primary bg-primary-light/40 font-semibold'
                            : 'text-content-muted hover:text-content-main hover:bg-surface-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{cat.label}</span>
                        </div>
                        {cat.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-secondary/20 text-secondary">
                            {cat.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-theme text-base font-medium ${
                isActive('/gallery')
                  ? 'text-primary bg-primary-light/40 font-semibold'
                  : 'text-content-main hover:bg-surface-muted'
              }`}
            >
              Gallery
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-theme text-base font-medium ${
                isActive('/contact')
                  ? 'text-primary bg-primary-light/40 font-semibold'
                  : 'text-content-main hover:bg-surface-muted'
              }`}
            >
              Contact Us
            </Link>

            <Link
              href="/enquiry"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-theme text-base font-medium ${
                isActive('/enquiry')
                  ? 'text-primary bg-primary-light/40 font-semibold'
                  : 'text-content-main hover:bg-surface-muted'
              }`}
            >
              Enquiry
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border flex flex-col gap-2">
            <Link
              href="/guest-house/booking"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-theme bg-primary text-content-inverted hover:bg-primary-hover shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Room Request</span>
            </Link>
            <Link
              href="/enquiry"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-theme border border-primary text-primary hover:bg-primary-light/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Quick Enquiry</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
