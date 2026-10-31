'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  Utensils,
  Wheat,
  Landmark,
  ArrowRight,
  Search,
  X,
  Trees,
  Fish,
  Calendar,
  Layers,
  Award,
  Home,
  Sprout,
  Palette,
  Users,
  Bird,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { slugify } from '@/lib/utils';

// Verified Top Flagship Hubs requested by Client
const FLAGSHIP_HUBS = [
  {
    name: 'Sandhya Agro Farm House (Sagadipatana, Kisan Nagar, Cuttack)',
    category: 'Flagship Farmhouse & Picnic Spot',
    distance: 'Basecamp Destination (Cuttack)',
    travelTime: '40 mins from Cuttack / 60 mins from BBSR',
    description:
      'Flagship agro retreat in Sagadipatana, Barda, Kisan Nagar. Features a natural freshwater fishing pond, white & red sandalwood, agarwood, mahogany, betelnut cultivation, colour bird & turkey farming, and specialized 50-person day picnic setups with woodfire cooking.',
    cultureHighlight:
      'Living rural Odia farm hospitality, open shaded verandas, traditional folk leisure, and countryside angling.',
    cuisineHighlight:
      'Fresh pond fish curry, clay-pot desi chicken, woodfire Dalma, and fresh farm-harvested betel leaf.',
    farmingMethod:
      'Multi-tier agroforestry with White/Red Sandalwood, Agarwood, Betel Nut palms, aquaculture pond, and free-range turkey/poultry yards.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
    highlightBadge: '50-Person Picnic Ready • Fishing Pond',
    badgeColor: 'bg-emerald-700 text-white',
  },
  {
    name: 'Sangeeta Grafting & Nursery (Juanga, Niali, Cuttack)',
    category: 'Agro Nursery & Plant Sale',
    distance: '28 km from Sandhya Farm House',
    travelTime: '35 mins drive',
    description:
      'Premier vegetative grafting nursery with over 2 Lakh (200,000+) mango and kaju (cashew) plants available for direct sale, live grafting demonstrations, and commercial orchard consultation.',
    cultureHighlight:
      'Generational horticultural craft, farmer knowledge sharing, and rural plant breeding traditions.',
    cuisineHighlight:
      'Sweet tender Niali green coconut water, clay-cup tea, and fresh seasonal mango tastings.',
    farmingMethod:
      'Scientific wedge & epicotyl grafting, shade-tunnel hardening, and disease-resistant organic potting.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Niali+Cuttack+Odisha',
    highlightBadge: '2 Lakh Plants for Sale • Mango & Cashew',
    badgeColor: 'bg-teal-700 text-white',
  },
  {
    name: 'Allora Agro Forestry & Jungle Resort (Gobindaprasad, Odapada, Dhenkanal)',
    category: 'Forestry & Jungle Resort',
    distance: '55 km from Sandhya Farm House',
    travelTime: '1 hr 15 mins highway drive',
    description:
      'Massive biodiversity sanctuary with 5,000 mother plants of Kaju (cashew) and mango, developing into an upcoming luxury eco-jungle resort with forest canopy villas.',
    cultureHighlight:
      'Wild Sal forest lore, Dhenkanal hill ecology, night sky stargazing, and deep-nature forest bathing.',
    cuisineHighlight:
      'Smoked bamboo delicacies, pure wild forest honey, and woodfire chulha cuisine served on sal leaves.',
    farmingMethod:
      '5,000 certified mother plant gene blocks, contour water harvesting lakes, and bio-diverse micro-forestry.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Odapada+Dhenkanal+Odisha',
    highlightBadge: '5,000 Mother Plants • Upcoming Jungle Resort',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    name: 'Willy Nilly Agro Eco Tourism Project (Launching Before Dec 2026)',
    category: 'Dec 2026 Launch (Top Priority)',
    distance: 'Integrated State Circuit',
    travelTime: 'Top Priority Regional Corridor',
    description:
      'Odisha’s flagship integrated agro-eco-tourism corridor connecting Sandhya Farm House, Sangeeta Nursery, and Allora Jungle Resort. Grand official launch scheduled before December 2026 with VIP pre-bookings active now.',
    cultureHighlight:
      'Sustainable agro-tourism masterplan, community empowerment, and authentic Odia rural culture showcase.',
    cuisineHighlight:
      'Farm-to-fork 100% organic regional banquet featuring indigenous grains, fresh harvest, and woodfire flavours.',
    farmingMethod:
      'Integrated agro-forestry, solar micro-irrigation, zero-waste composting, and biological conservation.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Cuttack+Odisha',
    highlightBadge: 'Top Priority • Launching Dec 2026',
    badgeColor: 'bg-rose-700 text-white animate-pulse',
  },
];

