'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  BedDouble,
  Trees,
  Compass,
  Flower2,
  Store,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Sparkles,
  Maximize2,
  X,
  ChevronRight,
  Users,
  Building2,
  Leaf,
  Send,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getPublicSettings } from '@/api/settings.api';
import { getPublicRooms } from '@/api/room.api';
import { getPublicPlants } from '@/api/horticulture.api';
import { getFarmHouseContent } from '@/api/farm-house.api';
import { getPublicGallery } from '@/api/gallery.api';
import { ExperiencesStoryScroll } from '@/components/home/ExperiencesStoryScroll';

// ==========================================
// STATIC VERIFIED DEFAULT DATA (Fail-safe)
// ==========================================
const DEFAULT_SETTINGS = {
  businessName: 'Willy Nilly',
  tagline: 'Experience Nature, Hospitality & Horticulture',
  aboutStory:
    'Nestled amidst lush greenery and fertile soils, Willy Nilly is a premier agro-tourism sanctuary and horticulture retreat dedicated to organic living, tranquil guest hospitality, and celebration spaces in natural countryside surroundings.',
  phonePrimary: '+91 98765 43210',
  emailPrimary: 'info@willynilly.in',
  address: 'Willy Nilly Agro Campus, Green Valley Road, State Highway, India',
  businessHours: 'Guest House: 24/7 Check-in | Horticulture Nursery: 8:00 AM – 6:00 PM',
  locationMapUrl: 'https://maps.google.com/?q=Willy+Nilly+Agro+Campus',
  shopRentalActive: false,
};

