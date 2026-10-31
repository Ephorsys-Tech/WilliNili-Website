'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { getPublicSettings } from '@/api/settings.api';

export function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted && data) setSettings(data);
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  const businessName = 'Willy Nilly Agro Tourism & Farm';
  const phone = '+91 98765 43210';
  const email = 'info@willynilly.in';
  const address = 'Willy Nilly Agro Campus, Green Valley Road, State Highway, India';
  const hours = 'Guest House: 24/7 Check-in | Horticulture Nursery: 8:00 AM – 6:00 PM';
  const shopActive = Boolean(settings?.shopRentalActive);

  return (
    <footer className="relative bg-[#06170F] text-white border-t border-emerald-900/40 transition-colors pt-16 pb-12 mt-20 overflow-hidden">
      {/* ─── Ambient Landscape Backdrop (Pahad, Jharna & Village Culture) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg"
          alt="Rural Odisha Landscape with Mountains, Waterfall and Village"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Balanced contrast overlay: preserves the waterfall, mountains, and village while guaranteeing AAA text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04140D]/80 via-[#071E14]/65 to-[#020A06]/90 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand & Official Logo */}
          <div className="space-y-4 bg-black/20 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-4 md:p-0 rounded-2xl">
            <Link href="/" className="inline-block group">
              <img
                src="https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png"
                alt="Willy Nilly Official Logo"
                className="h-20 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md"
              />
            </Link>
            <p className="text-sm text-emerald-50/90 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              Experience the tranquility of sustainable agro living, lush orchards, comfortable guest house accommodations, open celebration grounds, and thriving horticulture nurseries.
            </p>

          </div>

          {/* Quick Links to Public Offerings */}
          <div className="space-y-4 bg-black/20 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-4 md:p-0 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5D061] border-b border-white/20 pb-2 drop-shadow-sm flex items-center gap-2">
              <span>Experiences &amp; Stays</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/guest-house"
                  className="text-stone-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5D061] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>Guest House Accommodations</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/farm-house"
                  className="text-stone-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5D061] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>Farm House Event Grounds</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/horticulture"
                  className="text-stone-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5D061] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>Horticulture &amp; Plant Nursery</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/resort"
                  className="text-stone-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5D061] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>Resort (Launching Soon)</span>
                </Link>
              </li>
              {shopActive && (
                <li>
                  <Link
                    href="/shop-rental"
                    className="text-stone-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5D061] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>Commercial Shop Rentals</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Public Pages & Company Info */}
          <div className="space-y-4 bg-black/20 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-4 md:p-0 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5D061] border-b border-white/20 pb-2 drop-shadow-sm">
              Explore Willy Nilly
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-stone-200 hover:text-[#F5D061] hover:translate-x-1 transition-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-stone-200 hover:text-[#F5D061] hover:translate-x-1 transition-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  About Our Vision &amp; Heritage
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-stone-200 hover:text-[#F5D061] hover:translate-x-1 transition-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  Photo Gallery Tour
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-stone-200 hover:text-[#F5D061] hover:translate-x-1 transition-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  Visit Us &amp; Directions
                </Link>
              </li>
              <li>
                <Link
                  href="/enquiry"
                  className="text-stone-200 hover:text-[#F5D061] hover:translate-x-1 transition-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  Make an Enquiry
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-stone-400 hover:text-stone-200 transition-colors text-xs inline-block pt-1"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="space-y-4 bg-black/20 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-4 md:p-0 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5D061] border-b border-white/20 pb-2 drop-shadow-sm">
              Location &amp; Contact
            </h3>
            <div className="space-y-3 text-sm text-stone-200">
              <div className="flex items-start gap-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <MapPin className="w-4 h-4 text-[#F5D061] mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <Phone className="w-4 h-4 text-[#F5D061] flex-shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-stone-200 hover:text-[#F5D061] transition-colors font-medium"
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <Mail className="w-4 h-4 text-[#F5D061] flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-stone-200 hover:text-[#F5D061] transition-colors"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <Clock className="w-4 h-4 text-[#F5D061] mt-1 flex-shrink-0" />
                <span className="text-xs text-stone-300 leading-relaxed">{hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice, Policy Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-xs text-stone-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex items-center gap-4 text-stone-200">
              <Link href="/privacy-policy" className="hover:text-[#F5D061] transition-colors drop-shadow-sm">
                Privacy Policy
              </Link>
              <span className="text-stone-400">•</span>
              <Link href="/terms-and-conditions" className="hover:text-[#F5D061] transition-colors drop-shadow-sm">
                Terms and Conditions
              </Link>
              <span className="text-stone-400">•</span>
              <Link href="/contact" className="hover:text-[#F5D061] transition-colors drop-shadow-sm">
                Directions
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/15 pt-4">
            <p className="text-stone-300">
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
            <p className="text-[#F5D061] text-[11px] font-medium tracking-wide">
              Sustainable Agro Tourism &amp; Horticulture Destination
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