const STANDARD_PLACES = [
  {
    name: 'Raghurajpur Heritage Craft & Agro Village',
    category: 'Agro Heritage & Craft',
    distance: '22 km from Farm',
    travelTime: '35 mins drive',
    description:
      'A world-renowned living heritage village surrounded by dense coconut groves, betel-leaf (Paan Baraja) farms, and fruit orchards where rural families preserve ancient Odia arts and agrarian lifestyles.',
    cultureHighlight:
      'Live masterclasses in Pattachitra scroll painting, palm-leaf engraving, Gotipua dance roots, and traditional mud-plastered houses with heritage murals.',
    cuisineHighlight:
      'Warm clay-pot Chhenagaja, sweet coconut water, and traditional woodfire temple delicacies.',
    farmingMethod:
      'Traditional betel-vine cultivation (Paan Baraja) with indigenous bamboo trellis, integrated agro-forestry, and natural canal irrigation.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Raghurajpur+Odisha',
  },
  {
    name: 'Dhauli Shanti Stupa & Daya River Agro Valley',
    category: 'History & River Valley',
    distance: '12 km from Farm',
    travelTime: '20 mins drive',
    description:
      'Majestic white Peace Pagoda perched over the historic Daya River banks, overlooking fertile alluvial paddy plains, bamboo groves, and pastoral Odia villages.',
    cultureHighlight:
      'Ancient Ashokan rock edicts dating back to 261 BC, peaceful Buddhist rock carvings, and serene sunrise vistas over rural countryside.',
    cuisineHighlight:
      'Authentic village Dalma (slow-cooked lentils with raw papaya & roasted cumin), Ghanta Tarkari, and steaming aromatic rice served on Sal leaves.',
    farmingMethod:
      'Alluvial riverbank organic farming, multi-crop paddy rotation, and seasonal yellow mustard fields.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Dhauli+Shanti+Stupa+Odisha',
  },
  {
    name: 'Pipili Artisan Village & Organic Hub',
    category: 'Cultural Village',
    distance: '16 km from Farm',
    travelTime: '25 mins drive',
    description:
      'Renowned global destination for exquisite Odisha applique handcrafts, colourful artisan workshops, and surrounding lush countryside agro-settlements.',
    cultureHighlight:
      'Generations-old needle embroidery, ceremonial canopies (Chandua), festive lampshades, and direct engagement with rural artisan families.',
    cuisineHighlight:
      'Freshly baked caramelized Chhena Poda in sal leaves and clay-cup spiced chai.',
    farmingMethod:
      'Integrated rural backyard horticulture, organic banana plantations, and community seed saving.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Pipili+Odisha',
  },
  {
    name: 'Chilika Lake & Mangalajodi Eco-Tourism Corridor',
    category: 'Lagoon & Eco-Farming',
    distance: '45 km from Farm',
    travelTime: '55 mins drive',
    description:
      "Asia's largest brackish lagoon and UNESCO Ramsar wetland where community-driven conservation, migratory waterbirds, and native coastal agriculture thrive.",
    cultureHighlight:
      'Traditional hand-rowed wooden canoe trails through water lilies, rural bird lore, and vibrant fishing village lifestyles.',
    cuisineHighlight:
      'Coastal Odia freshwater crab curry, clay pot smoked fish, and cooling earthen-pot Pakhala with lemon leaves and fried seasonal greens.',
    farmingMethod:
      'Traditional wetland eco-aquaculture, tidal water harvesting, and indigenous saline-tolerant rice cultivation.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Mangalajodi+Chilika+Odisha',
  },
  {
    name: 'Konark Sun Temple & Coastal Cashew Agro Belt',
    category: 'Heritage & Coastal Belt',
    distance: '38 km from Farm',
    travelTime: '45 mins drive',
    description:
      '13th-century architectural marvel sculpted as a colossal sun chariot, bordered by whispering Casuarina woodlands and coastal cashew agro-farms.',
    cultureHighlight:
      'Exquisite stone-carved chariot wheels, Odissi classical dance roots, and golden sand dunes.',
    cuisineHighlight:
      'Tender sweet green coconuts, Kakara Pitha, Arisa Pitha, and fresh tree-ripened coastal mangoes.',
    farmingMethod:
      'Coastal sand-dune stabilization farming, cashew nut orchards, and rain-fed organic groundnut cultivation.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Konark+Sun+Temple+Odisha',
  },
  {
    name: 'Chandaka-Dampara Agro & Nature Sanctuary',
    category: 'Nature & Herbal Reserve',
    distance: '28 km from Farm',
    travelTime: '40 mins drive',
    description:
      'Protected nature reserve harboring wild elephants, aromatic flora, experimental organic botanical zones, and peaceful panoramic watchtowers.',
    cultureHighlight:
      'Indigenous herbal medicine lore, sustainable wild forest honey harvesting, and tranquil jungle trails.',
    cuisineHighlight:
      'Pure forest honey, roasted sweet tubers, Mandia (ragi) porridge, and herbal detox infusions.',
    farmingMethod:
      'Organic medicinal plant polyculture, bio-composting, and solar-powered micro-irrigation trials.',
    image: '',
    mapUrl: 'https://maps.google.com/?q=Chandaka+Sanctuary+Odisha',
  },
];

