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
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const businessName = settings?.businessName || 'Willy Nilly';
  const phone = settings?.phonePrimary || '+91 98765 43210';
  const email = settings?.emailPrimary || 'info@willynilly.in';
  const address = settings?.address || 'Willy Nilly Agro Campus, Green Valley Road, State Highway, India';
  const hours = settings?.businessHours || 'Guest House: 24/7 Check-in | Horticulture Nursery: 8:00 AM – 6:00 PM';
  const shopActive = Boolean(settings?.shopRentalActive);

  return (
    <footer className="bg-surface border-t border-surface-border transition-colors pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Official Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src="/images/logo.png"
                alt="Willy Nilly Official Logo"
                className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-content-muted leading-relaxed">
              Experience the tranquility of sustainable agro living, lush orchards, comfortable guest house accommodations, open celebration grounds, and thriving horticulture nurseries.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/20">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                Verified Agro-Tourism Sanctuary
              </span>
            </div>
          </div>

          {/* Quick Links to Public Offerings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main border-b border-surface-border pb-2">
              Experiences &amp; Stays
            </h3>
            <ul className="space-y-2.5 text-sm text-content-muted">
              <li>
                <Link href="/guest-house" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                  Guest House Accommodations
                </Link>
              </li>
              <li>
                <Link href="/farm-house" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                  Farm House Event Grounds
                </Link>
              </li>
              <li>
                <Link href="/horticulture" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                  Horticulture &amp; Plant Nursery
                </Link>
              </li>
              <li>
                <Link href="/resort" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                  Resort (Launching Soon)
                </Link>
              </li>
              {shopActive && (
                <li>
                  <Link href="/shop-rental" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                    Commercial Shop Rentals
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Public Pages & Company Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main border-b border-surface-border pb-2">
              Explore Willy Nilly
            </h3>
            <ul className="space-y-2.5 text-sm text-content-muted">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Our Vision &amp; Heritage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Photo Gallery Tour
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Visit Us &amp; Directions
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="hover:text-primary transition-colors">
                  Make an Enquiry
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors text-xs text-content-light">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main border-b border-surface-border pb-2">
              Location &amp; Contact
            </h3>
            <div className="space-y-3 text-sm text-content-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-xs">{hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice, Policy Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-surface-border text-xs text-content-light">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="max-w-xl text-content-muted">
              <strong>Agro Tourism Notice:</strong> Room stays and event grounds are reserved via formal enquiry request and administrator confirmation. Online payments and resort bookings are disabled in the MVP stage.
            </p>
            <div className="flex items-center gap-4 text-content-muted">
              <Link href="/about#policies" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/about#terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Directions
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-surface-border/50 pt-4">
            <p>
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
            <p className="text-content-light text-[11px]">
              Sustainable Agro Tourism &amp; Horticulture Destination
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
