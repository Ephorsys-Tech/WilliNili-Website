'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ArrowRight, ShieldCheck, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function EstateVisionSection({ settings }) {
  const ownerName = settings?.ownerName || 'Mr. Sarat Kumar Singh';
  const ownerTitle = settings?.ownerTitle || 'Founder & Chief Estate Steward';
  const ownerPhotoUrl =
    settings?.ownerPhotoUrl ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-surface-muted/50 border border-surface-border rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background shape */}
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-primary/20 rounded-3xl -z-10" />
              <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-secondary/15 rounded-3xl -z-10" />

              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative shadow-elevation border border-surface-border bg-surface group">
                <img
                  src={ownerPhotoUrl}
                  alt={ownerName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {ownerName}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-1">
                    {ownerTitle.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vision & Heritage Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="text-secondary font-black text-lg leading-none">&rdquo;</span>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                Estate Vision &amp; Heritage
              </span>
            </div>

            {/* Headline Quote */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main leading-[1.2] tracking-tight">
              &ldquo;We didn&apos;t set out to manufacture an escape. We simply nurtured soil so people could breathe again.&rdquo;
            </h2>

            {/* Narrative text */}
            <div className="space-y-4 text-sm sm:text-base text-content-muted leading-relaxed">
              <p>
                Under the dedicated leadership of <strong className="text-content-main font-semibold">{ownerName}</strong>, Willy Nilly was conceived not merely as a commercial destination, but as a living agrarian refuge. Rooted in traditional horticultural reverence, our fields celebrate local ecology, mindful organic farming, and hospitality that feels like returning home to family land.
              </p>
              <p>
                Whether you are here for an intimate family reunion under the starlit banyan groves, or seeking rare flowering species for your private gardens, our estate doors remain open with honest simplicity and cultivated dignity.
              </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-surface-border">
              {/* Trust Badge */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-content-main leading-tight">
                    Authentic Stewardship
                  </p>
                  <p className="text-xs text-content-muted mt-0.5">
                    Zero synthetic agrochemicals utilized
                  </p>
                </div>
              </div>

              {/* Read Full Story Button */}
              <Link href="/about">
                <Button variant="primary" className="shadow-sm">
                  Read Our Full Story <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
