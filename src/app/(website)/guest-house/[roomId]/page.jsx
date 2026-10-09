'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BedDouble, Users, Check, ArrowLeft, Calendar, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicRoomById } from '@/api/room.api';

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (roomId) {
      getPublicRoomById(roomId)
        .then((data) => {
          if (isMounted) setRoom(data);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  if (isLoading) {
    return <LoadingSpinner text="Loading room details..." />;
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-bold text-content-main mb-3">Room Not Found</h2>
        <p className="text-sm text-content-muted mb-6">
          The requested room does not exist or has been taken off active listing.
        </p>
        <Link href="/guest-house">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guest House
          </Button>
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      <Link
        href="/guest-house"
        className="inline-flex items-center text-sm font-medium text-content-muted hover:text-primary transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Guest House listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Photos & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visual */}
          <div className="h-80 sm:h-96 bg-surface-muted rounded-theme border border-surface-border overflow-hidden relative flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={images[activeImage] || images[0]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-content-muted">
                <BedDouble className="w-16 h-16 mx-auto mb-2 text-content-light" />
                <p className="text-sm">Room Photo</p>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="primary">{room.roomType}</Badge>
              <Badge variant={room.isAc ? 'success' : 'neutral'}>
                {room.isAc ? 'Air Conditioned' : 'Non-AC'}
              </Badge>
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-theme border-2 overflow-hidden transition-all ${
                    activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-surface-border opacity-70'
                  }`}
                >
                  <img src={img} alt={`${room.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Room Description */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-content-main">
              {room.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-content-muted pt-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Capacity: {room.capacityAdults} Adults {room.capacityChildren > 0 ? `+ ${room.capacityChildren} Children` : ''}
              </span>
              <span>&bull;</span>
              <span>Bed: {room.bedType}</span>
            </div>
            <p className="text-base text-content-muted leading-relaxed whitespace-pre-line pt-2">
              {room.description}
            </p>
          </div>

          {/* Features & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-border">
            <div>
              <h3 className="text-base font-semibold text-content-main mb-3">Room Highlights</h3>
              <ul className="space-y-2">
                {(room.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-content-muted">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-content-main mb-3">Amenities Included</h3>
              <ul className="space-y-2">
                {(room.amenities || []).map((amen, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-content-muted">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{amen}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card */}
        <div className="space-y-6">
          <Card padding="p-6" className="sticky top-28 space-y-6 border-primary/20 shadow-elevation">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-content-muted block mb-1">
                Accommodation Tariff
              </span>
              {room.priceDisplay ? (
                <div>
                  <span className="text-3xl font-extrabold text-primary">₹{room.pricePerNight}</span>
                  <span className="text-sm text-content-muted"> / night</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-content-main">Tariff provided upon enquiry</span>
              )}
            </div>

            <div className="space-y-3 py-2 text-xs text-content-muted border-y border-surface-border">
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="font-semibold text-content-main">12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="font-semibold text-content-main">11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span className="font-semibold text-content-main">{room.roomType}</span>
              </div>
            </div>

            <Link href={`/guest-house/booking?room=${room._id}`} className="block">
              <Button size="lg" variant="primary" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Submit Booking Request
              </Button>
            </Link>

            <div className="text-[11px] text-content-light leading-relaxed flex items-start gap-2 bg-surface-muted/50 p-3 rounded-theme">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>
                Booking requests are subject to administrator verification. No instant charge or online payment required.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
