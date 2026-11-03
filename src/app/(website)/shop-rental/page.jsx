'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, Maximize, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BgHero } from '@/components/ui/BgHero';
import { getPublicShops } from '@/api/shop-rental.api';

export default function ShopRentalPage() {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getPublicShops()
      .then((data) => {
        if (isMounted && Array.isArray(data)) setShops(data);
      })
      .catch((err) => {
        // If server returns 404 or module inactive, mark inactive
        if (err.status === 404 || err.code === 'NOT_FOUND') {
          if (isMounted) setIsInactive(true);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isInactive) {
    // PRD: Completely hidden and 404 when inactive
    return notFound();
  }

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg"
        alt="Commercial shop rentals on the ground floor of Willy Nilly Guest House"
        size="sm"
        align="center"
        eyebrow="Guest House Ground Floor"
        title={
          <>
            Ground Floor{' '}
            <span style={{ color: '#f0d87a' }}>Commercial Shops</span>
          </>
        }
        subtitle="Prime commercial retail spaces situated directly on the ground floor of the Willy Nilly Guest House building. Benefit from consistent daily footfall of residing guests, tourists, and agro-travelers with 24/7 security and high-visibility parking."
        breadcrumbs={[{ label: 'Shop Rental' }]}
        stats={[
          { value: 'Ground Floor', label: 'Guest House Building' },
          { value: 'Resident', label: 'Captive Guest Footfall' },
          { value: 'Flexible', label: 'Lease Periods' },
          { value: '24/7', label: 'Campus Security' },
        ]}
        actions={
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
          >
            <Store className="w-4 h-4" />
            Enquire About a Unit
          </Link>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Co-Location Notice: Ground Floor of Guest House */}
        <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              Co-Located with Willy Nilly Guest House
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-content-main">
              Ground Floor Commercial Arcade Beneath Guest Suites
            </h2>
            <p className="text-sm text-content-muted max-w-3xl leading-relaxed">
              Our commercial retail units are situated on the <strong>ground floor of the main Guest House building</strong>. The floors directly above house AC &amp; Deluxe family guest suites, ensuring your enterprise (organic food, nursery plants, handicrafts, snacks, or daily supplies) receives organic, high-intent daily footfall from staying tourists, weekend holidaymakers, and event visitors.
            </p>
          </div>
          <Link
            href="/guest-house"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-semibold text-xs transition-colors flex-shrink-0"
          >
            <span>Explore Guest House Suites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner text="Checking shop listings..." />
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-theme border border-surface-border p-8">
            <Store className="w-12 h-12 text-content-light mx-auto mb-3" />
            <h3 className="text-lg font-bold text-content-main">No Active Shop Listings</h3>
            <p className="text-sm text-content-muted mt-1">
              All shop units are currently occupied or under maintenance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <Card key={shop._id} hoverEffect padding="p-0" className="flex flex-col group">
                <div className="h-52 bg-surface-muted relative overflow-hidden flex items-center justify-center">
                  {shop.images && shop.images.length > 0 ? (
                    <img
                      src={shop.images[0]}
                      alt={shop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Store className="w-12 h-12 text-content-light" />
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Badge variant="primary">Shop #{shop.shopNumber}</Badge>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm">
                      Ground Floor • Guest House
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={shop.isAvailable ? 'success' : 'neutral'}>
                      {shop.isAvailable ? 'Available' : 'Occupied'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-content-main group-hover:text-primary transition-colors">
                      {shop.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-content-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-primary" />
                        {shop.sizeSqFt} Sq. Ft.
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 truncate text-emerald-800 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {shop.location.includes('Ground Floor') ? shop.location : `Ground Floor (Guest House) • ${shop.location}`}
                      </span>
                    </div>
                    <p className="text-xs text-content-muted mt-3 line-clamp-3 leading-relaxed">
                      {shop.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-primary">₹{shop.rentAmount}</span>
                      <span className="text-xs text-content-muted"> / {shop.rentPeriod || 'Month'}</span>
                    </div>

                    <Link href={`/shop-rental/${shop._id}`}>
                      <Button size="sm" variant="primary">
                        Enquire <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
