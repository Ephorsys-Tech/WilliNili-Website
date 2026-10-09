'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, Phone, Mail, MapPin, Clock, Shield, ArrowRight } from 'lucide-react';
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
  const address = settings?.address || 'Willy Nilly Agro Campus, Green Valley, India';
  const hours = settings?.businessHours || 'Guest House: 24/7 Check-in | Nursery: 8 AM - 6 PM';
  const shopActive = Boolean(settings?.shopRentalActive);

  return (
    <footer className="bg-surface border-t border-surface-border transition-colors pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-theme bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-content-main">
                {businessName}
              </span>
            </Link>
            <p className="text-sm text-content-muted leading-relaxed">
              Experience the tranquility of sustainable agro living, lush orchards, comfortable guest house accommodations, open celebration grounds, and thriving horticulture nurseries.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary-light/50 text-primary-dark border border-primary/20">
                <Shield className="w-3.5 h-3.5" />
                Verified Agro-Tourism Sanctuary
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main">
              Explore Destinations
            </h3>
            <ul className="space-y-2.5 text-sm text-content-muted">
              <li>
                <Link href="/guest-house" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  Guest House Accommodations
                </Link>
              </li>
              <li>
                <Link href="/farm-house" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  Farm House Event Grounds
                </Link>
              </li>
              <li>
                <Link href="/resort" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  Upcoming Eco-Resort
                </Link>
              </li>
              <li>
                <Link href="/horticulture" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  Horticulture & Plant Nursery
                </Link>
              </li>
              {shopActive && (
                <li>
                  <Link href="/shop-rental" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    Commercial Shop Rentals
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Helpful Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main">
              Company & Media
            </h3>
            <ul className="space-y-2.5 text-sm text-content-muted">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Our Vision & Founder
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Photo Gallery & Campus Tour
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Location & Contact Guide
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="hover:text-primary transition-colors">
                  General & Service Enquiries
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors text-xs text-content-light">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-content-main">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm text-content-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
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

        {/* PRD Scope Notice & Copyright */}
        <div className="mt-12 pt-8 border-t border-surface-border text-center md:flex md:items-center md:justify-between text-xs text-content-light">
          <p className="max-w-xl text-left mb-4 md:mb-0">
            <strong>Scope Disclosure:</strong> Willy Nilly web platform processes booking requests and event enquiries subject to administrator availability confirmation. Online payments and resort bookings are disabled in the MVP stage.
          </p>
          <p>
            &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
