'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import {
  Compass,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Sparkles,
  Utensils,
  Wheat,
  Trees,
  Fish,
  Bird,
  Sprout,
  Award,
  Users,
  Home,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { FARMHOUSE_HUBS } from '@/lib/farmhouseHubsData';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';

function getHubIcon(id) {
  switch (id) {
    case 'sandhya-farm':
      return <Home className="w-4 h-4" />;
    case 'sangeeta-nursery':
      return <Sprout className="w-4 h-4" />;
    case 'allora-resort':
      return <Trees className="w-4 h-4" />;
    case 'willy-nilly-corridor':
      return <Award className="w-4 h-4" />;
    default:
      return <Compass className="w-4 h-4" />;
  }
}

function getHighlightIcon(iconName) {
  switch (iconName) {
    case 'Fish':
      return <Fish className="w-5 h-5 text-emerald-600" />;
    case 'Trees':
      return <Trees className="w-5 h-5 text-emerald-600" />;
    case 'Bird':
      return <Bird className="w-5 h-5 text-emerald-600" />;
    case 'Users':
      return <Users className="w-5 h-5 text-emerald-600" />;
    case 'Sprout':
      return <Sprout className="w-5 h-5 text-emerald-600" />;
    case 'Award':
      return <Award className="w-5 h-5 text-secondary" />;
    case 'Compass':
      return <Compass className="w-5 h-5 text-secondary" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  }
}

