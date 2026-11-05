'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Compass,
  Waves,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Car,
  Bird,
  Shield,
  CheckCircle2,
  X,
  Navigation,
  Eye,
  Camera,
  Trees,
  Fish,
  Palette,
  Phone,
  Landmark,
  Ship,
  Sun,
  Sunset,
  Flame,
  Star,
  ExternalLink,
} from 'lucide-react';

// Data for the 8 featured tourism highlights
const TOURISM_SPOTS = [
  {
    id: 'pentha-beach',
    title: 'Pentha Sea Beach',
    category: 'Beach & Coast',
    badge: 'Virgin Golden Shore',
    badgeColor: 'bg-amber-500 text-stone-950',
    tagline: 'Untouched coastal paradise with golden sands and casuarina breezes.',
    description:
      'Stretching along the Bay of Bengal near Rajnagar, Pentha Sea Beach is an uncrowded coastal haven renowned for its tranquil golden sands, soothing surf, and dense casuarina plantations. Protected by a scenic sea embankment, it provides sweeping sunrise vistas, peaceful beach walks, and refreshing ocean breezes far away from commercial tourist crowds.',
    highlights: [
      'Pristine golden sands & shallow ocean surf',
      'Dense casuarina & pine woodland trail',
      'Spectacular Bay of Bengal sunrise viewpoints',
      'Clean, eco-protected coastline for beach picnics',
    ],
    bestTime: 'October to March (Early morning sunrise & late afternoon)',
    entryPoint: 'Via Rajnagar (approx. 18 km from Rajnagar town)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    icon: Waves,
  },
  {
    id: 'bhitarkanika-mangroves',
    title: 'Bhitarkanika Mangrove National Park',
    category: 'Wildlife & Estuary',
    badge: 'Ramsar Wetland Site',
    badgeColor: 'bg-emerald-700 text-white',
    tagline: 'India’s second largest mangrove ecosystem & biological treasure.',
    description:
      'Encompassing 672 square kilometers of tidal rivers, creeks, and mudflats, Bhitarkanika is a globally recognized Ramsar Wetland site. With 62 distinct mangrove species, it forms an emerald labyrinth where the Brahmani, Baitarani, and Dhamra rivers merge into the Bay of Bengal, creating one of the richest biodiversity hotspots in Asia.',
    highlights: [
      'Second largest mangrove forest in India after the Sundarbans',
      'Dense tidal estuaries with labyrinthine waterways',
      'Historic hunting ground turned thriving wildlife sanctuary',
      'Ancient stone temples hidden within forest groves',
    ],
    bestTime: 'October to March (Peak migratory bird & reptile season)',
    entryPoint: 'Khola and Gupti Entry Gates (Forest permits issued on spot)',
    image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80',
    icon: Trees,
  },
  {
    id: 'saltwater-crocodiles',
    title: 'Giant Saltwater Crocodiles',
    category: 'Wildlife & Estuary',
    badge: 'Largest Crocs on Earth',
    badgeColor: 'bg-teal-700 text-white',
    tagline: 'Home to world-record estuarine crocodiles up to 23 feet long.',
    description:
      'Bhitarkanika is world-famous as the ultimate sanctuary for the endangered Estuarine Saltwater Crocodile (Crocodylus porosus). Hosting over 1,800 crocodiles, including rare white / albino specimens, visitors frequently witness these prehistoric giants basking serenely on the sunlit mudbanks during low tides.',
    highlights: [
      'Guinness record holder for 23-foot saltwater crocodiles',
      'Dangamal Crocodile Breeding & Research Center',
      'Rare white / albino crocodile viewing enclosures',
      'Safe, guided boat observation with forest naturalists',
    ],
    bestTime: 'November to February (Best visible basking in winter sun)',
    entryPoint: 'Dangamal Interpretation Center & Khola Creek',
    image: 'https://images.unsplash.com/photo-1551871812-10ecc21ffa2f?auto=format&fit=crop&w=1200&q=80',
    icon: Shield,
  },
  {
    id: 'olive-ridley-turtles',
    title: 'Olive Ridley Sea Turtles & Marine Wildlife',
    category: 'Wildlife & Estuary',
    badge: 'World’s Largest Rookery',
    badgeColor: 'bg-sky-700 text-white',
    tagline: 'Gahirmatha Marine Sanctuary mass nesting phenomenon (Arribada).',
    description:
      'Adjacent to Bhitarkanika lies Gahirmatha, the world’s largest known nesting beach for endangered Olive Ridley Sea Turtles. Every winter, hundreds of thousands of marine turtles travel thousands of miles across the Indian Ocean to mate and lay eggs along this pristine coastline, alongside pods of playful coastal dolphins.',
    highlights: [
      'Mass nesting (Arribada) of hundreds of thousands of turtles',
      'Gahirmatha Marine Wildlife Sanctuary coast',
      'Playful Irrawaddy & Indo-Pacific humpback dolphins',
      'Horseshoe crabs and unique marine biodiversity',
    ],
    bestTime: 'December to March (Peak nesting & nocturnal hatching periods)',
    entryPoint: 'Gahirmatha Coast & Habalikhati Beach (regulated access)',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    icon: Fish,
  },
  {
    id: 'forest-animals-birds',
    title: 'Forest Animals & Migratory Birds',
    category: 'Wildlife & Estuary',
    badge: '215+ Avian Species',
    badgeColor: 'bg-emerald-800 text-white',
    tagline: 'Thriving herds of spotted deer, wild boars & vibrant kingfishers.',
    description:
      'Beyond its waterways, Bhitarkanika’s lush woodlands shelter large herds of spotted deer (Chital), wild boars, jungle cats, and water monitor lizards. For birdwatchers, the park is an avian paradise sheltering 8 species of dazzling Kingfishers, White-bellied Sea Eagles, Asian Open-billed Storks, and thousands of winter trans-Himalayan migrants.',
    highlights: [
      '8 species of Kingfishers including Pied, Blue-eared & Brown-winged',
      'Large herds of spotted deer grazing freely near Dangamal',
      'Asian Openbill Stork & Heronry breeding colonies at Bagagahana',
      'White-bellied Sea Eagles soaring above mangrove tree lines',
    ],
    bestTime: 'August to November (Local heronry) & Dec–Feb (Winter migrants)',
    entryPoint: 'Bagagahana Bird Sanctuary & Dangamal Watchtower',
    image: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=1200&q=80',
    icon: Bird,
  },
  {
    id: 'mangrove-boat-safari',
    title: 'Mangrove Boat Safari',
    category: 'Safari & Adventure',
    badge: 'Emerald Creek Cruise',
    badgeColor: 'bg-teal-800 text-white',
    tagline: 'Glide along silent tidal rivers beneath towering canopy tunnels.',
    description:
      'The quintessential Bhitarkanika experience: an exhilarating, safe motorboat safari gliding through silent tidal waterways. Accompanied by government-licensed naturalists, boats steer through emerald channels where dense mangrove canopies interlock above, revealing sun-basking crocodiles, diving kingfishers, and deer peering through the pneumatophore roots.',
    highlights: [
      'Scenic cruises departing from Khola and Gupti forest jetties',
      'Licensed forest guides providing live eco-interpretation',
      'Panoramic 360-degree views from open-top safari boats',
      'Canal routes covering Dangamal, Bird Island & ancient ruins',
    ],
    bestTime: 'Morning (7:30 AM – 11:00 AM) & Afternoon (2:30 PM – 5:00 PM)',
    entryPoint: 'Khola Jetty & Gupti Jetty',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    icon: Ship,
  },
  {
    id: 'batighar-lighthouse',
    title: 'Batighar Lighthouse (False Point)',
    category: 'Heritage & Flora',
    badge: '1837 British Monument',
    badgeColor: 'bg-amber-700 text-white',
    tagline: 'Historic coastal beacon standing guard over the Bay of Bengal.',
    description:
      'Constructed in 1837 during British maritime expansion, Batighar (False Point Lighthouse) is one of the earliest modern lighthouses built on the eastern seaboard of India. Accessible via a scenic tidal boat voyage through the Mahanadi river mouth, this grand masonry tower offers breathtaking panoramic vistas of the surrounding coastal archipelago.',
    highlights: [
      '19th-century British colonial masonry architecture (est. 1837)',
      'Historic beacon warning ships away from treacherous False Point reefs',
      'Picturesque boat transit through scenic mangrove river deltas',
      'Stunning maritime photography and coastal sunset lookouts',
    ],
    bestTime: 'November to February (Calm tidal waters for delta cruising)',
    entryPoint: 'Boat charter from Jambu or Ramnagar jetty',
    image: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=1200&q=80',
    icon: Landmark,
  },
  {
    id: 'horticulture-art-gallery',
    title: 'Horticulture Garden & Art Gallery',
    category: 'Heritage & Flora',
    badge: 'Botanical & Folk Art',
    badgeColor: 'bg-emerald-600 text-white',
    tagline: 'Curated medicinal agro-gardens and regional folk artisan crafts.',
    description:
      'A serene cultural sanctuary celebrating coastal Odisha’s rich botanical heritage and indigenous artistic traditions. Wander through landscaped demonstration gardens of tropical fruits, indigenous medicinal herbs, and rare coastal flora, followed by an art gallery exhibiting traditional Odia terracotta, Pattachitra scrolls, and sustainable mangrove wood crafts.',
    highlights: [
      'Exotic & medicinal plant demonstration nursery with 150+ species',
      'Organic farming and eco-grafting live workshops',
      'Gallery of regional Pattachitra, palm-leaf carvings & terracotta art',
      'Souvenir collection of herbal products and pure forest honey',
    ],
    bestTime: 'Open year-round (8:00 AM to 6:00 PM daily)',
    entryPoint: 'On-site Willy Nilly Agro Campus & Nursery Pavilion',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    icon: Palette,
  },
];

