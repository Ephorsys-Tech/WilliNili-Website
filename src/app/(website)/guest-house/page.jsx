'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BedDouble, Users, Check, Calendar, ArrowRight, Info, Wind } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicRooms } from '@/api/room.api';

export default function GuestHousePage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    getPublicRooms()
      .then((data) => {
        if (isMounted && Array.isArray(data)) setRooms(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (selectedFilter === 'AC') return r.isAc === true;
    if (selectedFilter === 'Non-AC') return r.isAc === false;
    if (selectedFilter !== 'All') return r.roomType === selectedFilter;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Agro Accommodations</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-content-main tracking-tight">
          Willy Nilly Guest House
        </h1>
        <p className="text-base sm:text-lg text-content-muted leading-relaxed">
          Peaceful, spotless rooms surrounded by nature. Enjoy natural ventilation, serene views, and warm hospitality away from urban clutter.
        </p>
      </div>

      {/* Scope Disclaimer Alert */}
      <Alert variant="info" title="Booking Request Policy">
        Guest House stays operate on a <strong>request-first basis</strong>. Submitting a booking form registers your request with our administration team, who will review availability and contact you directly to confirm. Instant online booking and advance online payments are outside the current scope.
      </Alert>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {['All', 'AC', 'Non-AC', 'Double', 'Family', 'Deluxe', 'Suite'].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
              selectedFilter === filter
                ? 'bg-primary text-content-inverted border-primary shadow-sm'
                : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted hover:text-content-main'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <LoadingSpinner text="Fetching available rooms..." />
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-theme border border-surface-border p-8">
          <BedDouble className="w-12 h-12 text-content-light mx-auto mb-3" />
          <h3 className="text-lg font-bold text-content-main">No Rooms Found</h3>
          <p className="text-sm text-content-muted mt-1">
            There are currently no rooms matching this filter. Please check back soon or try another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <Card key={room._id} hoverEffect padding="p-0" className="flex flex-col group">
              {/* Image Preview */}
              <div className="h-56 bg-surface-muted relative overflow-hidden flex items-center justify-center">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    <BedDouble className="w-12 h-12 text-content-light mx-auto mb-2" />
                    <span className="text-xs text-content-muted">Room Visual</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{room.roomType}</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={room.isAc ? 'success' : 'neutral'}>
                    {room.isAc ? 'AC Room' : 'Non-AC'}
                  </Badge>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-content-main group-hover:text-primary transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-content-muted mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Up to {room.capacityAdults} Adults {room.capacityChildren > 0 ? `+ ${room.capacityChildren} Child` : ''}
                    </span>
                    <span>&bull;</span>
                    <span>{room.bedType}</span>
                  </div>
                  <p className="text-xs text-content-muted mt-3 line-clamp-3 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Amenities Snippet */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-medium rounded bg-surface-muted text-content-muted"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-0.5 text-[11px] font-medium text-primary">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing & Actions */}
                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <div>
                    {room.priceDisplay ? (
                      <div>
                        <span className="text-xl font-extrabold text-primary">₹{room.pricePerNight}</span>
                        <span className="text-xs text-content-muted"> / night</span>
                      </div>
                    ) : (
                      <span className="text-xs text-content-muted font-medium">Pricing upon enquiry</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/guest-house/${room._id}`}>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </Link>
                    <Link href={`/guest-house/booking?room=${room._id}`}>
                      <Button size="sm" variant="primary">
                        Book Stay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