const DEFAULT_ROOMS = [
  {
    _id: 'room-1',
    name: 'Deluxe Agro Suite (Room 101)',
    roomType: 'Deluxe Suite',
    isAc: true,
    pricePerNight: 2800,
    priceDisplay: true,
    capacityAdults: 2,
    capacityChildren: 1,
    bedType: 'King Teak Bed',
    description:
      'Overlooking organic fruit orchards, this spacious air-conditioned suite features polished timber interiors, private balcony, and modern attached bathroom.',
    features: ['Orchard Balcony', 'Attached Bath', 'Power Backup', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    _id: 'room-2',
    name: 'Green Canopy Double (Room 102)',
    roomType: 'Double Room',
    isAc: true,
    pricePerNight: 2200,
    priceDisplay: true,
    capacityAdults: 2,
    capacityChildren: 0,
    bedType: 'Queen Bed',
    description:
      'Serene double room offering cross-ventilation, scenic canopy views, and modern comforts nestled in calm agro surroundings.',
    features: ['Garden View', 'Attached Bath', 'Quiet Ambience', 'Free Wi-Fi'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    _id: 'room-3',
    name: 'Countryside Family Cottage (Room 103)',
    roomType: 'Family Cottage',
    isAc: false,
    pricePerNight: 3500,
    priceDisplay: true,
    capacityAdults: 4,
    capacityChildren: 2,
    bedType: 'Two Queen Beds',
    description:
      'Spacious family retreat engineered with natural cooling, expansive lawn frontage, and a private verandah for family moments.',
    features: ['Private Verandah', 'Spacious Living Area', 'Lawn View', 'Eco Ventilation'],
    images: [
      'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1000&q=80',
    ],
  },
];

const DEFAULT_FARM_HOUSE = {
  title: 'Sandhya Agro Farm House & Willy Nilly Eco Retreat',
  subtitle: 'Sagadipatana, Kisan Nagar, Cuttack — Fishing Pond, Sandalwood & 50-Person Picnic Base',
  description:
    'Flagship agro retreat in Sagadipatana, Kisan Nagar, Cuttack featuring a freshwater fishing pond, White & Red Sandalwood, Agarwood, Mahogany, Betel Nut groves, Colour Bird & Turkey farming, and curated 50-person day picnic setups with traditional woodfire dining.',
  image:
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=85',
  facilities: [
    'Freshwater Angling & Aquaculture Fishing Pond',
    'White & Red Sandalwood, Agarwood & Mahogany Groves',
    'Colour Bird Aviary & Free-Range Turkey Farming Yard',
    'Private Day-Picnic Pavilions (Arranged for Up to 50 People)',
    'Traditional Woodfire Chulha & Earthen Pot Cooking Yards',
    'Covered Dining Verandas & Modern Sanitized Restrooms',
  ],
  suitableEvents: [
    '50-Person Family & Corporate Day Picnics',
    'Freshwater Pond Angling & Aquaculture Outings',
    'Agroforestry & Sandalwood Botanical Tours',
    'Destination Weddings & Cultural Celebrations',
  ],
};

const DEFAULT_PLANTS = [
  {
    _id: 'plant-1',
    name: 'Alphonso Mango Sapling (Grafted)',
    category: 'Fruit Plants',
    scientificName: 'Mangifera indica',
    description:
      'Certified premium grafted Alphonso mango sapling yielding exceptionally sweet, aromatic fruit in 3-4 years.',
    price: 350,
    priceBasis: 'per sapling',
    availability: 'In Stock',
    heightSize: '2.5 - 3 Ft Root Bag',
    image:
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'plant-2',
    name: 'Hybrid Guava (Taiwan Pink)',
    category: 'Fruit Plants',
    scientificName: 'Psidium guajava',
    description:
      'Fast-fruiting Taiwan Pink guava variety with crisp pink flesh, low seed count, and high natural sweetness.',
    price: 220,
    priceBasis: 'per sapling',
    availability: 'In Stock',
    heightSize: '2 Ft Nursery Bag',
    image:
      'https://images.unsplash.com/photo-1536511135899-7f37f3747656?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'plant-3',
    name: 'Holy Basil (Krishna Tulsi)',
    category: 'Medicinal Plants',
    scientificName: 'Ocimum sanctum',
    description:
      'Therapeutic dark purple Krishna Tulsi with high natural essential oil content and respiratory wellness properties.',
    price: 80,
    priceBasis: 'per pot',
    availability: 'In Stock',
    heightSize: '1 Ft Clay Pot',
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'plant-4',
    name: 'Red Sandalwood Sapling',
    category: 'Agro Forestry',
    scientificName: 'Pterocarpus santalinus',
    description:
      'Hardy timber sapling suitable for long-term agroforestry investment and farm boundary plantation.',
    price: 180,
    priceBasis: 'per sapling',
    availability: 'In Stock',
    heightSize: '1.5 Ft Polybag',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
];

const DEFAULT_GALLERY = [
  {
    _id: 'gal-1',
    title: 'Morning Sun over Orchard Lawns',
    album: 'Property',
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden morning light filtering through the organic orchards across the campus.',
  },
  {
    _id: 'gal-2',
    title: 'Deluxe Guest House Verandah',
    album: 'Guest House',
    imageUrl:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    caption: 'Private timber verandah overlooking landscaped flower beds.',
  },
  {
    _id: 'gal-3',
    title: 'Open Farm House Celebration Setup',
    album: 'Events',
    imageUrl:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Illuminated fairy light setup across the 8-acre lawn for a destination reception.',
  },
  {
    _id: 'gal-4',
    title: 'Nursery Greenhouse & Fruit Saplings',
    album: 'Horticulture',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    caption: 'Healthy grafted saplings and ornamental varieties inside our controlled nursery.',
  },
  {
    _id: 'gal-5',
    title: 'Evening Canopy Banquet Setup',
    album: 'Celebrations',
    imageUrl:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Evening dining under the stars surrounded by tranquil countryside breeze.',
  },
  {
    _id: 'gal-6',
    title: 'Fresh Organic Harvest at Sunrise',
    album: 'Property',
    imageUrl:
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh farm fruits picked right from our agro groves.',
  },
];

export default function HomePage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [featuredRooms, setFeaturedRooms] = useState(DEFAULT_ROOMS);
  const [farmHouse, setFarmHouse] = useState(DEFAULT_FARM_HOUSE);
  const [plants, setPlants] = useState(DEFAULT_PLANTS);
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);


  // Background sync with API
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getPublicSettings().catch(() => null),
      getPublicRooms().catch(() => null),
      getFarmHouseContent().catch(() => null),
      getPublicPlants().catch(() => null),
      getPublicGallery().catch(() => null),
    ]).then(([sData, rData, fData, pData, gData]) => {
      if (!isMounted) return;
      if (sData) setSettings((prev) => ({ ...prev, ...sData }));
      if (Array.isArray(rData) && rData.length > 0) {
        setFeaturedRooms(rData.filter((r) => r.isAvailable !== false).slice(0, 3));
      }
      if (fData && fData.title) {
        setFarmHouse((prev) => ({
          ...prev,
          title: fData.title || prev.title,
          description: fData.description || prev.description,
          facilities: Array.isArray(fData.facilities) && fData.facilities.length > 0 ? fData.facilities : prev.facilities,
          heroImage: fData.heroImage || (fData.images && fData.images[0]) || '',
          image: fData.heroImage || (fData.images && fData.images[0]) || prev.image,
        }));
      }
      if (Array.isArray(pData) && pData.length > 0) {
        setPlants(pData.slice(0, 4));
      }
      if (Array.isArray(gData) && gData.length > 0) {
        setGalleryImages(gData.slice(0, 6));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const businessName = settings?.businessName || 'Willy Nilly';
  const shopActive = Boolean(settings?.shopRentalActive);

  return (
    <div className="relative overflow-hidden bg-bg text-content-main selection:bg-primary-light selection:text-primary-dark">

      {/* ==================================================================== */}
      {/* 01. HERO / MAIN BANNER                                               */}
      {/* ==================================================================== */}
      <section className="relative min-h-[90vh] flex items-start justify-center overflow-hidden">
        {/* Background Photograph with subtle parallax scale */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85"
            alt="Willy Nilly Agro Landscape"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for exceptional text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/95 via-bg-dark/65 to-black/40" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 text-center text-white space-y-5">
          {/* Official Emblem Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md p-2 border-2 border-secondary/40 shadow-elevation flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Willy Nilly Official Emblem"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wide text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-secondary-light" />
              <span>Official Agro-Tourism &amp; Horticulture Sanctuary</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-md"
          >
            , <br className="hidden sm:block" />
            <span className="text-secondary-light">Hospitality</span> &amp; Horticulture
          </motion.h1>

          {/* Short Introduction */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto text-base sm:text-xl text-white/90 leading-relaxed font-normal"
          >
            Welcome to <strong className="font-semibold text-white">{businessName}</strong>. Unwind in serene Guest House accommodations, celebrate milestones across scenic Farm House grounds, explore indigenous botanical nurseries, and discover mindful rural living.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <a
              href="#experiences"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-theme bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Our Experiences</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-theme bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white hover:text-content-main transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Enquire Now</span>
            </Link>
          </motion.div>

          {/* Value Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-10 text-left border-t border-white/15"
          >
            <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-theme border border-white/15">
              <p className="text-xl sm:text-2xl font-bold text-white">8+ Acres</p>
              <p className="text-xs text-white/80">Lush Agro Campus</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-theme border border-white/15">
              <p className="text-xl sm:text-2xl font-bold text-white">Guest House</p>
              <p className="text-xs text-white/80">Restful Country Stays</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-theme border border-white/15">
              <p className="text-xl sm:text-2xl font-bold text-white">Event Lawns</p>
              <p className="text-xs text-white/80">Celebrations &amp; Gatherings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-theme border border-white/15">
              <p className="text-xl sm:text-2xl font-bold text-white">Plant Nursery</p>
              <p className="text-xs text-white/80">Fruit &amp; Herbal Saplings</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 02. EXPLORE OUR EXPERIENCES                                          */}
      {/* ==================================================================== */}
      <section id="experiences" className="relative bg-bg pt-20 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 px-4 sm:px-6 lg:px-8 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Offerings at a Glance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-main tracking-tight">
            Explore Our Experiences
          </h2>
          <p className="text-content-muted text-base sm:text-lg">
            Discover each facet of {businessName} — from calm bedroom retreats and open festival grounds to organic botanical saplings.
          </p>
        </motion.div>

        {/* Dynamic Story Scroll Experience Showcases */}
        <ExperiencesStoryScroll
          businessName={businessName}
          featuredRooms={featuredRooms}
          farmHouse={farmHouse}
          plants={plants}
          shopActive={shopActive}
        />
      </section>

      {/* ==================================================================== */}
      {/* 03. GUEST HOUSE HIGHLIGHTS                                           */}
      {/* ==================================================================== */}
      <section id="guest-house" className="py-20 bg-surface-muted/60 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-2">
                <BedDouble className="w-3.5 h-3.5" />
                <span>Restful Country Stays</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
                Guest House Highlights
              </h2>
              <p className="text-content-muted text-sm sm:text-base mt-1 max-w-2xl">
                Clean, quiet accommodations situated in our lush agro campus. Reserve dates via stay enquiry request.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/guest-house">
                <Button variant="outline" size="sm">
                  <span>View All Rooms</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/guest-house/booking">
                <Button variant="primary" size="sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Request a Booking</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Featured Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredRooms.map((room, idx) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card
                  hoverEffect
                  padding="p-0"
                  className="h-full flex flex-col bg-surface border border-surface-border group"
                >
                  {/* Room Photo */}
                  <div className="relative h-52 bg-surface-muted overflow-hidden">
                    <img
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="neutral">{room.roomType || 'Deluxe'}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant={room.isAc ? 'primary' : 'warning'}>
                        {room.isAc ? 'AC Room' : 'Non-AC'}
                      </Badge>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-content-main">{room.name}</h3>
                      <p className="text-xs text-content-muted leading-relaxed line-clamp-2">
                        {room.description}
                      </p>

                      {/* Room Facilities Pills */}
                      {room.features && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {room.features.slice(0, 3).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[11px] px-2 py-0.5 rounded bg-surface-muted text-content-muted border border-surface-border"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                      <div>
                        {room.priceDisplay !== false && room.pricePerNight ? (
                          <>
                            <span className="text-lg font-extrabold text-primary">₹{room.pricePerNight}</span>
                            <span className="text-xs text-content-muted"> / night</span>
                          </>
                        ) : (
                          <span className="text-xs text-content-muted font-medium">Tariff on request</span>
                        )}
                      </div>

                      <Link href={`/guest-house/booking?room=${room._id}`}>
                        <Button size="sm" variant="primary">
                          Request Stay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scope Note */}
          <div className="mt-8 flex items-center gap-2 p-3.5 rounded-theme bg-surface border border-surface-border text-xs text-content-muted">
            <Info className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              <strong>Note on Bookings:</strong> All room requests are processed directly by our front desk. Dates are held upon confirmation; no upfront online payment is taken.
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 04. FARM HOUSE & EVENTS                                              */}
      {/* ==================================================================== */}
      <section id="farm-house" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevation border border-surface-border bg-surface aspect-[4/3] group">
              <img
                src={farmHouse.image}
                alt="Willy Nilly Farm House Grounds"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <div>
                  <Badge variant="secondary" className="mb-2">8-Acre Celebration Venue</Badge>
                  <p className="text-sm font-semibold text-white drop-shadow">
                    Ambient landscape lighting &amp; covered dining pavilion
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details & Facilities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/20 text-xs font-semibold mb-2">
                <Trees className="w-3.5 h-3.5" />
                <span>Open-Air Celebration Lawns</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
                Farm House &amp; Events
              </h2>
            </div>

            <p className="text-content-muted text-base leading-relaxed">
              {farmHouse.description}
            </p>

            {/* Confirmed Facilities Highlights */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-light">
                Key Venue Facilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {farmHouse.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-content-main">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Link href="/farm-house">
                <Button variant="primary">
                  <span>Explore Farm House</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/enquiry?category=farm-house">
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>Enquire About an Event</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 05. HORTICULTURE & PLANTS                                             */}
      {/* ==================================================================== */}
      <section id="horticulture" className="py-20 bg-surface-muted/60 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-2">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Botanical Nursery &amp; Saplings</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
                Horticulture &amp; Plants
              </h2>
              <p className="text-content-muted text-sm sm:text-base mt-1 max-w-2xl">
                Explore our healthy stock of grafted fruit saplings, therapeutic medicinal flora, and agro-forestry plants.
              </p>
            </div>

            <Link href="/horticulture">
              <Button variant="outline" size="sm">
                <span>Explore Full Nursery</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Plant Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plants.map((plant, idx) => (
              <motion.div
                key={plant._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card
                  hoverEffect
                  padding="p-0"
                  className="h-full flex flex-col bg-surface border border-surface-border group"
                >
                  <div className="relative h-44 bg-surface-muted overflow-hidden">
                    <img
                      src={plant.images?.[0] || plant.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="primary">{plant.category || 'Nursery'}</Badge>
                    </div>
                    {plant.availability && (
                      <div className="absolute top-2.5 right-2.5">
                        <Badge variant="success">{plant.availability}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-content-main group-hover:text-primary transition-colors">
                        {plant.name}
                      </h3>
                      {plant.scientificName && (
                        <p className="text-[11px] italic text-content-light">
                          {plant.scientificName}
                        </p>
                      )}
                      <p className="text-xs text-content-muted line-clamp-2 mt-1">
                        {plant.description}
                      </p>
                      {plant.heightSize && (
                        <span className="inline-block text-[10px] text-content-light bg-surface-muted px-2 py-0.5 rounded mt-1">
                          Size: {plant.heightSize}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                      {plant.price ? (
                        <span className="text-sm font-bold text-primary">
                          ₹{plant.price} <span className="text-[10px] font-normal text-content-muted">{plant.priceBasis || ''}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-content-muted">Price on request</span>
                      )}

                      <Link href={`/enquiry?category=horticulture&item=${encodeURIComponent(plant.name)}`}>
                        <Button size="sm" variant="outline" className="text-xs px-2.5 py-1">
                          Enquire
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-content-muted mt-8">
            * Our plant catalogue is enquiry-led to provide expert advice and custom batch orders. This is not an online ecommerce checkout.
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 06. RESORT — COMING SOON (Strictly Launching Soon)                   */}
      {/* ==================================================================== */}
      <section id="resort" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-bg-dark text-white p-8 sm:p-12 lg:p-16 shadow-elevation border border-surface-border"
        >
          {/* Subtle Background Art */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
              alt="Resort Concept"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Launching Soon</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Willy Nilly Eco-Resort
            </h2>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed">
              Our premier eco-luxury sanctuary is currently under master planned development. Designed to integrate bio-climatic private villas, natural swimming lagoons, an Ayurvedic wellness center, and farm-to-table dining amidst flourishing orchards.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-white/90">
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/15">
                • Private Bio-Climatic Cottages
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/15">
                • Natural Swimming Lagoon
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/15">
                • Ayurvedic Wellness Pavilion
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/resort">
                <Button variant="secondary">
                  <span>Learn About The Concept</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <span>Stay Updated / Contact Us</span>
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-white/60 italic pt-2">
              Note: Online reservations will open upon official grand inauguration. Booking controls are currently disabled in compliance with project policy.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 07. PHOTO GALLERY PREVIEW (Curated + Click-to-Enlarge Modal)          */}
      {/* ==================================================================== */}
      <section id="gallery" className="py-20 bg-surface-muted/60 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual Exploration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
                Photo Gallery Preview
              </h2>
              <p className="text-content-muted text-sm sm:text-base mt-1">
                A curated glimpse into property landscapes, guest rooms, celebration lawns, and nursery flora.
              </p>
            </div>

            <Link href="/gallery">
              <Button variant="outline" size="sm">
                <span>View Full Gallery</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Photo Grid with consistent aspect ratio */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img._id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveLightboxImg(img)}
                className="group relative aspect-square rounded-theme overflow-hidden border border-surface-border bg-surface-muted cursor-pointer shadow-sm hover:shadow-elevation transition-all"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                  <div className="self-end">
                    <Maximize2 className="w-4 h-4 text-white/90" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-secondary-light block">
                      {img.album || 'Willy Nilly'}
                    </span>
                    <p className="text-xs font-medium leading-tight truncate">{img.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl border border-surface-border"
            >
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeLightboxImg.imageUrl}
                  alt={activeLightboxImg.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-surface space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-content-main">
                    {activeLightboxImg.title}
                  </h3>
                  <Badge variant="primary">{activeLightboxImg.album || 'Gallery'}</Badge>
                </div>
                {activeLightboxImg.caption && (
                  <p className="text-sm text-content-muted">{activeLightboxImg.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 08. ABOUT WILLY NILLY / OUR STORY                                    */}
      {/* ==================================================================== */}
      <section id="about" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-2">
                <Sprout className="w-3.5 h-3.5" />
                <span>Our Heritage &amp; Purpose</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
                About Willy Nilly
              </h2>
            </div>

            <p className="text-base sm:text-lg text-content-muted leading-relaxed">
              {settings?.aboutStory || DEFAULT_SETTINGS.aboutStory}
            </p>

            {/* Credible Highlights (No fabricated stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-theme bg-surface-muted border border-surface-border">
                <h4 className="text-sm font-bold text-content-main mb-1">Authentic Agro Living</h4>
                <p className="text-xs text-content-muted">
                  Rooted in natural agrarian cycles and peaceful countryside hospitality.
                </p>
              </div>

              <div className="p-4 rounded-theme bg-surface-muted border border-surface-border">
                <h4 className="text-sm font-bold text-content-main mb-1">Botanical Knowledge</h4>
                <p className="text-xs text-content-muted">
                  Indigenous saplings, fruit trees, and organic cultivation methods.
                </p>
              </div>

              <div className="p-4 rounded-theme bg-surface-muted border border-surface-border">
                <h4 className="text-sm font-bold text-content-main mb-1">Mindful Hospitality</h4>
                <p className="text-xs text-content-muted">
                  Attentive host care ensuring serene, restorative visits.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button variant="primary">
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Supporting Portrait / Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevation border border-surface-border bg-surface aspect-[4/5] group">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Willy Nilly Founder"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold text-white">Mr. Sarat Kumar Singh</h3>
                <p className="text-xs uppercase tracking-wider text-secondary-light font-medium mt-0.5">
                  Founder &amp; Visionary
                </p>
                <p className="text-xs text-white/80 mt-2 italic leading-relaxed">
                  &ldquo;We didn&apos;t set out to manufacture an escape. We simply nurtured soil so people could breathe again.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 09. VISIT US / LOCATION & CONTACT                                    */}
      {/* ==================================================================== */}
      <section id="contact" className="py-20 bg-surface-muted/60 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14 space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus Location</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
              Visit Us / Location &amp; Contact
            </h2>
            <p className="text-content-muted text-base">
              Conveniently reached via State Highway. Stop by for tranquil stays, event planning, or nursery visits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contact Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 bg-surface p-8 rounded-2xl border border-surface-border shadow-card space-y-6"
            >
              <h3 className="text-xl font-bold text-content-main">
                Willy Nilly Agro Campus
              </h3>

              <div className="space-y-4 text-sm text-content-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-content-main block">Official Address:</span>
                    <span>{settings?.address || DEFAULT_SETTINGS.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-content-main block">Phone Desk:</span>
                    <a
                      href={`tel:${(settings?.phonePrimary || DEFAULT_SETTINGS.phonePrimary).replace(/\s+/g, '')}`}
                      className="hover:text-primary transition-colors"
                    >
                      {settings?.phonePrimary || DEFAULT_SETTINGS.phonePrimary}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-content-main block">Email Desk:</span>
                    <a
                      href={`mailto:${settings?.emailPrimary || DEFAULT_SETTINGS.emailPrimary}`}
                      className="hover:text-primary transition-colors"
                    >
                      {settings?.emailPrimary || DEFAULT_SETTINGS.emailPrimary}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-content-main block">Operating Hours:</span>
                    <span>{settings?.businessHours || DEFAULT_SETTINGS.businessHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex flex-wrap gap-3">
                <a
                  href={settings?.locationMapUrl || DEFAULT_SETTINGS.locationMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="primary" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    <span>Get Directions</span>
                  </Button>
                </a>
                <Link href="/contact" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <span>Contact Us</span>
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Map Preview Embed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 h-96 rounded-2xl overflow-hidden border border-surface-border shadow-card bg-surface-muted relative"
            >
              <iframe
                title="Willy Nilly Campus Location Map"
                src="https://maps.google.com/maps?q=Bhubaneswar,+Odisha,+India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-theme border border-surface-border text-xs text-content-muted flex items-center gap-1.5 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Verified Agro Campus</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10. FINAL ENQUIRY CTA                                                */}
      {/* ==================================================================== */}
      <section id="enquiry" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-primary to-primary-hover text-white p-8 sm:p-14 text-center shadow-elevation relative overflow-hidden"
        >
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              <Send className="w-3.5 h-3.5" />
              <span>We&apos;re Here to Assist</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Planning a Visit or Have a Question?
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Whether you are planning a restful bedroom stay, organizing an open-air lawn celebration, or seeking indigenous plants from our nursery, our desk is happy to assist.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/enquiry">
                <Button variant="white" size="lg">
                  <Send className="w-4 h-4 mr-2 text-primary" />
                  <span>Make an Enquiry</span>
                </Button>
              </Link>
              <a
                href={`tel:${(settings?.phonePrimary || DEFAULT_SETTINGS.phonePrimary).replace(/\s+/g, '')}`}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Call Front Desk</span>
                </Button>
              </a>
            </div>

            <p className="text-xs text-white/75 pt-2">
              Fast, friendly assistance • No obligation • Verified agro-tourism destination
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
