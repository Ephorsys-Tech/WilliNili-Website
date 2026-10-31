'use client';

import React from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Users,
  Sprout,
  Trees,
  Store,
  Sparkles,
  ArrowRight,
  Calendar,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

export function ExperiencesStoryScroll({
  businessName = 'Willy Nilly',
  featuredRooms = [],
  farmHouse = {},
  plants = [],
  shopActive = false,
}) {
  // ── 01. Dynamic Guest House Metrics ──────────────────────────────────────
  const roomNames = featuredRooms.map((r) => r.name || r.roomType).filter(Boolean);
  const roomSample =
    roomNames.length > 0 ? roomNames.slice(0, 3).join(', ') : 'Deluxe and Family Suites';
  const minRoomPrice =
    featuredRooms.length > 0
      ? Math.min(...featuredRooms.map((r) => r.pricePerNight || 2200))
      : 2200;
  const maxRoomCapacity =
    featuredRooms.length > 0
      ? Math.max(
          ...featuredRooms.map(
            (r) => (Number(r.capacityAdults) || 2) + (Number(r.capacityChildren) || 0),
          ),
        )
      : 4;
  const guestHouseCoverImg =
    featuredRooms[0]?.images?.[0] ||
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80';

  // ── 02. Dynamic Farm House Metrics ───────────────────────────────────────
  const farmFacilities =
    Array.isArray(farmHouse?.facilities) && farmHouse.facilities.length > 0
      ? farmHouse.facilities
      : [
          'Freshwater Angling & Aquaculture Fishing Pond',
          'White & Red Sandalwood, Agarwood & Mahogany Groves',
          'Colour Bird Aviary & Free-Range Turkey Farming Yard',
          'Private Day-Picnic Pavilions (Arranged for Up to 50 People)',
        ];
  const farmHouseSubtitle =
    farmHouse?.subtitle || 'Sagadipatana, Kisan Nagar, Cuttack • 50-Person Picnic Base';
  const farmHouseDesc =
    farmHouse?.description ||
    `Flagship agro retreat in Sagadipatana, Kisan Nagar, Cuttack featuring a natural freshwater fishing pond, White & Red Sandalwood, Agarwood, Mahogany, Betel Nut groves, Colour Bird & Turkey farming, and curated 50-person day picnic setups with traditional woodfire dining.`;
  const farmHouseCoverImg =
    farmHouse?.heroImage ||
    farmHouse?.image ||
    farmHouse?.images?.[0] ||
    '';

  // ── 03. Dynamic Horticulture Metrics ─────────────────────────────────────
  const plantNames = plants.map((p) => p.name).filter(Boolean);
  const plantSample =
    plantNames.length > 0
      ? plantNames.slice(0, 3).join(', ')
      : 'Grafted Mango, Guava, and Sandalwood saplings';
  const minPlantPrice =
    plants.length > 0 ? Math.min(...plants.map((p) => p.price || 80)) : 80;
  const plantCategories = [...new Set(plants.map((p) => p.category).filter(Boolean))];
  const horticultureCoverImg =
    plants[0]?.images?.[0] ||
    plants[0]?.image ||
    '';

  return (
    <FlowArt
      aria-label="Willy Nilly Experiences Story Scroll"
      className="relative"
      as="div"
    >
      {/* ─── SLIDE 01: GUEST HOUSE ACCOMMODATIONS ─────────────────────────── */}
      <FlowSection
        aria-label="Guest House Accommodations"
        style={{ backgroundColor: '#0e3d2b', color: '#ffffff' }}
        className="relative"
      >
        {/* Subtle dynamic background image overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {guestHouseCoverImg && (
            <img
              src={guestHouseCoverImg}
              alt="Guest House Accommodations"
              className="w-full h-full object-cover opacity-15 filter blur-[1px] scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e3d2b] via-[#0e3d2b]/85 to-[#0e3d2b]/60" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-[#f5d061]">
            <BedDouble className="w-3.5 h-3.5 text-[#f5d061]" />
            <span>01 — Restful Country Stays • Guest House</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-200">
            {featuredRooms.length > 0
              ? `${featuredRooms.length} Curated Suite Categories Available`
              : 'AC & Non-AC Country Suites'}
          </span>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f5d061]">
            Orchard Living &amp; Hospitality
          </span>
          <h3 className="text-[clamp(2.4rem,7vw,7.5rem)] font-extrabold leading-[0.88] uppercase tracking-tight text-white drop-shadow-md">
            RESTFUL
            <br />
            <span className="text-[#f5d061]">GUEST HOUSE</span>
            <br />
            RETREATS
          </h3>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <p className="lg:col-span-7 text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-relaxed text-emerald-100">
            Peaceful, comfortable rooms nestled in verdant orchards at {businessName}.
            Offering <strong>{roomSample}</strong> with home-style countryside hospitality,
            cross-ventilation, and modern attached bathrooms starting from{' '}
            <strong className="text-[#f5d061]">₹{minRoomPrice}/night</strong>.
          </p>

          <div className="lg:col-span-5 flex flex-wrap gap-3 justify-start lg:justify-end">
            <Link
              href="/guest-house"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#c59b27] hover:bg-[#aa821b] text-primary-dark font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Guest House</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#rooms-section"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <Calendar className="w-4 h-4 text-[#f5d061]" />
              <span>Check Room Rates</span>
            </a>
          </div>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        {/* Dynamic Highlight Cards */}
        <div className="relative z-10 flex flex-wrap gap-[1.5vw]">
          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f5d061] mb-1">
              Curated Stays
            </p>
            <p className="text-sm font-bold text-white mb-0.5">
              {featuredRooms.length > 0 ? `${featuredRooms.length} Available Types` : 'Suites & Cottages'}
            </p>
            <p className="text-xs text-emerald-100">
              {featuredRooms.map((r) => r.roomType).filter(Boolean).slice(0, 2).join(' & ') ||
                'Deluxe & Family Cottages'}
            </p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f5d061] mb-1">
              Tariff Starting
            </p>
            <p className="text-sm font-bold text-white mb-0.5">₹{minRoomPrice} / Night</p>
            <p className="text-xs text-emerald-100">Direct agro booking with zero hidden charges</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f5d061] mb-1">
              Capacity Range
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Up to {maxRoomCapacity} Guests</p>
            <p className="text-xs text-emerald-100">Couples, family vacations &amp; group retreats</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f5d061] mb-1">
              Orchard Comfort
            </p>
            <p className="text-sm font-bold text-white mb-0.5">AC &amp; Verandahs</p>
            <p className="text-xs text-emerald-100">
              {featuredRooms[0]?.features?.slice(0, 2).join(' & ') || 'Attached Bath & Power Backup'}
            </p>
          </div>
        </div>
      </FlowSection>

      {/* ─── SLIDE 02: FARM HOUSE & OPEN LAWNS ────────────────────────────── */}
      <FlowSection
        aria-label="Farm House & Open Lawns"
        style={{ backgroundColor: '#0f291e', color: '#ffffff' }}
        className="relative"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {farmHouseCoverImg && (
            <img
              src={farmHouseCoverImg}
              alt="Farm House & Open Lawns"
              className="w-full h-full object-cover opacity-15 filter blur-[1px] scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f291e] via-[#0f291e]/85 to-[#0f291e]/60" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            <Users className="w-3.5 h-3.5 text-cyan-300" />
            <span>02 — Sprawling Open Lawns &amp; Picnics</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-200">
            {farmHouseSubtitle}
          </span>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-300">
            Open Lawns, Angling &amp; Picnics
          </span>
          <h3 className="text-[clamp(2.4rem,7vw,7.5rem)] font-extrabold leading-[0.88] uppercase tracking-tight text-white drop-shadow-md">
            FARM HOUSE
            <br />
            <span className="text-cyan-300">&amp; OPEN LAWNS</span>
            <br />
            CELEBRATIONS
          </h3>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <p className="lg:col-span-7 text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-relaxed text-emerald-100">
            {farmHouseDesc}
          </p>

          <div className="lg:col-span-5 flex flex-wrap gap-3 justify-start lg:justify-end">
            <Link
              href="/farm-house"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Farm House</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/farm-house#event-enquiry"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>Book 50-Pax Picnic</span>
            </Link>
          </div>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        {/* Dynamic Highlight Cards */}
        <div className="relative z-10 flex flex-wrap gap-[1.5vw]">
          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1">
              Freshwater Pond
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Angling &amp; Aquaculture</p>
            <p className="text-xs text-emerald-100 line-clamp-2">
              {farmFacilities[0] || 'Natural fishing pond & pondside angling'}
            </p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1">
              Agroforestry
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Sandalwood &amp; Mahogany</p>
            <p className="text-xs text-emerald-100 line-clamp-2">
              {farmFacilities[1] || 'White/Red Sandalwood, Agarwood & Betel Nut'}
            </p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1">
              Group Picnics
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Arranged for 50 People</p>
            <p className="text-xs text-emerald-100 line-clamp-2">
              {farmFacilities[3] || farmFacilities[2] || 'Woodfire chulha dining & covered verandas'}
            </p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1">
              Avian Sanctuary
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Turkey &amp; Colour Birds</p>
            <p className="text-xs text-emerald-100 line-clamp-2">
              {farmFacilities[2] || 'Free-range poultry yards & guided farm tours'}
            </p>
          </div>
        </div>
      </FlowSection>

      {/* ─── SLIDE 03: HORTICULTURE & PLANT NURSERY ───────────────────────── */}
      <FlowSection
        aria-label="Horticulture & Plant Nursery"
        style={{ backgroundColor: '#134e4a', color: '#ffffff' }}
        className="relative"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {horticultureCoverImg && (
            <img
              src={horticultureCoverImg}
              alt="Horticulture & Plant Nursery"
              className="w-full h-full object-cover opacity-15 filter blur-[1px] scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#134e4a] via-[#134e4a]/85 to-[#134e4a]/60" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
            <Sprout className="w-3.5 h-3.5 text-teal-300" />
            <span>03 — Horticultural Excellence • Plant Propagation</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-teal-200">
            {plants.length > 0 ? `${plants.length}+ Varieties Cataloged` : '2 Lakh Plants for Sale'} • Direct Gate Sales
          </span>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-300">
            Greenhouse Propagation &amp; Agro Forestry
          </span>
          <h3 className="text-[clamp(2.4rem,7vw,7.5rem)] font-extrabold leading-[0.88] uppercase tracking-tight text-white drop-shadow-md">
            HORTICULTURE
            <br />
            <span className="text-teal-300">&amp; PLANT NURSERY</span>
            <br />
            PROPAGATION
          </h3>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <p className="lg:col-span-7 text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-relaxed text-teal-100">
            Thriving plant nursery showcasing grafted fruit trees, indigenous medicinal herbs,
            and forestry saplings at {businessName}. Highlighting <strong>{plantSample}</strong> starting
            from <strong className="text-teal-300">₹{minPlantPrice}/sapling</strong>. Direct gate sales
            available for both residential gardeners and large agroforestry orchards.
          </p>

          <div className="lg:col-span-5 flex flex-wrap gap-3 justify-start lg:justify-end">
            <Link
              href="/horticulture"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Plant Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/horticulture#catalog"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <Sprout className="w-4 h-4 text-teal-300" />
              <span>Browse Saplings</span>
            </Link>
          </div>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        {/* Dynamic Highlight Cards */}
        <div className="relative z-10 flex flex-wrap gap-[1.5vw]">
          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Catalog Selection
            </p>
            <p className="text-sm font-bold text-white mb-0.5">{plants.length}+ Botanical Varieties</p>
            <p className="text-xs text-teal-100">
              {plantCategories.slice(0, 2).join(' & ') || 'Fruit & Medicinal Saplings'}
            </p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Nursery Pricing
            </p>
            <p className="text-sm font-bold text-white mb-0.5">From ₹{minPlantPrice} / Sapling</p>
            <p className="text-xs text-teal-100">Direct gate pricing with zero intermediary markup</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Conditioning
            </p>
            <p className="text-sm font-bold text-white mb-0.5">
              {plants[0]?.heightSize || 'Root-Bag Conditioned'}
            </p>
            <p className="text-xs text-teal-100">High survival rates &amp; rapid root establishment</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Stock Status
            </p>
            <p className="text-sm font-bold text-white mb-0.5">
              {plants.every((p) => p.availability === 'In Stock')
                ? 'Ready in Nursery'
                : 'Direct Gate Sales'}
            </p>
            <p className="text-xs text-teal-100">Grafted mango &amp; certified cashew clones</p>
          </div>
        </div>
      </FlowSection>

      {/* ─── SLIDE 04: RESORT — COMING SOON ───────────────────────────────── */}
      <FlowSection
        aria-label="Upcoming Luxury Resort"
        style={{ backgroundColor: '#18181b', color: '#ffffff' }}
        className="relative"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/85 to-[#18181b]/60" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-xs font-bold uppercase tracking-[0.2em] text-[#f5d061]">
            <Trees className="w-3.5 h-3.5 text-[#f5d061]" />
            <span>04 — Luxury Agro-Eco Sanctuary • Coming Soon</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-amber-300">
            Gobindaprasad, Odapada, Dhenkanal • Target Dec 2026
          </span>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f5d061]">
            Bioclimatic Wilderness Hospitality
          </span>
          <h3 className="text-[clamp(2.4rem,7vw,7.5rem)] font-extrabold leading-[0.88] uppercase tracking-tight text-white drop-shadow-md">
            LUXURY
            <br />
            <span className="text-amber-400">JUNGLE RESORT</span>
            <br />
            COMING SOON
          </h3>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <p className="lg:col-span-7 text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-relaxed text-stone-200">
            Upcoming luxury eco-retreat featuring private bioclimatic villas, organic farm dining,
            and wellness trails amidst 5,000 cashew and mango mother trees at Gobindaprasad, Odapada,
            Dhenkanal — evolving under the {businessName} Agro Eco Tourism Project launching before
            December 2026.
          </p>

          <div className="lg:col-span-5 flex flex-wrap gap-3 justify-start lg:justify-end">
            <Link
              href="/resort"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#c59b27] hover:bg-[#aa821b] text-primary-dark font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Resort Preview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/farm-house/allora-agro-forestry-jungle-resort-gobindaprasad-odapada-dhenkanal"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <ExternalLink className="w-4 h-4 text-[#f5d061]" />
              <span>Explore Allora Forestry</span>
            </Link>
          </div>
        </div>

        <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

        {/* Dynamic Highlight Cards */}
        <div className="relative z-10 flex flex-wrap gap-[1.5vw]">
          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              Mother Tree Bank
            </p>
            <p className="text-sm font-bold text-white mb-0.5">5,000 Mother Trees</p>
            <p className="text-xs text-stone-300">Cashew &amp; Mango genetic biodiversity sanctuary</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              Accommodations
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Canopy Cottages</p>
            <p className="text-xs text-stone-300">Bioclimatic timber architecture blending into forest foliage</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              Corridor Launch
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Before Dec 2026</p>
            <p className="text-xs text-stone-300">State Agro Eco Tourism network priority milestone</p>
          </div>

          <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              Sanctuary Living
            </p>
            <p className="text-sm font-bold text-white mb-0.5">Organic Trails</p>
            <p className="text-xs text-stone-300">Water harvesting lakes, stargazing &amp; wild honey trails</p>
          </div>
        </div>
      </FlowSection>

      {/* ─── SLIDE 05: COMMERCIAL SHOP RENTAL (CONDITIONAL) ───────────────── */}
      {shopActive && (
        <FlowSection
          aria-label="Commercial Shop Arcade Rental"
          style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
          className="relative"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1600&q=80"
              alt="Commercial Shop Arcade"
              className="w-full h-full object-cover opacity-15 filter blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/85 to-[#1e293b]/60" />
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              <Store className="w-3.5 h-3.5 text-sky-300" />
              <span>05 — Commercial Promenade Lease</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200">
              Prime Highway Frontage • High Agro Footfall
            </span>
          </div>

          <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

          <div className="relative z-10 space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-300">
              Retail Promenade Leasing
            </span>
            <h3 className="text-[clamp(2.4rem,7vw,7.5rem)] font-extrabold leading-[0.88] uppercase tracking-tight text-white drop-shadow-md">
              COMMERCIAL
              <br />
              <span className="text-sky-400">SHOP ARCADE</span>
              <br />
              AVAILABLE
            </h3>
          </div>

          <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <p className="lg:col-span-7 text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-relaxed text-slate-200">
              Prime commercial arcade units located along our main entrance promenade at {businessName},
              ideal for agro &amp; artisanal retail, plant boutique displays, and organic farm produce
              outlets with guaranteed visitor footfall.
            </p>

            <div className="lg:col-span-5 flex flex-wrap gap-3 justify-start lg:justify-end">
              <Link
                href="/shop-rental"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>View Commercial Units</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/enquiry?type=shop"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all"
              >
                <Send className="w-4 h-4 text-sky-300" />
                <span>Lease Enquiry</span>
              </Link>
            </div>
          </div>

          <hr className="relative z-10 my-[1.2vw] border-none border-t border-white/20" />

          <div className="relative z-10 flex flex-wrap gap-[1.5vw]">
            <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Prime Location
              </p>
              <p className="text-sm font-bold text-white mb-0.5">Highway Entrance</p>
              <p className="text-xs text-slate-300">Direct visibility along main arrival corridor</p>
            </div>

            <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Audience Reach
              </p>
              <p className="text-sm font-bold text-white mb-0.5">Active Footfall</p>
              <p className="text-xs text-slate-300">Tourists, stay guests, and nursery visitors</p>
            </div>

            <div className="min-w-[150px] flex-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Infrastructure
              </p>
              <p className="text-sm font-bold text-white mb-0.5">Turnkey Units</p>
              <p className="text-xs text-slate-300">Power backup, water supply &amp; secure access</p>
            </div>
          </div>
        </FlowSection>
      )}
    </FlowArt>
  );
}

export default ExperiencesStoryScroll;
