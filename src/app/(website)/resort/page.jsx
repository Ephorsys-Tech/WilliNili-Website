'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Ban, ShieldCheck, Flower2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      {/* Launching Soon Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{launchStatus}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-content-main tracking-tight">
          {resortName}
        </h1>

        <p className="text-base sm:text-lg text-content-muted leading-relaxed">
          {launchMessage}
        </p>

        {/* Disabled Booking Badge */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-theme bg-surface border border-surface-border text-xs font-semibold text-content-muted shadow-sm">
            <Ban className="w-4 h-4 text-rose-500" />
            <span>Public Bookings Currently Disabled — Concept Phase</span>
          </div>
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
  );
}