// Transit distances
const DISTANCES = [
  {
    city: 'Kendrapara District HQ',
    distance: '45 km',
    duration: 'approx. 1 hour drive',
    route: 'via SH-9A & Pattamundai Highway',
    tag: 'Nearest Urban Gateway',
    color: 'from-emerald-700 to-teal-800',
  },
  {
    city: 'Cuttack Heritage City',
    distance: '105 km',
    duration: 'approx. 2.5 hours drive',
    route: 'via Cuttack-Chandabali State Corridor',
    tag: 'Direct Connecting Hub',
    color: 'from-teal-800 to-sky-900',
  },
  {
    city: 'Bhubaneswar Capital (Airport)',
    distance: '125 km',
    duration: 'approx. 3 hours drive',
    route: 'via NH-16 & SH-9A Highway',
    tag: 'Biju Patnaik Airport (BBI)',
    color: 'from-sky-900 to-indigo-950',
  },
];

const CATEGORIES = [
  'All Highlights',
  'Beach & Coast',
  'Wildlife & Estuary',
  'Safari & Adventure',
  'Heritage & Flora',
];

export function PenthaBhitarkanikaTourism() {
  const [activeCategory, setActiveCategory] = useState('All Highlights');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open and handle Escape key
  useEffect(() => {
    if (selectedSpot) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedSpot(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedSpot]);

  const filteredSpots =
    activeCategory === 'All Highlights'
      ? TOURISM_SPOTS
      : TOURISM_SPOTS.filter((s) => s.category === activeCategory);

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[#FBFBFA] via-[#F4F7F4] to-[#EBF2EE] text-stone-900 overflow-hidden">
      {/* Subtle decorative background watermarks */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ─── 1. Section Header ────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#0E3D2B] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Compass className="w-4 h-4 text-emerald-700 animate-spin-slow" />
            <span>Coastal Odisha Tourism Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#08261A] font-serif leading-[1.15]">
            Explore Pentha &amp; Bhitarkanika
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 font-sans text-2xl sm:text-3xl lg:text-4xl mt-1 font-bold">
              Nature, Beach &amp; Wildlife
            </span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            From the tranquil golden tides of Pentha Sea Beach to the crocodile-filled mangrove estuaries of Bhitarkanika National Park, discover an unforgettable coastal wilderness within easy journey from our agro-tourism sanctuary.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0E3D2B] text-white shadow-md scale-105'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-500 hover:text-emerald-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 2. 8 Featured Attraction Cards Grid ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSpots.map((spot) => {
            const IconComponent = spot.icon;
            return (
              <div
                key={spot.id}
                className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${spot.badgeColor}`}>
                      {spot.badge}
                    </span>
                  </div>

                  {/* Category icon bottom right */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Title overlay on bottom */}
                  <div className="absolute bottom-3 left-3 right-12">
                    <h3 className="text-base font-bold text-white leading-tight drop-shadow-md">
                      {spot.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {spot.tagline}
                  </p>

                  {/* Highlights Tags */}
                  <div className="space-y-1.5 pt-1">
                    {spot.highlights.slice(0, 2).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSpot(spot)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-200/80 hover:border-emerald-300 active:scale-98"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Explore More</span>
                    </button>

                    <Link
                      href="/contact"
                      className="py-2.5 px-3.5 rounded-xl bg-[#0E3D2B] hover:bg-[#16563D] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all hover:scale-102 active:scale-98"
                      title="Inquire or Book Tour"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 3. Detailed Modal for Selected Attraction (Ultra Responsive Portal) ─── */}
        {mounted && selectedSpot && typeof document !== 'undefined'
          ? createPortal(
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
                onClick={() => setSelectedSpot(null)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tourism-modal-title"
              >
                <div
                  className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 max-h-[90vh] sm:max-h-[86vh] flex flex-col my-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Banner */}
                  <div className="relative h-36 sm:h-52 md:h-64 w-full bg-stone-900 flex-shrink-0 overflow-hidden">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Floating High-Contrast Touch-Friendly Close Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedSpot(null)}
                      className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg border border-white/25 active:scale-95"
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Badge & Title */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-4 sm:left-6 sm:right-6 text-white space-y-1 sm:space-y-1.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${selectedSpot.badgeColor}`}>
                        {selectedSpot.badge}
                      </span>
                      <h3
                        id="tourism-modal-title"
                        className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md leading-tight text-white"
                      >
                        {selectedSpot.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">Coastal Kendrapara / Bhitarkanika Region, Odisha</span>
                      </p>
                    </div>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="p-3.5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 sm:space-y-5 text-stone-800 text-xs sm:text-sm flex-1">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                        About This Experience
                      </h4>
                      <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
                        {selectedSpot.description}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                        Key Highlights &amp; Natural Wonders
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedSpot.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 sm:p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-stone-800 leading-snug">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-stone-200">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span>Best Time to Visit</span>
                        </div>
                        <p className="text-xs text-emerald-950 font-medium">{selectedSpot.bestTime}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <Navigation className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                          <span>Access &amp; Entry Gates</span>
                        </div>
                        <p className="text-xs text-amber-950 font-medium">{selectedSpot.entryPoint}</p>
                      </div>
                    </div>

                    {/* Footer Modal Action */}
                    <div className="pt-3 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                      <span className="text-[11px] text-stone-500 text-center sm:text-left">
                        Custom itinerary &amp; transport can be arranged on request.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSpot(null)}
                          className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer text-center transition-colors"
                        >
                          Close
                        </button>
                        <Link
                          href="/contact"
                          className="flex-1 sm:flex-none px-5 py-2 sm:py-2.5 rounded-xl bg-[#0E3D2B] text-white text-xs font-bold hover:bg-[#16563D] flex items-center justify-center gap-1.5 shadow-md text-center transition-colors"
                        >
                          <span>Inquire Tour Booking</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}

        {/* ─── 4. Nearby Locations & Distance Matrix ────────────────────── */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Transit &amp; Highway Connectivity
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              Nearby Hubs &amp; Direct Travel Distances
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Easily accessible via smooth state highways and coastal corridors. Private chauffeur and tempo traveler transfers can be arranged on request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DISTANCES.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative side accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.tag}
                    </span>
                    <Car className="w-4 h-4 text-emerald-700" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-stone-900">{item.city}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">{item.route}</span>
                  <span className="text-2xl font-black text-emerald-900 tracking-tight">
                    {item.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 5. New Year Package Celebration Spotlight (31 Dec 2026 – 2 Jan 2027) ─── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#061C14] via-[#092B1E] to-[#0D3827] text-white shadow-2xl border border-emerald-700/40">
          
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=80"
              alt="Coastal sunset bonfire"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-8">
            
            {/* Package Badge & Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-emerald-800/60 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exclusive Festival Expedition</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-serif text-[#F5D061]">
                  New Year Coastal &amp; Wildlife Package
                </h3>

                <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
                  Celebrate the dawn of 2027 amidst virgin beaches, starry skies, and thrilling mangrove wildlife expeditions. An intimate, eco-luxury celebration curated for nature lovers and families.
                </p>
              </div>

              {/* Date & Duration Badge */}
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center min-w-[220px]">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Confirmed Dates</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-white">
                  31 Dec 2026 – 2 Jan 2027
                </div>
                <div className="text-[11px] text-emerald-200 font-medium mt-1">
                  3 Days &bull; 2 Nights All-Inclusive
                </div>
              </div>
            </div>

            {/* Daily Itinerary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Day 1 */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    Day 1 &bull; 31 Dec 2026
                  </span>
                  <Sunset className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Check-in &amp; Beach Bonfire Gala
                </h4>
                <ul className="text-xs text-stone-300 space-y-1.5">
                  <li>&bull; Traditional welcome with tender green coconut water</li>
                  <li>&bull; Sunset excursion to secluded Pentha Sea Beach</li>
                  <li>&bull; Night beach bonfire, acoustic folk songs &amp; stargazing</li>
                  <li>&bull; Midnight countdown gala dinner with clay-pot cuisine</li>
                </ul>
              </div>

              {/* Day 2 */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Day 2 &bull; 1 Jan 2027
                  </span>
                  <Ship className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Bhitarkanika Mangrove Safari
                </h4>
                <ul className="text-xs text-stone-300 space-y-1.5">
                  <li>&bull; Sunrise birdwatching cruise inside Ramsar creeks</li>
                  <li>&bull; Spotting giant saltwater crocodiles &amp; deer herds</li>
                  <li>&bull; Excursion to historic 1837 Batighar Lighthouse</li>
                  <li>&bull; Evening tea &amp; tour of Horticulture Art Pavilion</li>
                </ul>
              </div>

              {/* Day 3 */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                    Day 3 &bull; 2 Jan 2027
                  </span>
                  <Sun className="w-4 h-4 text-teal-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Orchard Breakfast &amp; Farewell
                </h4>
                <ul className="text-xs text-stone-300 space-y-1.5">
                  <li>&bull; Morning forest meditation &amp; casuarina walk</li>
                  <li>&bull; Farm-fresh organic breakfast featuring desi delicacies</li>
                  <li>&bull; Souvenir tasting of pure wild forest honey</li>
                  <li>&bull; Leisurely farewell check-out &amp; onward transfer</li>
                </ul>
              </div>

            </div>

            {/* Inclusions Strip & Booking CTAs */}
            <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-emerald-800/60">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  All Meals &amp; Barbecue Included
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Forest Safari Permits &amp; Boat Passes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Limited to 15 Luxury Stays
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/guest-house"
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reserve New Year Package</span>
                </Link>

                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Inquire with Concierge</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default PenthaBhitarkanikaTourism;
