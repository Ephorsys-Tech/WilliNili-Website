'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Calendar,
  Send,
  BedDouble,
  Trees,
  Compass,
  Flower2,
  Store,
  PhoneCall,
} from 'lucide-react';
import { getPublicSettings } from '@/api/settings.api';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [shopRentalActive, setShopRentalActive] = useState(false);
  const [businessName, setBusinessName] = useState('Willy Nilly');
  const pathname = usePathname();

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

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Guest House', href: '/guest-house' },
    { label: 'Farm House', href: '/farm-house' },
    { label: 'Resort', href: '/resort', badge: 'Soon' },
    { label: 'Horticulture', href: '/horticulture' },
    ...(shopRentalActive
      ? [{ label: 'Shop Rental', href: '/shop-rental' }]
      : []),
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isGuestHousePage = pathname.startsWith('/guest-house');
  const primaryCtaText = isGuestHousePage ? 'Request a Booking' : 'Enquire Now';
  const primaryCtaHref = isGuestHousePage ? '/guest-house/booking' : '/enquiry';

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-border transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          {/* Official Brand Logo (Standalone & Large) */}
          <Link href="/" className="flex items-center flex-shrink-0 group py-1" aria-label="Willy Nilly Home">
            <img
              src="/images/logo.png"
              alt="Willy Nilly Official Logo"
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-theme transition-colors relative whitespace-nowrap ${
                    active
                      ? 'text-primary bg-primary-light/60 font-semibold'
                      : 'text-content-main hover:text-primary hover:bg-surface-muted'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-secondary/20 text-secondary border border-secondary/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Navigation for Mid Screens (lg) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-0.5 text-xs">
            {navLinks.slice(0, 6).map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 font-medium rounded-theme transition-colors whitespace-nowrap ${
                    active
                      ? 'text-primary bg-primary-light/60 font-semibold'
                      : 'text-content-main hover:text-primary hover:bg-surface-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/gallery"
              className={`px-2.5 py-1.5 font-medium rounded-theme transition-colors whitespace-nowrap ${
                isActive('/gallery')
                  ? 'text-primary bg-primary-light/60 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className={`px-2.5 py-1.5 font-medium rounded-theme transition-colors whitespace-nowrap ${
                isActive('/contact')
                  ? 'text-primary bg-primary-light/60 font-semibold'
                  : 'text-content-main hover:text-primary hover:bg-surface-muted'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-theme bg-primary text-white hover:bg-primary-hover shadow-card transition-all active:scale-[0.98] whitespace-nowrap border border-primary/20"
            >
              {isGuestHousePage ? (
                <Calendar className="w-4 h-4 text-secondary-light" />
              ) : (
                <Send className="w-4 h-4 text-secondary-light" />
              )}
              <span>{primaryCtaText}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-theme text-base font-medium flex items-center justify-between ${
                    active
                      ? 'text-primary bg-primary-light/40 font-semibold'
                      : 'text-content-main hover:bg-surface-muted'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-secondary/20 text-secondary border border-secondary/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border flex flex-col gap-2">
            <Link
              href={primaryCtaHref}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-theme bg-primary text-white hover:bg-primary-hover shadow-sm"
            >
              {isGuestHousePage ? (
                <Calendar className="w-4 h-4 text-secondary-light" />
              ) : (
                <Send className="w-4 h-4 text-secondary-light" />
              )}
              <span>{primaryCtaText}</span>
            </Link>

            {!isGuestHousePage && (
              <Link
                href="/guest-house/booking"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-theme border border-primary text-primary hover:bg-primary-light/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Room Booking</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
