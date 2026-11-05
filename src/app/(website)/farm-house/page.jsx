'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trees,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  MapPin,
  Clock,
  PartyPopper,
  Compass,
  Utensils,
  Wheat,
  Camera,
  MessageCircle,
  Phone,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BgHero } from '@/components/ui/BgHero';
import { FarmLocationGallery } from '@/components/farm/FarmLocationGallery';
import { FarmhouseHubExplorer } from '@/components/farm/FarmhouseHubExplorer';
import { OdishaTouristPlaces } from '@/components/farm/OdishaTouristPlaces';
import { AgroExperiencesSection } from '@/components/farm/AgroExperiencesSection';
import { SandhyaBookingSection } from '@/components/farm/SandhyaBookingSection';
import { getFarmHouseContent } from '@/api/farm-house.api';

export default function FarmHousePage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getFarmHouseContent()
      .then((data) => {
        if (data) setContent(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const title = content?.title || 'Sandhya Agro Farm House & Willy Nilly Eco Retreat';
  const description =
    content?.description ||
    'Flagship agro retreat in Sagadipatana, Kisan Nagar, Cuttack featuring a freshwater fishing pond, White & Red Sandalwood, Agarwood, Mahogany, Betel Nut groves, Colour Bird & Turkey cultivation, and curated 50-person day picnic setups.';
  const area = content?.propertyArea || '8 Acres of Natural Agroforestry & Lawns';
  const capacity = content?.guestCapacity || '50-Person Picnics to 800+ Event Gatherings';
  const facilities = content?.facilities || [
    'Freshwater Angling & Aquaculture Fishing Pond',
    'White & Red Sandalwood, Agarwood & Mahogany Groves',
    'Colour Bird Aviary & Free-Range Turkey Farming Yard',
    'Private Day-Picnic Pavilions (Arranged for Up to 50 People)',
    'Traditional Woodfire Chulha & Earthen Pot Cooking Yards',
    'Covered Dining Verandas & Modern Sanitized Restrooms',
    'Expansive Open Lawns with Ambient Lighting & Power Backup',
    'Ample Secure Vehicle Parking',
  ];
  const suitableEvents = content?.suitableEvents || [
    '50-Person Family & Corporate Day Picnics',
    'Freshwater Pond Angling & Aquaculture Outings',
    'Agroforestry & Sandalwood Botanical Tours',
    'Destination Weddings & Cultural Celebrations',
    'School Nature Excursions & Organic Farming Workshops',
  ];

  return (
    <div className="animate-fade-in bg-bg">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image={content?.heroImage || content?.images?.[0] || ''}
        alt="Farm house celebration grounds and agro retreat"
        size="lg"
        align="center"
        eyebrow="Agro Tourism Basecamp • Sagadipatana, Kisan Nagar, Cuttack"
        title={
          <>
            Sandhya Agro Farm House &amp;{' '}
            <span className="text-[#f5d061] drop-shadow-lg font-black">Eco Tourism Hub</span>
          </>
        }
        subtitle={description}
        breadcrumbs={[{ label: 'Farm House' }]}
        stats={[
          { value: 'Kisan Nagar, Cuttack', label: 'Sandhya Farmhouse Base' },
          { value: '50-Pax Picnic Ready', label: 'Fishing Pond & Gazebos' },
          { value: '2 Lakh Plants', label: 'Sangeeta Nursery (Niali)' },
          { value: 'Target: Dec 2026', label: 'Top Priority Eco Launch' },
        ]}
        actions={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#event-enquiry"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-elevation transition-all transform hover:-translate-y-0.5 border border-secondary/40 ring-2 ring-secondary/20"
            >
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Plan Farm Stay &amp; Event</span>
            </a>
            <a
              href="#odisha-tourism"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition-all shadow-sm"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Explore Odisha Places</span>
            </a>
            <a
              href="#farm-gallery"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-black/60 transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-secondary" />
              <span>View Farm Photos</span>
            </a>
          </div>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">

        {/* 1. Agro Experiences & Cultural Living Section */}
        <div id="agro-experiences">
          <AgroExperiencesSection experiences={content?.agroExperiences} />
        </div>

        {/* 2. Farmhouse Properties & Nearest Explorable Spots Showcase */}
        <div id="farmhouse-properties" className="pt-2">
          <FarmhouseHubExplorer farmHouse={content} places={content?.touristPlaces} />
        </div>

        {/* 3. Farm Location Images Gallery Section */}
        <div id="farm-gallery">
          <FarmLocationGallery images={content?.images} title={title} />
        </div>

        {/* 4. Complete Odisha Tourist Places Directory */}
        <div id="odisha-tourism" className="pt-4">
          <OdishaTouristPlaces places={content?.touristPlaces} />
        </div>

        {/* 4. Facilities & Suitable Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card padding="p-8 sm:p-10" className="space-y-6 glow-box-emerald border border-surface-border bg-surface-card">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Trees className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Farm Infrastructure</span>
              <h2 className="text-2xl font-bold text-content-main">Venue Amenities &amp; Facilities</h2>
            </div>
            <div className="space-y-3.5 pt-2">
              {facilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-content-main font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="p-8 sm:p-10" className="space-y-6 glow-box-gold border border-surface-border bg-surface-card">
            <div className="w-14 h-14 rounded-2xl bg-secondary-light/60 text-secondary flex items-center justify-center border border-secondary/30">
              <PartyPopper className="w-7 h-7 text-secondary" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Celebrations &amp; Retreats</span>
              <h2 className="text-2xl font-bold text-content-main">Ideal Event Types</h2>
            </div>
            <div className="space-y-3.5 pt-2">
              {suitableEvents.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-content-main font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 5. Sandhya Farmhouse Stay & Event Booking Section */}
        <SandhyaBookingSection />
      </div>
    </div>
  );
}