export function FarmhouseHubExplorer({ farmHouse = {}, places = [] }) {
  const [activeHubId, setActiveHubId] = useState('sandhya-farm');
  const activeHub = FARMHOUSE_HUBS.find((h) => h.id === activeHubId) || FARMHOUSE_HUBS[0];

  // Resolve dynamic images from database / Cloudinary uploads
  const hubCoverImage = useMemo(() => {
    if (activeHub.id === 'sandhya-farm') {
      return farmHouse?.heroImage || farmHouse?.images?.[0] || activeHub.heroImage || '';
    }
    const matched = (places || []).find(
      (p) =>
        p.name?.toLowerCase().includes(activeHub.name.toLowerCase()) ||
        slugify(p.name) === activeHub.slug
    );
    return matched?.image || activeHub.heroImage || '';
  }, [activeHub, farmHouse, places]);

  const dynamicNearestPlaces = useMemo(() => {
    return activeHub.nearestPlaces.map((np) => {
      const match = (places || []).find(
        (p) =>
          slugify(p.name) === np.slug ||
          p.name?.toLowerCase().includes(np.name.toLowerCase().split('(')[0].trim())
      );
      return {
        ...np,
        image: match?.image || np.image || '',
      };
    });
  }, [activeHub, places]);

  return (
    <section id="farmhouse-properties" className="space-y-10 scroll-mt-24">
      {/* ─── Header & Eyebrow ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-glow-gold text-xs font-semibold text-secondary tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-secondary" />
            <span>Farmhouse Properties &amp; Nearest Destinations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main tracking-tight">
            Explore Farmhouses &amp;{' '}
            <span className="gold-gradient-text text-glow-gold">Nearest Tourist Spots</span>
          </h2>
          <p className="text-sm sm:text-base text-content-muted max-w-3xl">
            Select each farmhouse to explore its specific agro activities, timber groves, fishing ponds, plant inventory, and nearby explorable tourist attractions.
          </p>
        </div>

        {/* Quick Help Badge */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right flex-shrink-0">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Multi-Property Network</span>
          <span className="text-sm font-semibold text-content-main">4 Agro Hubs Across Odisha</span>
        </div>
      </div>

      {/* ─── Interactive Hub Selector Dock ──────────────────────── */}
      <div className="bg-surface-card rounded-3xl border border-surface-border p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {FARMHOUSE_HUBS.map((hub) => {
            const isSelected = activeHubId === hub.id;
            const isPriority = hub.id === 'willy-nilly-corridor';

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => setActiveHubId(hub.id)}
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0E3D2B] via-[#144F38] to-[#0A2E20] text-white shadow-lg ring-2 ring-[#C59B27] -translate-y-0.5'
                    : isPriority
                    ? 'bg-amber-50/80 hover:bg-amber-100 border border-amber-300 text-amber-950 shadow-xs hover:-translate-y-0.5'
                    : 'bg-[#fbfdfa] hover:bg-emerald-50/70 border border-emerald-900/15 text-content-main hover:border-[#C59B27]/40 hover:-translate-y-0.5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/15 text-[#F5D061]'
                      : isPriority
                      ? 'bg-amber-200/80 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {getHubIcon(hub.id)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold truncate">{hub.name}</span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-emerald-100/80' : isPriority ? 'text-amber-800' : 'text-content-muted'
                    }`}
                  >
                    {hub.district}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Active Hub Detail Showcase ─────────────────────────── */}
      <div className="space-y-12">
        {/* Hub Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card shadow-elevation">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full overflow-hidden">
              <CloudinaryImage
                src={hubCoverImage}
                alt={activeHub.name}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${activeHub.badgeColor}`}>
                  {activeHub.badge}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 lg:hidden text-white">
                <p className="text-xs font-bold text-[#F5D061]">{activeHub.distanceLabel}</p>
                <h3 className="text-xl font-extrabold">{activeHub.name}</h3>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="hidden lg:flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>{activeHub.district} • {activeHub.distanceLabel}</span>
                  </div>
                  <span className="text-xs font-semibold text-content-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {activeHub.travelTime}
                  </span>
                </div>

                <div className="hidden lg:block space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
                    {activeHub.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-secondary">
                    {activeHub.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-content-muted leading-relaxed">
                  {activeHub.description}
                </p>

                {/* Specific Related Highlights for this Farmhouse */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-content-main mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Key Offerings &amp; Farming Activities</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeHub.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-surface-muted/50 border border-surface-border/70 space-y-1 hover:border-secondary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {getHighlightIcon(hl.icon)}
                          <span className="text-xs font-bold text-content-main">{hl.title}</span>
                        </div>
                        <p className="text-[11px] text-content-muted leading-relaxed pl-7">
                          {hl.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cuisine & Food highlights */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-900/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B]">
                    <Utensils className="w-4 h-4 text-secondary" />
                    <span>Traditional Farm-Cooked Food Highlights:</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-content-muted">
                    {activeHub.cuisine.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-surface-border/60 flex flex-wrap items-center gap-3">
                <a
                  href="#event-enquiry"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>
                    {activeHub.id === 'sandhya-farm'
                      ? 'Book 50-Person Day Picnic'
                      : activeHub.id === 'sangeeta-nursery'
                      ? 'Inquire Plant Purchase'
                      : activeHub.id === 'allora-resort'
                      ? 'Inquire Jungle Stay Preview'
                      : 'Register Dec 2026 VIP Tour'}
                  </span>
                </a>

                <Link
                  href={`/farm-house/${activeHub.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-muted border border-surface-border text-xs sm:text-sm font-semibold text-content-main transition-all"
                >
                  <span>Explore Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                </Link>

                <a
                  href={activeHub.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-content-muted hover:text-primary transition-colors ml-auto"
                >
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span>Map Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Nearest Explorable Places for Active Hub ──────────── */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-secondary" />
                <span>Explorable Circuit Around {activeHub.name}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-content-main tracking-tight">
                Nearest Tourist &amp; Picnic Spots from{' '}
                <span className="gold-gradient-text">{activeHub.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-content-muted">
                Plan your day outing or overnight retreat with these nearest verified destinations.
              </p>
            </div>
          </div>

          {/* Nearest Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dynamicNearestPlaces.map((place, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-surface-border bg-surface-card overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Distance Tag */}
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-900/10">
                    <CloudinaryImage
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-[#F5D061] backdrop-blur-sm border border-white/20">
                        {place.distance}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
                        {place.travelTime}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      {place.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-content-main group-hover:text-primary transition-colors line-clamp-1">
                      {place.name}
                    </h4>
                    <p className="text-xs text-content-muted leading-relaxed line-clamp-2">
                      {place.description}
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-900">
                        {place.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-5 pb-5 pt-3 border-t border-surface-border/60 flex items-center justify-between">
                  <Link
                    href={`/farm-house/${place.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover group/link"
                  >
                    <span>Read Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-secondary group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={place.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-surface-muted transition-colors"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmhouseHubExplorer;
