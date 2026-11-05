'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Ban, ShieldCheck, Flower2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { BgHero } from '@/components/ui/BgHero';
import { PenthaBhitarkanikaTourism } from '@/components/resort/PenthaBhitarkanikaTourism';
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

  const resortName = content?.resortName || 'Willy Nilly Eco Resort & Allora Jungle Sanctuary';
  const launchStatus = content?.launchStatus || 'Top Priority: Launching Before Dec 2026';
  const launchMessage =
    content?.launchMessage ||
    'Part of the Willy Nilly Agro Eco Tourism Project (Official Launch: Before December 2026). Featuring the upcoming Allora Jungle Resort in Odapada, Dhenkanal nestled within 5,000 cashew and mango mother plants.';
  const conceptDescription =
    content?.conceptDescription ||
    'A sanctuary where rustic agro charm meets sustainable modern luxury. Centered around Allora Agro Forestry in Gobindaprasad, Odapada, Dhenkanal with 5,000 mother trees of cashew and mango, bio-climatic private forest villas, natural lagoon pool, and organic farm dining.';
  const featuresPlanned = content?.featuresPlanned || [
    'Private Luxury Eco Forest Cottages & Tree Canopy Villas',
    'Allora Agro Forestry Sanctuary with 5,000 Mother Plants (Kaju & Mango)',
    'Natural Chemical-Free Bio-Swimming Lagoon',
    'Ayurvedic Wellness & Morning Forest Yoga Pavilion',
    'Farm-to-Fork Organic Dining with Smoked Bamboo Cuisine',
    'Guided Agro & Deep-Nature Bird Watching Trails in Dhenkanal',
  ];

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://plus.unsplash.com/premium_photo-1661964304872-7b715cf38cd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
        alt="Luxury eco resort pool at twilight"
        size="lg"
        align="center"
        eyebrow="Top Priority Target • Launching Before December 2026"
        title={
          <>
            <span style={{ color: '#f0d87a' }}>{resortName}</span>
          </>
        }
        subtitle={launchMessage}
        breadcrumbs={[{ label: 'Resort' }]}
        stats={[
          { value: 'Odapada, Dhenkanal', label: 'Allora Jungle Setting' },
          { value: '5,000 Mother Trees', label: 'Cashew & Mango Forest' },
          { value: 'Eco Tree Villas', label: 'Canopy Living' },
          { value: 'Target: Dec 2026', label: 'Grand Unveiling' },
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

      {/* ─── Page Body: Concept Architecture & Notice ──────── */}


      {/* ─── Explore Pentha & Bhitarkanika Tourism Circuit ─── */}
      <PenthaBhitarkanikaTourism />
    </div>
  );
}
