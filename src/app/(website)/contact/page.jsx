'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  Car,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { getPublicSettings } from '@/api/settings.api';
import { SandhyaContactSection } from '@/components/contact/SandhyaContactSection';

export default function ContactPage() {
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

  const address =
    settings?.address ||
    'Willy Nilly Agro Campus, Green Valley Road, State Highway, Odisha';
  const phone = settings?.phonePrimary || '+91 98765 43210';
  const email = settings?.emailPrimary || 'info@willynilly.in';
  const hours =
    settings?.businessHours || 'Guest House: 24/7 Check-in | Farm & Nursery: 8 AM - 6 PM';

  return (
    <div className="animate-fade-in bg-[#fbfdfa] min-h-screen">
      {/* ─── Breadcrumb Navigation ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#415A4D]">
          <Link href="/" className="hover:text-[#0E3D2B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#0E3D2B]">Contact &amp; Reservations</span>
        </nav>
      </div>

      {/* ─── High-Fidelity Contact & Enquiry Section ──────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
        <SandhyaContactSection settings={settings} />

        {/* ─── Location & Driving Directions Guide ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Driving Transit Note */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2d5] shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0E3D2B] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#136C43]" />
            </div>
            <h3 className="font-heading-serif font-bold text-lg text-[#0E3D2B]">
              How to Reach Us
            </h3>
            <p className="text-xs sm:text-sm text-[#415A4D] leading-relaxed">
              Located directly off the State Highway connecting Cuttack and Jagatsinghpur via Kisan
              Nagar. Accessible by private cars, tourist coaches, and local transit. Look for the
              official Willy Nilly Horticulture &amp; Agro Tourism entrance arch.
            </p>
          </div>

          {/* Card 2: Parking & Campus Amenities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2d5] shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#C59B27] flex items-center justify-center">
              <Car className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="font-heading-serif font-bold text-lg text-[#0E3D2B]">
              Parking &amp; Arrival
            </h3>
            <p className="text-xs sm:text-sm text-[#415A4D] leading-relaxed">
              Expansive secure on-site parking available for up to 60+ vehicles and tourist buses.
              Paved driveways, shaded tree canopies, dedicated guest drop-off zones, and 24/7 security
              assistance.
            </p>
          </div>

          {/* Card 3: Google Maps Navigation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2d5] shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0E3D2B] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#136C43]" />
              </div>
              <h3 className="font-heading-serif font-bold text-lg text-[#0E3D2B]">
                GPS Location Pin
              </h3>
              <p className="text-xs sm:text-sm text-[#415A4D] leading-relaxed">
                Sagadipatana, Barda, Kisan Nagar, Cuttack. 35 mins from Cuttack Railway Station, 55
                mins from Bhubaneswar Airport.
              </p>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                'Willy Nilly Agro Tourism Campus, Odisha'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0E3D2B] text-white text-xs font-bold hover:bg-[#08281C] transition-all transform hover:-translate-y-0.5 shadow-sm mt-2"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
