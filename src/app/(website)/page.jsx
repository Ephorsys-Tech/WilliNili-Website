'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Trees,
  Compass,
  Flower2,
  Store,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getPublicSettings } from '@/api/settings.api';
import { getPublicRooms } from '@/api/room.api';
import { getPublicGallery } from '@/api/gallery.api';
import { EstateVisionSection } from '@/components/home/EstateVisionSection';
import { EstateConciergeSection } from '@/components/home/EstateConciergeSection';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getPublicSettings(), getPublicRooms(), getPublicGallery()])
      .then(([sData, rData, gData]) => {
        if (!isMounted) return;
        if (sData) setSettings(sData);
        if (Array.isArray(rData)) setFeaturedRooms(rData.slice(0, 3));
        if (Array.isArray(gData)) setGalleryImages(gData.slice(0, 6));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const businessName = settings?.businessName || 'Willy Nilly';
  const tagline = settings?.tagline || 'Where Nature Meets Hospitality & Sustainable Agro Living';
  const shopActive = Boolean(settings?.shopRentalActive);

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section with Rich Visuals */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-primary/15 via-bg-alt/40 to-bg px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center py-20 space-y-8 z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-surface-border shadow-sm text-xs font-semibold text-primary">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Official Horticulture & Agro Tourism Sanctuary</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-content-main tracking-tight leading-[1.1]">
            Welcome to <span className="text-primary">{businessName}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-content-muted leading-relaxed">
            {tagline}. Unwind in serene Guest House accommodations, celebrate life in open-air Farm House grounds, explore indigenous horticulture nurseries, and look forward to our upcoming eco-resort.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/guest-house/booking">
              <Button size="lg" variant="primary" className="shadow-elevation">
                <Calendar className="w-5 h-5 mr-2" />
                Book Stay Request
              </Button>
            </Link>
            <Link href="/farm-house">
              <Button size="lg" variant="secondary">
                <Trees className="w-5 h-5 mr-2" />
                Plan Farm Event
              </Button>
            </Link>
            <Link href="/horticulture">
              <Button size="lg" variant="outline">
                <Flower2 className="w-5 h-5 mr-2" />
                Explore Nursery
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left border-t border-surface-border">
            <div className="bg-surface/80 p-4 rounded-theme border border-surface-border">
              <p className="text-2xl font-bold text-primary">8+ Acres</p>
              <p className="text-xs text-content-muted">Lush Natural Campus</p>
            </div>
            <div className="bg-surface/80 p-4 rounded-theme border border-surface-border">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-content-muted">Guest House Hospitality</p>
            </div>
            <div className="bg-surface/80 p-4 rounded-theme border border-surface-border">
              <p className="text-2xl font-bold text-primary">800+ Cap.</p>
              <p className="text-xs text-content-muted">Open Celebration Lawns</p>
            </div>
            <div className="bg-surface/80 p-4 rounded-theme border border-surface-border">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-content-muted">Organic Agro Nursery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="primary">Our Core Offerings</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-content-main tracking-tight">
            Discover Diverse Agro Experiences
          </h2>
          <p className="text-content-muted text-sm sm:text-base">
            From restful stays to grand open-space events and vibrant horticulture saplings, explore our multifaceted campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Guest House */}
          <Card hoverEffect padding="p-6" className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-theme bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-content-main">Guest House</h3>
              <p className="text-sm text-content-muted leading-relaxed">
                Quiet, comfortable rooms featuring AC and Non-AC options, attached bathrooms, garden views, and verified hospitality.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/guest-house" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1">
                Browse Rooms <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Farm House */}
          <Card hoverEffect padding="p-6" className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-theme bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-content-main">Farm House & Events</h3>
              <p className="text-sm text-content-muted leading-relaxed">
                Expansive open-air lawns and dining pavilion for destination weddings, family celebrations, anniversaries, and corporate retreats.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/farm-house" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1">
                Event Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Resort (Upcoming) */}
          <Card hoverEffect padding="p-6" className="flex flex-col justify-between group border-dashed">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-theme bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-content-main">Resort</h3>
                <Badge variant="warning">Launching Soon</Badge>
              </div>
              <p className="text-sm text-content-muted leading-relaxed">
                Our luxury eco-resort concept is currently under development. Experience villas, wellness yoga, and organic farm dining soon.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/resort" className="inline-flex items-center text-sm font-semibold text-content-main hover:text-primary gap-1">
                Explore Concept <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Horticulture */}
          <Card hoverEffect padding="p-6" className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-theme bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Flower2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-content-main">Horticulture Nursery</h3>
              <p className="text-sm text-content-muted leading-relaxed">
                High-yielding fruit plants, organic medicinal herbs, flowering varieties, and agro-forestry saplings nurtured organically.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/horticulture" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1">
                View Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Shop Rental (Conditional) */}
          {shopActive && (
            <Card hoverEffect padding="p-6" className="flex flex-col justify-between group md:col-span-2 lg:col-span-4 bg-primary-light/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-content-main">Commercial Shop Rentals</h3>
                    <Badge variant="success">Active Opportunities</Badge>
                  </div>
                  <p className="text-sm text-content-muted">
                    Prime commercial shop spaces now available for agro-vendors, handicrafts, and local artisans.
                  </p>
                </div>
                <Link href="/shop-rental">
                  <Button variant="primary">Browse Available Shops</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Featured Rooms Section */}
      {featuredRooms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="primary" className="mb-2">Accommodations</Badge>
              <h2 className="text-3xl font-bold text-content-main">
                Featured Guest House Rooms
              </h2>
            </div>
            <Link href="/guest-house">
              <Button variant="outline" size="sm">
                View All Rooms <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <Card key={room._id} hoverEffect padding="p-0" className="flex flex-col">
                <div className="h-48 bg-surface-muted relative flex items-center justify-center overflow-hidden">
                  {room.images && room.images[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <BedDouble className="w-10 h-10 text-content-light mx-auto mb-2" />
                      <span className="text-xs text-content-muted">Deluxe Room View</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <Badge variant={room.isAc ? 'primary' : 'neutral'}>
                      {room.isAc ? 'AC Room' : 'Non-AC'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-content-main mb-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-content-muted line-clamp-2">
                      {room.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                    {room.priceDisplay ? (
                      <div>
                        <span className="text-lg font-extrabold text-primary">₹{room.pricePerNight}</span>
                        <span className="text-xs text-content-muted"> / night</span>
                      </div>
                    ) : (
                      <span className="text-xs text-content-muted">Price on request</span>
                    )}

                    <Link href={`/guest-house/booking?room=${room._id}`}>
                      <Button size="sm" variant="primary">
                        Request Stay
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Estate Vision & Heritage: Founder Profile & Agrarian Mission */}
      <EstateVisionSection settings={settings} />

      {/* Estate Direct Concierge: Reserve Your Dates & Submit Multi-Tab Enquiry */}
      <EstateConciergeSection rooms={featuredRooms} />

      {/* Gallery Preview */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="primary" className="mb-2">Visual Tour</Badge>
              <h2 className="text-3xl font-bold text-content-main">
                Moments at Willy Nilly
              </h2>
            </div>
            <Link href="/gallery">
              <Button variant="outline" size="sm">
                View Full Gallery <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img) => (
              <div
                key={img._id}
                className="aspect-square bg-surface-muted rounded-theme border border-surface-border overflow-hidden group relative"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[11px] text-white font-medium truncate">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
