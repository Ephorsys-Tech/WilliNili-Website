'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Ban, ShieldCheck, Flower2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { BgHero } from '@/components/ui/BgHero';
import { getResortContent } from '@/api/settings.api';

export default function ResortPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getResortContent()
      .then((data) => {
        if (data) setContent(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const resortName = content?.resortName || 'Willy Nilly Eco Resort';
  const launchStatus = content?.launchStatus || 'Launching Soon';
  const launchMessage =
    content?.launchMessage ||
    'Our premier eco-luxury resort is currently under master planned development. Online booking is strictly disabled until official grand inauguration.';
  const conceptDescription =
    content?.conceptDescription ||
    'A sanctuary where rustic agro charm meets sustainable modern luxury. Featuring bio-climatic private villas, natural pools, Ayurvedic wellness center, organic farm-to-table fine dining, and serene nature trails.';
  const featuresPlanned = content?.featuresPlanned || [
    'Private Luxury Eco Cottages & Tree Villas',
    'Natural Chemical-Free Swimming Lagoon',
    'Ayurvedic Wellness & Yoga Pavilion',
    'Farm-to-Fork Organic Dining Restaurant',
    'Guided Agro & Bird Watching Trails',
  ];

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85"
        alt="Luxury eco resort pool at twilight"
        size="lg"
        align="center"
        eyebrow={launchStatus}
        title={
          <>
            <span style={{ color: '#f0d87a' }}>{resortName}</span>
          </>
        }
        subtitle={launchMessage}
        breadcrumbs={[{ label: 'Resort' }]}
        stats={[
          { value: 'Eco Villas', label: 'Private Cottages' },
          { value: 'Natural Pool', label: 'Chemical-Free Lagoon' },
          { value: 'Wellness', label: 'Ayurvedic Pavilion' },
          { value: 'Farm Dining', label: 'Organic Restaurant' },
        ]}
        actions={
          <>
            <Link
              href="/guest-house"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
            >
              Stay at Guest House Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white hover:text-content-main transition-all"
            >
              Inquire with Management
            </Link>
          </>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Disabled Booking Notice */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-theme bg-surface border border-surface-border text-xs font-semibold text-content-muted shadow-sm">
            <Ban className="w-4 h-4 text-rose-500" />
            <span>Public Bookings Currently Disabled — Concept Phase</span>
          </div>
        </div>

        <Alert variant="info" title="Official Project Notice">
          In accordance with the agreed Willy Nilly roadmap, the eco-resort is under design and architectural finalization. Reservations and online payments remain strictly disabled until the founder authorizes official inauguration. Please visit our active Guest House or Farm House spaces in the meantime.
        </Alert>

        {/* Concept Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="primary">Architectural Concept</Badge>
            <h2 className="text-3xl font-bold text-content-main leading-tight">
              Harmonizing Luxury Living with Sustainable Agro Ecology
            </h2>
            <p className="text-base text-content-muted leading-relaxed">
              {conceptDescription}
            </p>
            <p className="text-sm text-content-muted leading-relaxed">
              Every structure is designed using local indigenous materials, passive solar cooling, recycled water management, and organic landscapes to ensure zero disruption to the fertile surrounding farmlands.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/guest-house">
                <Button variant="primary">
                  Stay at Guest House Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Inquire with Management
                </Button>
              </Link>
            </div>
          </div>

          <Card padding="p-8" className="bg-surface-muted/60 space-y-6">
            <div className="w-12 h-12 rounded-theme bg-primary/10 text-primary flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-content-main">Planned Resort Amenities</h3>
            <ul className="space-y-3">
              {featuresPlanned.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-light/60 text-primary-dark font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-content-main font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
