'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Home,
  Camera,
  Sparkles,
  MapPin,
  ChevronDown,
  Phone,
  ChevronRight,
  PartyPopper,
  Building2,
} from 'lucide-react';
import { getPublicSettings } from '@/api/settings.api';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [rentalDropdownOpen, setRentalDropdownOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [mobileRentalOpen, setMobileRentalOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [shopRentalActive, setShopRentalActive] = useState(false);
  const [businessName, setBusinessName] = useState('Willy Nilly');
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const exploreDropdownRef = useRef(null);

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

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setRentalDropdownOpen(false);
    setExploreDropdownOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRentalDropdownOpen(false);
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(e.target)) {
        setExploreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 4 business offerings requested + Home
  const coreNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Farm House', href: '/farm-house' },
    { label: 'Guest House', href: '/guest-house' },
    { label: 'Horticulture', href: '/horticulture' },
    { label: 'Resort', href: '/resort' },
  ];

  // Rental sub-items inside Dropdown
  const rentalOptions = [
    {
      title: 'Shop Rental',
      subtitle: 'Commercial shops, retail & agro stall spaces',
      href: '/shop-rental',
      icon: Store,
      iconBg: 'bg-blue-100 text-blue-700',
      badge: shopRentalActive ? 'Available' : 'Preview',
      badgeColor: shopRentalActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600',
    },
    {
      title: 'Event Grounds Rental',
      subtitle: '8-acre open lawns for destination weddings & offsites',
      href: '/farm-house#event-enquiry',
      icon: PartyPopper,
      iconBg: 'bg-emerald-100 text-emerald-700',
      badge: '800+ Guests',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Guest Cottage Rental',
      subtitle: 'Tranquil AC & Non-AC countryside rooms',
      href: '/guest-house',
      icon: Building2,
      iconBg: 'bg-amber-100 text-amber-700',
      badge: 'Daily / Weekly',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  // Explore sub-items inside Dropdown
  const exploreOptions = [
    {
      title: 'Farmhouse & Nearest Tourist Spots',
      subtitle: 'Sandhya Farm (50-pax picnic), Sangeeta Nursery & Allora Forestry',
      href: '/farm-house#odisha-tourism',
      icon: MapPin,
      iconBg: 'bg-emerald-100 text-emerald-700',
      badge: 'Blog & Guide',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Photo Gallery',
      subtitle: '8-acre landscapes, agro living & celebration moments',
      href: '/gallery',
      icon: Camera,
      iconBg: 'bg-cyan-100 text-cyan-700',
      badge: 'Photos',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      title: 'About Willy Nilly',
      subtitle: 'Agro tourism roots, heritage farming & Odia living',
      href: '/about',
      icon: Compass,
      iconBg: 'bg-amber-100 text-amber-800',
      badge: 'Story',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Contact Us',
      subtitle: 'Direct tour desk, locations & visitor assistance',
      href: '/contact',
      icon: PhoneCall,
      iconBg: 'bg-rose-100 text-rose-700',
      badge: '24x7 Help',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
  ];

  const secondaryNavLinks = [
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isRentalActive = pathname.startsWith('/shop-rental');
  const isExploreActive = ['/gallery', '/about', '/contact'].some((path) => pathname.startsWith(path));
  const isGuestHousePage = pathname.startsWith('/guest-house');
  const isFarmPage = pathname.startsWith('/farm-house');

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-200 shadow-md">
      {/* ─── Top Tourist Helpline & Motto Bar (Solid, Crisp, No Blur) ─── */}
      <div className="bg-[#0e3d2b] text-white py-1.5 px-3 sm:px-4 text-xs border-b border-amber-500/30">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto flex items-center justify-between gap-3 px-2 sm:px-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-emerald-950 font-mono">
              Agro Tourism
            </span>
            <span className="font-medium text-emerald-100 hidden sm:inline">
              Welcome to Willy Nilly • Experience Odisha Culture, Agro Farming &amp; Traditional Living
            </span>
            <span className="font-medium text-emerald-100 sm:hidden">
              Willy Nilly • Odisha Agro Retreat
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 text-[11px] font-semibold text-amber-300">
            <span className="hidden md:inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Odisha, India</span>
            </span>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400 hover:text-emerald-950 text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Navbar (Opaque Solid White, Expansive & Clean) ─── */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 bg-white">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-2 xl:gap-4">

          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group py-1" aria-label="Willy Nilly Home">
            <img
              src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png"
              alt="Willy Nilly Official Logo"
              width={160}
              height={72}
              style={{ maxHeight: '64px', width: 'auto', display: 'block' }}
              className="h-12 sm:h-14 xl:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden 2xl:flex flex-col">
              <span className="text-xs font-black tracking-widest text-[#0e3d2b] uppercase font-serif">
                Willy Nilly
              </span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                Agro Tourism &amp; Farm
              </span>
            </div>
          </Link>

          {/* Desktop Responsive Navigation (Only Names, No Icons, No Badges) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap">
            {/* Core Links: Home, Farm House, Guest House, Horticulture, Resort */}
            {coreNavLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center ${
                    active
                      ? 'bg-[#0e3d2b] text-white shadow-xs'
                      : 'text-stone-700 hover:text-[#0e3d2b] hover:bg-stone-100'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Rentals Dropdown Menu (Only Name + Chevron) */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setRentalDropdownOpen(true)}
              onMouseLeave={() => setRentalDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setRentalDropdownOpen(!rentalDropdownOpen)}
                className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isRentalActive
                    ? 'bg-[#0e3d2b] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#0e3d2b] hover:bg-stone-100'
                }`}
                aria-expanded={rentalDropdownOpen}
                aria-haspopup="true"
              >
                <span>Rentals</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    rentalDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {rentalDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-slide-up">
                  <div className="bg-white rounded-2xl border-2 border-stone-200 p-2 shadow-2xl space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 border-b border-stone-100">
                      Willy Nilly Rental Services
                    </div>

                    {rentalOptions.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setRentalDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-stone-900 group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                              <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Explore / More Dropdown Menu */}
            <div
              className="relative"
              ref={exploreDropdownRef}
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isExploreActive
                    ? 'bg-[#0e3d2b] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#0e3d2b] hover:bg-stone-100'
                }`}
                aria-expanded={exploreDropdownOpen}
                aria-haspopup="true"
              >
                <span>Explore</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    exploreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {exploreDropdownOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-72 z-50 animate-slide-up">
                  <div className="bg-white rounded-2xl border-2 border-stone-200 p-2 shadow-2xl space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 border-b border-stone-100">
                      Discover Willy Nilly
                    </div>

                    {exploreOptions.map((item, idx) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setExploreDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors group ${
                            active ? 'bg-stone-50 font-semibold' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-stone-900 group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                              <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTA Button */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Link
              href={isGuestHousePage ? '/guest-house/booking' : isFarmPage ? '#event-enquiry' : '/enquiry'}
              className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-800 to-amber-600 text-white hover:from-emerald-900 hover:to-amber-700 shadow-md transition-all active:scale-[0.98] border border-amber-300/40 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>{isGuestHousePage ? 'Book Room' : isFarmPage ? 'Book Farm Stay' : 'Plan Visit'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-stone-100 text-stone-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors focus:outline-none border border-stone-200"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Navigation Drawer (Crisp Solid White, Clean Names Only) ─── */}
      {isOpen && (
        <div className="lg:hidden border-t-2 border-stone-200 bg-white px-4 pt-4 pb-8 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="mb-3 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
              Select What You Want to Explore
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Core Offerings */}
            {coreNavLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#0e3d2b] text-white font-bold border-[#0e3d2b]'
                      : 'bg-stone-50 border-stone-200 text-stone-800 font-semibold hover:bg-stone-100'
                  }`}
                >
                  <span className="text-sm font-bold">{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Rentals Accordion */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileRentalOpen(!mobileRentalOpen)}
                className="w-full p-3 flex items-center justify-between text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <span className="text-sm font-bold">Rentals &amp; Spaces</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    mobileRentalOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileRentalOpen && (
                <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-stone-200 bg-white">
                  {rentalOptions.map((r, idx) => {
                    const Icon = r.icon;
                    return (
                      <Link
                        key={idx}
                        href={r.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-xs font-semibold text-stone-800"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-stone-600" />
                          <span>{r.title}</span>
                        </div>
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${r.badgeColor}`}>
                          {r.badge}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Secondary links */}
            {secondaryNavLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#0e3d2b] text-white font-bold border-[#0e3d2b]'
                      : 'bg-stone-50 border-stone-200 text-stone-800 font-semibold hover:bg-stone-100'
                  }`}
                >
                  <span className="text-sm font-bold">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick CTA button on mobile */}
          <div className="mt-5 pt-4 border-t border-stone-200 flex flex-col gap-2.5">
            <Link
              href="/farm-house"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-emerald-600 text-white shadow-sm"
            >
              <Trees className="w-4 h-4 text-emerald-200" />
              <span>Explore Farm House &amp; Odisha Tours</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
