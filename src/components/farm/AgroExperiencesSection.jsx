'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  Utensils,
  Home,
  CheckCircle2,
  Sparkles,
  Heart,
  Sun,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function AgroExperiencesSection({ experiences = [] }) {
  const defaultExperiences = [
    {
      title: 'Precious Agroforestry & Fishing Pond',
      subtitle: 'Sandalwood, Agarwood & Freshwater Angling',
      icon: 'Sprout',
      tag: 'Basecamp Attractions',
      description:
        'Walk through lush groves of White & Red Sandalwood, rare Agarwood, Mahogany, and towering Betel Nut palms. Feed and catch freshwater fish in our natural pond, and visit free-range turkey and colour bird yards.',
      features: [
        'White & Red Sandalwood (*Chandan*) & Agarwood (*Oud*) groves',
        'Natural freshwater angling pond for fishing & recreation',
        'Free-range Turkey farming & exotic Colour Bird aviary yard',
        'Towering Betel Nut (*Gua*) & Mahogany tree canopy walks',
      ],
      badgeClass: 'badge-glow-gold text-secondary',
      accentColor: 'border-secondary/30',
    },
    {
      title: '50-Person Picnic & Odia Woodfire Dining',
      subtitle: 'Private Day-Picnics & Earthen Pot Chulha Feasts',
      icon: 'Utensils',
      tag: 'Group Hospitality',
      description:
        'Specially equipped to host private day picnics for up to 50 people. Savor woodfire handi delicacies cooked in earthen clay pots and served fresh on banana leaves with complete lawn amenities.',
      features: [
        'Curated group arrangements for picnics of up to 50 people',
        'Clay-pot woodfire cooking: Fresh pond fish, desi chicken & mutton',
        'Nutritious village Dalma with Desi Ghee & Pakhala Bhata',
        'Caramelized Sal-leaf Chhena Poda & fresh sweet coconut water',
      ],
      badgeClass: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      accentColor: 'border-amber-500/30',
    },
    {
      title: 'Willy Nilly Eco Tourism Circuit (Dec 2026)',
      subtitle: 'Basecamp Stay, Nursery Tours & Jungle Resort',
      icon: 'Home',
      tag: 'Dec 2026 Priority',
      description:
        'Connecting Sandhya Agro Farm House in Kisan Nagar, Sangeeta Grafting Nursery in Niali (2 Lakh plants for sale), and Allora Agro Forestry & Jungle Resort in Dhenkanal into Odisha’s premier eco-tourism network.',
      features: [
        'Central basecamp at Sandhya Farm House (Kisan Nagar, Cuttack)',
        'Sangeeta Grafting Nursery: 2 Lakh mango & cashew plants for sale',
        'Allora Agro Forestry: 5,000 mother trees & upcoming Jungle Resort',
        'Official launch targeted before December 2026 (Pre-Booking Active)',
      ],
      badgeClass: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
      accentColor: 'border-emerald-500/30',
    },
  ];

  const items = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  const renderIcon = (idx) => {
    if (idx === 0) return <Sprout className="w-6 h-6 text-emerald-600" />;
    if (idx === 1) return <Flame className="w-6 h-6 text-amber-600" />;
    return <Home className="w-6 h-6 text-secondary" />;
  };

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-glow-gold text-xs font-semibold text-secondary tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Odisha Farm Living Experience</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main tracking-tight">
          Live the Culture, <span className="gold-gradient-text text-glow-gold">Taste the Tradition</span>
        </h2>
        <p className="text-sm sm:text-base text-content-muted leading-relaxed">
          At Willy Nilly Farm House, you do not just observe from afar—you immerse your senses into Odisha’s authentic agrarian lifestyle, eat farm-to-plate organic delicacies, and recharge in pure countryside tranquility.
        </p>
      </div>

      {/* 3 Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between bg-surface-card rounded-2xl border border-surface-border p-7 sm:p-8 card-rich-hover shadow-card glow-box-gold/20 hover:border-secondary/40 relative overflow-hidden group"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/15 transition-all" />

            <div className="space-y-6 relative z-10">
              {/* Header with icon and tag */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-surface-muted/90 border border-surface-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(idx)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.badgeClass || 'badge-glow-gold text-secondary'}`}>
                  {item.tag || 'Experience'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-content-main group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-secondary tracking-wide">
                  {item.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-content-muted leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-4 border-t border-surface-border/70">
                {(item.features || []).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-content-main">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Links */}
            <div className="pt-6 mt-6 border-t border-surface-border/60 flex items-center justify-between gap-3">
              <Link
                href={`/farm-house/${
                  idx === 0
                    ? 'authentic-agro-farming-methods'
                    : idx === 1
                    ? 'traditional-odia-farm-fresh-dining'
                    : 'serene-rural-stay-cultural-lifestyle'
                }`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
              >
                <span>Read Story &amp; Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="#event-enquiry"
                className="text-xs font-semibold text-secondary hover:text-secondary-hover"
              >
                Book Experience
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Immersion Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-secondary/30 bg-primary-dark text-white p-8 sm:p-12 shadow-elevation">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-emerald-900/60 via-amber-950/40 to-stone-900/80 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold badge-glow-gold text-amber-300 uppercase tracking-widest">
            Traditional Odia Hospitality
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-glow-gold tracking-tight">
            Want to Host a Cultural Event, Agro Workshop, or Family Retreat?
          </h3>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            Our 8-acre farm house grounds can be arranged for traditional Odia theme dinners, woodfire cooking sessions, agrarian celebrations, and nature picnics tailored to your gathering.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#event-enquiry"
              className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm shadow-elevation transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>Enquire for Farm Stay &amp; Event</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-xs text-white/70">
              Custom arrangements for 50 to 800+ guests
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgroExperiencesSection;
