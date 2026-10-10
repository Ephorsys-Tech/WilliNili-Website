'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  Trees,
  Compass,
  Flower2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface SectionItem {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  badge: string;
  badgeVariant?: 'primary' | 'secondary' | 'warning' | 'danger';
  href: string;
  ctaText: string;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
  reverse?: boolean;
}

// 4 Core Offerings configured with Willy Nilly Theme colors & Unsplash visuals
const DEFAULT_SECTIONS: SectionItem[] = [
  {
    id: 1,
    category: 'Guest House',
    title: 'Guest House Sanctuary',
    subtitle: 'Restful Stays in Lush Nature',
    description:
      'Quiet, comfortable rooms featuring AC and Non-AC options, attached bathrooms, garden views, and verified hospitality. Relax in peaceful countryside serenity surrounded by fragrant orchards.',
    highlights: ['Attached Modern Bathrooms', 'Private Garden & Orchard Views', '24/7 Agro Concierge Support'],
    badge: 'Available Daily',
    badgeVariant: 'primary',
    href: '/guest-house',
    ctaText: 'Browse Rooms',
    icon: BedDouble,
    imageUrl:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    reverse: false,
  },
  {
    id: 2,
    category: 'Farm House & Events',
    title: 'Farm House & Open Lawns',
    subtitle: '8-Acre Celebratory Grounds',
    description:
      'Expansive open-air lawns and covered banquet pavilion for destination weddings, family celebrations, anniversaries, and corporate retreats across 8 natural acres with ambient lighting.',
    highlights: ['Up to 800+ Guest Capacity', 'Covered Banquet Dining Pavilion', 'Bridal & VIP Dressing Suites'],
    badge: 'Open for Bookings',
    badgeVariant: 'secondary',
    href: '/farm-house',
    ctaText: 'Event Details',
    icon: Trees,
    imageUrl:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    reverse: true,
  },
  {
    id: 3,
    category: 'Resort',
    title: 'Eco-Luxury Resort',
    subtitle: 'Upcoming Wellness Sanctuary',
    description:
      'Our luxury eco-resort concept is currently under master planned development. Experience bio-climatic private villas, natural chemical-free pool lagoons, and organic farm-to-fork dining soon.',
    highlights: ['Bio-Climatic Tree Villas', 'Ayurvedic Wellness & Yoga Center', 'Strictly Launching Soon — Bookings Disabled'],
    badge: 'Launching Soon',
    badgeVariant: 'warning',
    href: '/resort',
    ctaText: 'Explore Concept',
    icon: Compass,
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    reverse: false,
  },
  {
    id: 4,
    category: 'Horticulture Nursery',
    title: 'Horticulture Nursery',
    subtitle: 'Certified Indigenous Flora',
    description:
      'High-yielding grafted fruit saplings, therapeutic organic herbs, flowering varieties, and timber forestry species nurtured organically in our fertile campus nursery beds.',
    highlights: ['Grafted Alphonso Mango & Guava', 'Medicinal Krishna Tulsi & Lemongrass', 'Bulk Plantation Soil Guidance'],
    badge: 'Certified Organic',
    badgeVariant: 'primary',
    href: '/horticulture',
    ctaText: 'View Catalog',
    icon: Flower2,
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    reverse: true,
  },
];

// Single Parallax Feature Card
// 1. Image card has NO BORDERS (border-none / completely borderless).
// 2. On scroll down, the next image reveals with a buttery-smooth transition from left to right.
// 3. Text remains 100% solid, crisp, and high-contrast at all times.
function ParallaxFeatureCard({ section, index }: { section: SectionItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  // Physics-based spring transforms for ultra-smooth 60fps parallax motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  // Left-to-right wipe clip-path:
  // Starts with inset(0 100% 0 0) (completely hidden from right), reveals to inset(0 0% 0 0) (fully visible from left to right)
  const clipPercent = useTransform(smoothProgress, [0.05, 0.65], [100, 0]);
  const clipPath = useTransform(
    clipPercent,
    (val) => `inset(0 ${Math.max(0, Math.min(100, val))}% 0 0)`
  );

  // Smooth horizontal slide from left to right in sync with the wipe
  const imageX = useTransform(smoothProgress, [0.05, 0.65], [-35, 0]);

  // Clean opacity fade into full solid vibrancy
  const imageOpacity = useTransform(smoothProgress, [0.02, 0.35], [0.25, 1]);

  // Subtle depth parallax floating effect
  const yParallaxImage = useTransform(smoothProgress, [0, 1], [-18, 18]);

  const Icon = section.icon;

  return (
    <div
      ref={cardRef}
      className="bg-surface rounded-3xl p-6 sm:p-8 lg:p-12 shadow-card hover:shadow-elevation transition-shadow duration-300 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Content Column */}
        <div
          className={`w-full lg:col-span-6 space-y-5 ${
            section.reverse ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {/* Header pill & badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {section.category}
            </span>
            <Badge variant={section.badgeVariant}>{section.badge}</Badge>
          </div>

          {/* Titles - Solid, Dark, High-Contrast */}
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main tracking-tight leading-tight">
              {section.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-secondary mt-1">
              {section.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-content-muted leading-relaxed">
            {section.description}
          </p>

          {/* Feature Highlights */}
          {section.highlights && (
            <div className="space-y-2 pt-1 border-t border-surface-border">
              {section.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-content-main font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-3">
            <Link href={section.href}>
              <Button variant="primary" size="md" className="shadow-sm">
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Column with Left-to-Right Transition and NO Border */}
        <div
          className={`w-full lg:col-span-6 ${
            section.reverse ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* Image Card Container - completely borderless */}
          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-elevation bg-surface-muted aspect-[16/10] sm:aspect-[4/3] w-full">
            {/* Animated left-to-right reveal layer */}
            <motion.div
              style={{
                clipPath,
                x: imageX,
                opacity: imageOpacity,
              }}
              className="w-full h-full relative overflow-hidden will-change-transform"
            >
              <motion.img
                style={{
                  y: yParallaxImage,
                }}
                src={section.imageUrl}
                alt={section.title}
                loading="lazy"
                className="w-full h-full object-cover object-center will-change-transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Subtle Gradient Vignette for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

              {/* In-Image Tag - clean without borders */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface/90 backdrop-blur-md text-content-main shadow-sm">
                  {section.category}
                </span>
                <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                  Willy Nilly Sanctuary
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ParallaxScrollFeatureSection({ sections = DEFAULT_SECTIONS }: { sections?: SectionItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToFirst = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('offerings-list');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="relative w-full py-8 space-y-12">
      {/* Intro Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface shadow-sm text-xs font-semibold text-primary">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Our Core Offerings</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-content-main tracking-tight leading-[1.15]">
          Discover Diverse Agro Experiences
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-content-muted leading-relaxed">
          From restful stays to grand open-space events and vibrant horticulture saplings, explore our multifaceted campus.
        </p>

        <button
          type="button"
          onClick={scrollToFirst}
          className="pt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-content-muted hover:text-primary transition-colors cursor-pointer"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-primary" />
        </button>
      </div>

      {/* Parallax Features List */}
      <div id="offerings-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {sections.map((section, index) => (
          <ParallaxFeatureCard
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

// Export as both Component and ParallaxScrollFeatureSection for backward compatibility
export const Component = ParallaxScrollFeatureSection;
export default ParallaxScrollFeatureSection;
