'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, CheckCircle2, UserCheck, Target, Compass, ArrowRight, ShieldCheck, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BgHero } from '@/components/ui/BgHero';
import { getPublicSettings } from '@/api/settings.api';

export default function AboutPage() {
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
  const ownerName = settings?.ownerName || 'Mr. Sarat Kumar Singh';
  const ownerTitle = settings?.ownerTitle || 'Founder & Visionary';
  const ownerBio =
    settings?.ownerBio ||
    'Pioneering sustainable agro tourism and horticulture development in the region, Mr. Sarat Kumar Singh created Willy Nilly to foster close harmony with nature, eco-conscious leisure, and community empowerment.';
  const aboutStory =
    settings?.aboutStory ||
    'Nestled amidst lush greenery and fertile soils, Willy Nilly is an agro-tourism retreat and horticulture center dedicated to organic living, tranquil hospitality, and celebration spaces in natural surroundings.';
  const vision =
    settings?.vision ||
    'To be the benchmark agro-tourism destination that enriches lives through sustainable horticulture, serene hospitality, and vibrant natural spaces.';
  const mission =
    settings?.mission ||
    'To provide authentic agro-living experiences, promote eco-friendly horticulture practices, and offer memorable stays and celebrations.';
  const highlights = settings?.highlights || [
    'Scenic agro-tourism campus with lush greenery',
    'Serene guest house accommodations with modern amenities',
    'Expansive open-air farm house grounds for weddings & private events',
    'Curated horticulture plant & sapling nursery',
    'Upcoming luxury eco-resort experience',
  ];

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85"
        alt="Willy Nilly agro landscape"
        size="md"
        align="center"
        eyebrow="About Willy Nilly"
        title={
          <>
            Nurturing Nature &amp;{' '}
            <span style={{ color: '#f0d87a' }}>Hospitality</span>
          </>
        }
        subtitle={`Discover the heritage, principles, and vision powering ${businessName} — a premier agro-tourism retreat rooted in sustainable living and warm countryside hospitality.`}
        breadcrumbs={[{ label: 'About Us' }]}
        stats={[
          { value: '8+ Acres', label: 'Lush Agro Campus' },
          { value: 'Guest House', label: 'Restful Country Stays' },
          { value: 'Event Lawns', label: 'Celebrations & Gatherings' },
          { value: 'Plant Nursery', label: 'Fruit & Herbal Saplings' },
        ]}
        actions={
          <>
            <Link href="/enquiry">
              <Button variant="primary" size="lg">
                <Send className="w-4 h-4" />
                Enquire Now
              </Button>
            </Link>
            <Link href="/guest-house">
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-content-main transition-all"
              >
                Explore Stays
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Story & Background */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-content-main">
              Our Story &amp; Natural Roots
            </h2>
            <p className="text-base text-content-muted leading-relaxed">
              {aboutStory}
            </p>
            <p className="text-sm text-content-muted leading-relaxed">
              What began as a focused commitment to organic horticulture and indigenous sapling cultivation has evolved into an all-encompassing agro-tourism hub. Today, visitors from across the region visit to escape urban chaos, breathe uncontaminated countryside air, celebrate milestones, and bring healthy green plants back to their own homes.
            </p>
            <div className="pt-2">
              <Link href="/guest-house">
                <Button variant="primary">
                  Explore Stays <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <Card padding="p-8" className="bg-surface-muted/50 border-surface-border space-y-6">
            <div className="w-12 h-12 rounded-theme bg-primary/10 text-primary flex items-center justify-center">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-content-main">Core Highlights</h3>
            <div className="space-y-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-content-main font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Founder Profile */}
        <section className="bg-surface border border-surface-border rounded-theme p-8 sm:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="text-center lg:text-left space-y-2">
              <div className="w-24 h-24 mx-auto lg:mx-0 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary mb-4">
                <UserCheck className="w-12 h-12" />
              </div>
              <Badge variant="secondary">{ownerTitle}</Badge>
              <h3 className="text-2xl font-bold text-content-main">{ownerName}</h3>
              <p className="text-xs text-content-muted">Founder &amp; Leading Agriculturist</p>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-lg font-semibold text-content-main">A Message From The Founder</h4>
              <p className="text-sm sm:text-base text-content-muted leading-relaxed italic">
                &ldquo;{ownerBio}&rdquo;
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Dedicated to environmental stewardship, local livelihood, and agro wellness</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-theme bg-secondary-light/40 text-secondary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-content-main">Our Vision</h3>
            <p className="text-sm text-content-muted leading-relaxed">
              {vision}
            </p>
          </Card>

          <Card padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-theme bg-primary-light/50 text-primary flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-content-main">Our Mission</h3>
            <p className="text-sm text-content-muted leading-relaxed">
              {mission}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
