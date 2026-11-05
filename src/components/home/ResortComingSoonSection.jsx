'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Trees,
  Waves,
  ArrowRight,
  Ban,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { getResortContent } from '@/api/settings.api';

export function ResortComingSoonSection() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getResortContent()
      .then((data) => {
        if (isMounted && data) setContent(data);
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
  }, []);

  const resortName =
    content?.resortName || 'Willy Nilly Eco Resort & Allora Jungle Sanctuary';
  const launchStatus =
    content?.launchStatus || 'Top Priority: Launching Before Dec 2026';
  const launchMessage =
    content?.launchMessage ||
    'Part of the Willy Nilly Agro Eco Tourism Project (Official Launch: Before December 2026). Featuring the upcoming Allora Jungle Resort in Odapada, Dhenkanal nestled within 5,000 cashew and mango mother plants.';
  const conceptDescription =
    content?.conceptDescription ||
    'A sanctuary where rustic agro charm meets sustainable modern luxury. Centered around Allora Agro Forestry in Gobindaprasad, Odapada, Dhenkanal with 5,000 mother trees of cashew and mango, bio-climatic private forest villas, natural lagoon pool, and organic farm dining.';

  const previewImage =
    content?.images?.[0] ||
    'https://plus.unsplash.com/premium_photo-1661964304872-7b715cf38cd1?q=80&w=1200&auto=format&fit=crop';

  return (
    <section id="resort-coming-soon" className="py-14 sm:py-20 bg-gradient-to-b from-stone-50 via-[#F3F6F3] to-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* ─── Left Side: Modern Details & Narrative (7 cols) ─── */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            
            {/* Top Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-[#0E3D2B] text-xs font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Upcoming Flagship &bull; December 2026</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Eco-Luxury Barefoot Living</span>
              </span>
            </div>

            {/* Title & Location */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight font-serif leading-[1.15]">
                {resortName}
              </h2>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 font-medium">
                <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Gobindaprasad, Odapada, Dhenkanal, Odisha</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {conceptDescription}
            </p>

            {/* Key Planned Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                <Trees className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>5,000 Mother Trees Sanctuary</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                <Waves className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span>Bio-Lagoon Natural Swimming</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Canopy Villas &amp; Forest Cottages</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Official Launch: Dec 2026</span>
              </div>
            </div>

            {/* Action Buttons & Notice */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/resort"
                  className="px-5 py-3 rounded-xl bg-[#0E3D2B] hover:bg-[#16563D] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Explore Resort Vision</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/guest-house"
                  className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>Stay at Guest House Today</span>
                </Link>

                <Link
                  href="/contact"
                  className="px-4 py-3 rounded-xl text-stone-500 hover:text-stone-900 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>Pre-Launch Inquiries</span>
                </Link>
              </div>

              {/* Status Note */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <Ban className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span>Public bookings are currently disabled. Reservations will open upon official grand inauguration.</span>
              </div>
            </div>

          </div>

          {/* ─── Right Side: Visual Preview & Metrics (5 cols) ─── */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-stone-900 overflow-hidden group">
            <img
              src={previewImage}
              alt="Willy Nilly Eco Resort Architectural Concept"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Launch Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-400 text-stone-950 shadow-lg flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Target: Dec 2026</span>
              </span>
            </div>

            {/* Overlay Information */}
            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider drop-shadow-sm">
                <Compass className="w-4 h-4" />
                <span>Allora Jungle Sanctuary</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md">
                Barefoot Luxury in an Agro-Forestry Canopy
              </h3>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
                <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-amber-300">5,000</p>
                  <p className="text-[10px] text-stone-300 font-medium">Mother Trees</p>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-emerald-300">Bio-Pool</p>
                  <p className="text-[10px] text-stone-300 font-medium">Chemical Free</p>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-sky-300">Odapada</p>
                  <p className="text-[10px] text-stone-300 font-medium">Dhenkanal</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ResortComingSoonSection;

