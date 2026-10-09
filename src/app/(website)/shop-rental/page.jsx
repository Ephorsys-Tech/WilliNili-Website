'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, Maximize, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="success">Module Activated</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-content-main tracking-tight">
          Commercial Shop Rentals
        </h1>
        <p className="text-base sm:text-lg text-content-muted leading-relaxed">
          Prime commercial spaces located along the high-footfall entrance of Willy Nilly Agro Campus. Ideal for handicrafts, nursery supplies, and organic food vendors.
        </p>
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
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">Shop #{shop.shopNumber}</Badge>
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
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {shop.location}
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
  );
}
