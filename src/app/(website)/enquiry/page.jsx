'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SandhyaBookingSection } from '@/components/farm/SandhyaBookingSection';

export default function GeneralEnquiryPage() {
  return (
    <div className="animate-fade-in bg-[#fbfdfa] min-h-screen">
      {/* ─── Breadcrumb Navigation ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#415A4D]">
          <Link href="/" className="hover:text-[#0E3D2B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#0E3D2B]">Book Farm Stay &amp; Event Enquiry</span>
        </nav>
      </div>

      {/* ─── Main Booking Form ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <SandhyaBookingSection />
      </main>
    </div>
  );
}