function getCategoryIcon(cat) {
  switch (cat) {
    case 'All':
      return <Layers className="w-4 h-4" />;
    case 'Flagship Farmhouse & Picnic Spot':
      return <Home className="w-4 h-4" />;
    case 'Agro Nursery & Plant Sale':
      return <Sprout className="w-4 h-4" />;
    case 'Forestry & Jungle Resort':
      return <Trees className="w-4 h-4" />;
    case 'Dec 2026 Launch (Top Priority)':
      return <Award className="w-4 h-4" />;
    case 'Agro Heritage & Craft':
      return <Palette className="w-4 h-4" />;
    case 'History & River Valley':
      return <Landmark className="w-4 h-4" />;
    case 'Cultural Village':
      return <Users className="w-4 h-4" />;
    case 'Lagoon & Eco-Farming':
      return <Fish className="w-4 h-4" />;
    case 'Eco-Sanctuary & Wildlife':
      return <Bird className="w-4 h-4" />;
    case 'Lake & Rural Farmlands':
      return <Wheat className="w-4 h-4" />;
    default:
      return <Compass className="w-4 h-4" />;
  }
}

export function OdishaTouristPlaces({ places = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filterScrollRef = useRef(null);

  const scrollFilters = (direction) => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      filterScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Merge database places with guaranteed Flagship Hubs at top
  const allPlaces = useMemo(() => {
    const defaults = [...FLAGSHIP_HUBS, ...STANDARD_PLACES];

    if (!places || places.length === 0) {
      return defaults;
    }

    const resultMap = new Map();
    defaults.forEach((d) => {
      resultMap.set(slugify(d.name), { ...d, image: '' });
    });

    places.forEach((p) => {
      const slug = slugify(p.name);
      const existing = resultMap.get(slug);
      const cleanImg =
        p.image &&
        typeof p.image === 'string' &&
        !p.image.includes('images.unsplash.com') &&
        !p.image.includes('/images/destinations/')
          ? p.image.trim()
          : '';

      if (existing) {
        resultMap.set(slug, {
          ...existing,
          ...p,
          image: cleanImg,
        });
      } else {
        resultMap.set(slug, {
          ...p,
          image: cleanImg,
        });
      }
    });

    return Array.from(resultMap.values());
  }, [places]);

  // Unique categories list
  const categories = useMemo(() => {
    return ['All', ...new Set(allPlaces.map((p) => p.category).filter(Boolean))];
  }, [allPlaces]);

  // Destination counts per category
  const categoryCounts = useMemo(() => {
    const counts = { All: allPlaces.length };
    allPlaces.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [allPlaces]);

  // Filtered places matching category and search query
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allPlaces.filter((place) => {
      const matchesCategory =
        selectedCategory === 'All' || place.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const searchableText = [
        place.name,
        place.description,
        place.category,
        place.distance,
        place.farmingMethod,
        place.cultureHighlight,
        place.cuisineHighlight,
        place.highlightBadge,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [allPlaces, selectedCategory, searchQuery]);

  return (
    <section className="space-y-10">
      {/* ─── Top Launch Announcement Banner ─────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 border border-secondary/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span>Top Priority Initiative • Target: Before December 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Willy Nilly Agro Eco Tourism Project: <span className="gold-gradient-text text-glow-gold">The Grand Circuit</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Explore <strong>Sandhya Agro Farm House</strong> (Sagadipatana, Kisan Nagar — Fishing Pond, Sandalwood &amp; 50-Person Picnics), 
              <strong> Sangeeta Grafting &amp; Nursery</strong> (Juanga, Niali — 2 Lakh Grafted Plants), and 
              <strong> Allora Agro Forestry</strong> (Gobindaprasad, Odapada — 5,000 Mother Plants &amp; Upcoming Jungle Resort).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/farm-house/sandhya-agro-farm-house-kisan-nagar-cuttack"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-md hover:bg-primary-hover transition-all"
            >
              <span>Explore Sandhya Farm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#event-enquiry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Book 50-Pax Picnic</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Section Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-glow-gold text-xs font-semibold text-secondary tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-secondary" />
            <span>Farmhouse &amp; Nearest Tourist Destination Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main tracking-tight">
            Explore Farmhouse &amp;{' '}
            <span className="gold-gradient-text text-glow-gold">Nearest Picnic Spots</span>
          </h2>
          <p className="text-sm sm:text-base text-content-muted max-w-3xl">
            Search our flagship farmhouses, high-yield plant nurseries, agroforestry reserves, and historic Odia cultural landmarks. Plan your stay, arrange a 50-person group picnic, and explore Odisha’s agrarian beauty.
          </p>
        </div>

        {/* Basecamp Badge */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right flex-shrink-0">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Agro-Eco Network</span>
          <span className="text-sm font-semibold text-content-main">Stay at Farm • Tour Odisha</span>
        </div>
      </div>

      {/* ─── Real-Time Search Bar ───────────────────────────────── */}
      <div className="relative max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-content-muted absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmhouse (Kisan Nagar), nursery (Niali), forestry (Dhenkanal), fishing, sandalwood, 50-pax picnic..."
            className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-2xl bg-surface-card border border-surface-border text-content-main placeholder:text-content-muted/70 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-content-muted hover:text-content-main hover:bg-surface-muted transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-content-muted mt-2 ml-1">
            Found <strong>{filteredPlaces.length}</strong> matching destination{filteredPlaces.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* ─── Elevated Interactive Category Filter Bar ──────────────── */}
      {/* ─── Elevated Interactive Category Filter Deck ──────────────── */}
      <div className="bg-surface-card rounded-3xl border border-surface-border p-4 sm:p-6 shadow-sm space-y-4">
        {/* Top Header Row of Filter Deck */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Filter className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-content-main uppercase tracking-wider">
                Filter by Experience Theme
              </h4>
              <p className="text-[11px] text-content-muted">
                Showing <strong>{filteredPlaces.length}</strong> of <strong>{allPlaces.length}</strong> destinations
              </p>
            </div>
          </div>

          {/* Quick Active Status & Reset Button */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary-hover text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Visual Wrapping Category Badges (No horizontal scrollbar cutting off categories) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            const isPriority = cat === 'Dec 2026 Launch (Top Priority)';

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`group inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0E3D2B] via-[#135039] to-[#0A2E20] text-white shadow-md ring-2 ring-[#C59B27] -translate-y-0.5'
                    : isPriority
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 hover:from-amber-100 hover:to-amber-200/80 border border-amber-300 text-amber-950 shadow-xs hover:-translate-y-0.5'
                    : 'bg-[#fbfdfa] hover:bg-emerald-50/80 border border-emerald-900/15 text-[#1E3B2E] hover:text-[#0E3D2B] shadow-xs hover:border-[#C59B27]/40 hover:-translate-y-0.5'
                }`}
              >
                {/* Category Icon in pill */}
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/15 text-[#F5D061]'
                      : isPriority
                      ? 'bg-amber-200/70 text-amber-800'
                      : 'bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-200/80'
                  }`}
                >
                  {getCategoryIcon(cat)}
                </span>

                {/* Category Name */}
                <span className="tracking-tight">{cat}</span>

                {/* Counter Pill */}
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                    isSelected
                      ? 'bg-[#C59B27] text-[#0E3D2B]'
                      : isPriority
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Destinations Grid ──────────────────────────────────── */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-surface-border p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface-muted flex items-center justify-center text-content-muted">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-content-main">No destinations matched your search</h4>
          <p className="text-sm text-content-muted max-w-md mx-auto">
            Try searching for &ldquo;Kisan Nagar&rdquo;, &ldquo;Sandalwood&rdquo;, &ldquo;Niali&rdquo;, &ldquo;Picnic&rdquo;, or reset your filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place, idx) => {
            const slug = slugify(place.name);
            const isFlagship =
              place.highlightBadge ||
              place.category?.includes('Flagship') ||
              place.category?.includes('Dec 2026');

            // Parse title and location for clean hierarchy
            const nameMatch = place.name.match(/^(.*?)\s*\((.*?)\)$/);
            const titleMain = nameMatch ? nameMatch[1] : place.name;
            const subtitleLocation = nameMatch ? nameMatch[2] : null;

            return (
              <div
                key={idx}
                className={`group flex flex-col bg-surface-card rounded-2xl border overflow-hidden card-rich-hover shadow-card transition-all duration-300 ${
                  isFlagship
                    ? 'border-secondary/40 ring-1 ring-secondary/20 glow-box-gold/40'
                    : 'border-surface-border hover:border-secondary/30'
                }`}
              >
                {/* Visual Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted rounded-t-2xl">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0e3d2b] via-[#09261a] to-[#04120c] text-center">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mb-2 border border-secondary/30">
                        {getCategoryIcon(place.category)}
                      </div>
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {place.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none" />

                  {/* Top Badges (Category & Distance) */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm truncate max-w-[65%]">
                      {place.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm flex-shrink-0">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{place.distance}</span>
                    </span>
                  </div>

                  {/* Client Highlight Badge (e.g. 50-Pax Picnic, 2 Lakh Plants - dedicated full width placement) */}
                  {place.highlightBadge && (
                    <div className="absolute bottom-3 inset-x-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/25 ${
                          place.badgeColor || 'bg-secondary text-primary-dark'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{place.highlightBadge}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Travel Time & Connectivity Meta Bar (Separated from image badges for zero overlap) */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-600/20">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{place.travelTime}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-secondary-dark bg-secondary/15 px-2.5 py-1 rounded-full border border-secondary/25">
                        Odisha Agro Circuit
                      </span>
                    </div>

                    {/* Title with Location Subtitle */}
                    <div className="space-y-1">
                      <Link href={`/farm-house/${slug}`}>
                        <h3 className="text-lg sm:text-xl font-extrabold text-content-main group-hover:text-primary transition-colors leading-snug hover:underline cursor-pointer">
                          {titleMain}
                        </h3>
                      </Link>
                      {subtitleLocation && (
                        <p className="text-xs text-secondary-dark font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{subtitleLocation}</span>
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-content-muted leading-relaxed line-clamp-3">
                      {place.description}
                    </p>
                  </div>

                  {/* Key Experience Highlights */}
                  <div className="space-y-2 pt-3 border-t border-surface-border/70 text-xs">
                    {/* Culture & Rural Living */}
                    {place.cultureHighlight && (
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                        <Landmark className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-900">Living &amp; Culture: </span>
                          <span className="text-content-muted leading-relaxed">{place.cultureHighlight}</span>
                        </div>
                      </div>
                    )}

                    {/* Agro Farming Method */}
                    {place.farmingMethod && (
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        <Wheat className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-900">Agro Method: </span>
                          <span className="text-content-muted leading-relaxed">{place.farmingMethod}</span>
                        </div>
                      </div>
                    )}

                    {/* Traditional Cuisine */}
                    {place.cuisineHighlight && (
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-500/5 border border-stone-500/15">
                        <Utensils className="w-4 h-4 text-secondary-dark flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-content-main">Heritage Cuisine: </span>
                          <span className="text-content-muted leading-relaxed">{place.cuisineHighlight}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
                    <Link
                      href={`/farm-house/${slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Read Guide &amp; Blog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <a
                        href="#event-enquiry"
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-secondary-dark bg-secondary/15 hover:bg-secondary hover:text-white border border-secondary/30 transition-all"
                      >
                        Book Stay / Picnic
                      </a>
                      {place.mapUrl && (
                        <a
                          href={place.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-content-muted hover:text-primary hover:bg-surface-muted border border-surface-border transition-colors"
                          title="Open in Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OdishaTouristPlaces;
