'use client';

import React from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Trees,
  Sprout,
  Store,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function ExperiencesGrid({
  businessName = 'Willy Nilly',
  featuredRooms = [],
  farmHouse = {},
  plants = [],
  shopActive = false,
}) {
  const guestHouseCoverImg =
    featuredRooms[0]?.images?.[0] ||
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  const farmHouseCoverImg =
    farmHouse?.image ||
    farmHouse?.heroImage ||
    farmHouse?.images?.[0] ||
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80';

  const horticultureCoverImg =
    plants[0]?.images?.[0] ||
    plants[0]?.image ||
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';

  const minRoomPrice =
    featuredRooms.length > 0
      ? Math.min(...featuredRooms.map((r) => r.pricePerNight || 2200))
      : 2200;

  const minPlantPrice =
    plants.length > 0 ? Math.min(...plants.map((p) => p.price || 80)) : 80;

  const EXPERIENCES = [
    {
      id: 'guest-house',
      badge: 'Country Retreats',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      title: 'Guest House Stays',
      description:
        'Peaceful AC and Non-AC accommodations with orchard balconies, clean ensuite baths, and quiet natural ambience.',
      image: guestHouseCoverImg,
      icon: BedDouble,
      highlights: [
        'AC & Non-AC Room Options',
        'Private Balcony & Garden Views',
        `Starting from ₹${minRoomPrice}/night`,
      ],
      link: '/guest-house',
      linkText: 'Explore Rooms',
    },
    {
      id: 'farm-house',
      badge: '8-Acre Lawns & Events',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'Farm House & Grounds',
      description:
        'Sagadipatana, Cuttack — Sprawling 8-acre open lawns, natural freshwater angling pond, and 50-person family picnic base.',
      image: farmHouseCoverImg,
      icon: Trees,
      highlights: [
        'Freshwater Angling & Fishing',
        'Sandalwood & Mahogany Groves',
        'Day Picnics & Lawn Gatherings',
      ],
      link: '/farm-house',
      linkText: 'Explore Farm House',
    },
    {
      id: 'horticulture',
      badge: 'Certified Plant Nursery',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      title: 'Horticulture & Nursery',
      description:
        '150+ varieties of high-yielding grafted mango, guava, certified sandalwood saplings, and rare medicinal coastal flora.',
      image: horticultureCoverImg,
      icon: Sprout,
      highlights: [
        '150+ Grafted Fruit Saplings',
        'Certified Sandalwood & Timber',
        `Healthy plants from ₹${minPlantPrice}`,
      ],
      link: '/horticulture',
      linkText: 'Browse Plant Nursery',
    },
    {
      id: 'shop-rental',
      badge: shopActive ? 'Space Available' : 'Agro Arcade',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      title: 'Commercial Rentals',
      description:
        'Ground-floor commercial retail stalls and arcade shops for organic agro products, nursery saplings, and refreshments.',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      icon: Store,
      highlights: [
        'Ground Floor Highway Access',
        'Heavy Tourist & Visitor Footfall',
        'Flexible Transparent Leases',
      ],
      link: '/shop-rental',
      linkText: 'View Shop Rentals',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {EXPERIENCES.map((exp) => {
          const IconComponent = exp.icon;
          return (
            <div
              key={exp.id}
              className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${exp.badgeColor}`}
                  >
                    {exp.badge}
                  </span>
                </div>

                {/* Floating Category Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Card Title on Image */}
                <div className="absolute bottom-3 left-3 right-12">
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow-sm">
                    {exp.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>

                {/* Feature tags */}
                <div className="space-y-1.5 pt-1">
                  {exp.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] text-stone-700 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link Button */}
                <div className="pt-3 border-t border-stone-100">
                  <Link
                    href={exp.link}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-[#0E3D2B] text-stone-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
                  >
                    <span>{exp.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExperiencesGrid;

