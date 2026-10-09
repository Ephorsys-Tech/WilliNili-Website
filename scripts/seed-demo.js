#!/usr/bin/env node

/**
 * Seed Comprehensive Realistic Demo Content for Willy Nilly
 *
 * Populates:
 *  - Site Settings (Complete profile & founder photo)
 *  - Guest House Rooms (with high-res Unsplash photos, tariffs, amenities)
 *  - Farm House Event Grounds (open lawn event venue & photos)
 *  - Resort (Launching Soon concept & luxury eco photos, bookings disabled)
 *  - Horticulture Plants & Nursery Stock (fruit trees, herbs, saplings with photos)
 *  - Commercial Shop Rental Units (commercial arcade listings with photos)
 *  - Gallery Items (categorized album photos)
 *  - Sample Booking Requests (for admin bookings dashboard testing)
 *  - Sample Enquiries (for admin enquiries dashboard testing)
 */

import fs from 'fs';
import path from 'path';

// 1. Automatically load .env.local and .env
function loadEnvFile(filename) {
  try {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {}
}

loadEnvFile('.env.local');
loadEnvFile('.env');

import connectDB from '../src/backend/config/db.js';
import Room from '../src/models/Room.js';
import FarmHouse from '../src/models/FarmHouse.js';
import Resort from '../src/models/Resort.js';
import Plant from '../src/models/Plant.js';
import ShopRental from '../src/models/ShopRental.js';
import GalleryItem from '../src/models/GalleryItem.js';
import SiteSettings from '../src/models/SiteSettings.js';
import BookingRequest from '../src/models/BookingRequest.js';
import Enquiry from '../src/models/Enquiry.js';

async function seed() {
  console.log('======================================================');
  console.log(' Willy Nilly Agro Tourism — Seeding Complete Demo Data ');
  console.log('======================================================\n');

  await connectDB();

  // 1. Site Settings
  let settings = await SiteSettings.findOne();
  const settingsData = {
    businessName: 'Willy Nilly',
    tagline: 'Where Nature Meets Hospitality & Sustainable Agro Living',
    ownerName: 'Mr. Sarat Kumar Singh',
    ownerTitle: 'Founder & Visionary',
    ownerBio:
      'Pioneering sustainable agro tourism and horticulture development in the region, Mr. Sarat Kumar Singh created Willy Nilly to foster close harmony with nature, eco-conscious leisure, and community empowerment.',
    ownerPhotoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    aboutStory:
      'Nestled amidst lush greenery and fertile soils, Willy Nilly is an agro-tourism retreat and horticulture center dedicated to organic living, tranquil hospitality, and celebration spaces in natural surroundings.',
    vision:
      'To be the benchmark agro-tourism destination that enriches lives through sustainable horticulture, serene hospitality, and vibrant natural spaces.',
    mission:
      'To provide authentic agro-living experiences, promote eco-friendly horticulture practices, and offer memorable stays and celebrations.',
    highlights: [
      'Scenic agro-tourism campus with lush greenery',
      'Serene guest house accommodations with modern amenities',
      'Expansive open-air farm house grounds for weddings & private events',
      'Curated horticulture plant & sapling nursery',
      'Upcoming luxury eco-resort experience',
    ],
    phonePrimary: '+91 98765 43210',
    phoneSecondary: '+91 98765 43211',
    emailPrimary: 'info@willynilly.in',
    address: 'Willy Nilly Agro Campus, Green Valley Road, State Highway, India',
    locationMapUrl: 'https://maps.google.com',
    businessHours: 'Guest House: 24/7 Check-in | Horticulture Nursery: 8:00 AM – 6:00 PM',
    shopRentalActive: false, // Strict PRD requirement
    theme: 'nature',
    resortLaunchingText:
      'Launching Soon - Experience Eco-Luxury amidst Nature. Bookings will open upon official inauguration.',
  };

  if (!settings) {
    settings = await SiteSettings.create(settingsData);
    console.log('✓ Created Site Settings');
  } else {
    Object.assign(settings, settingsData);
    await settings.save();
    console.log('✓ Updated Site Settings');
  }

  // 2. Guest House Rooms (Clear and repopulate with high quality Unsplash photos)
  await Room.deleteMany({});
  const rooms = await Room.insertMany([
    {
      name: 'Deluxe Agro Suite (Room 101)',
      roomType: 'Deluxe',
      isAc: true,
      pricePerNight: 2800,
      priceDisplay: true,
      capacityAdults: 2,
      capacityChildren: 1,
      bedType: 'King Size Teak Bed',
      description:
        'Overlooking the organic fruit orchard, this spacious air-conditioned suite features polished timber interiors, private balcony, and attached bathroom with hot water.',
      features: ['Orchard Balcony', 'Attached Bath', 'Power Backup', 'Work Desk'],
      amenities: ['Hot Water', 'Clean Linens', 'Free Wi-Fi', 'Complimentary Herbal Tea'],
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ],
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: 'Green Canopy Double (Room 102)',
      roomType: 'Double',
      isAc: true,
      pricePerNight: 2200,
      priceDisplay: true,
      capacityAdults: 2,
      capacityChildren: 0,
      bedType: 'Queen Size Bed',
      description:
        'Serene double room offering cross-ventilation, scenic canopy views, and modern comforts nestled in lush agro surroundings.',
      features: ['Garden View', 'Attached Bath', 'Quiet Ambience'],
      amenities: ['Hot Water', 'Clean Linens', 'Free Wi-Fi', 'Air Conditioning'],
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      ],
      isAvailable: true,
      sortOrder: 2,
    },
    {
      name: 'Countryside Family Cottage (Room 103)',
      roomType: 'Family',
      isAc: false,
      pricePerNight: 3500,
      priceDisplay: true,
      capacityAdults: 4,
      capacityChildren: 2,
      bedType: 'Two Queen Beds',
      description:
        'Spacious family retreat designed for natural cooling with expansive garden frontage and verandah seating for families.',
      features: ['Spacious Living Area', 'Private Verandah', 'Lush Lawn View'],
      amenities: ['Hot Water', 'Clean Linens', 'Room Service', 'Eco Ventilation'],
      images: [
        'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      ],
      isAvailable: true,
      sortOrder: 3,
    },
    {
      name: 'Orchard View Executive Suite (Room 104)',
      roomType: 'Suite',
      isAc: true,
      pricePerNight: 3200,
      priceDisplay: true,
      capacityAdults: 2,
      capacityChildren: 1,
      bedType: 'King Size Bed',
      description:
        'Premium top-floor suite featuring panoramic sunrise views across the agro-horticulture landscape, plush lounge area, and artisan teak furnishings.',
      features: ['Panoramic Vista', 'Executive Workstation', 'Private Balcony', 'Tea Station'],
      amenities: ['Hot Water', 'Clean Linens', 'High-Speed Wi-Fi', 'Smart Climate Control'],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      ],
      isAvailable: true,
      sortOrder: 4,
    },
    {
      name: 'Rustic Clay Earth Room (Room 105)',
      roomType: 'Single',
      isAc: false,
      pricePerNight: 1600,
      priceDisplay: true,
      capacityAdults: 1,
      capacityChildren: 0,
      bedType: 'Single Bed',
      description:
        'Traditional terracotta earthen chamber offering authentic rural relaxation, cool indoor temperature, and tranquil bird-song mornings.',
      features: ['Terracotta Finish', 'Courtyard Access', 'Calm Ambience'],
      amenities: ['Hot Water', 'Organic Bed Linens', 'Reading Lamp'],
      images: [
        'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      ],
      isAvailable: true,
      sortOrder: 5,
    },
  ]);
  console.log(`✓ Seeded ${rooms.length} Guest House rooms with high-res photos`);

  // 3. Farm House Content
  await FarmHouse.deleteMany({});
  await FarmHouse.create({
    title: 'Willy Nilly Farm House & Open Event Grounds',
    description:
      'A sprawling 8-acre agro retreat offering manicured open lawns, shaded tree groves, and comprehensive event infrastructure for destination weddings, anniversaries, corporate retreats, and open-air celebrations.',
    propertyArea: '8 Acres of Natural Greenery',
    guestCapacity: 'Ideal for 50 to 800+ Guests',
    facilities: [
      'Expansive Open Lawns with Natural Tree Canopy',
      'Covered Dining & Banquet Pavilion',
      'Air-Conditioned Bridal & VIP Dressing Rooms',
      'Ample Secure Vehicle Parking for 200+ Cars',
      'Dedicated Catering Preparation Yard with Water & Power',
      'Ambient Landscape Fairy Lighting & 100% DG Power Backup',
    ],
    suitableEvents: [
      'Destination Weddings & Sangeet Ceremonies',
      'Reception & Engagement Celebrations',
      'Birthday & Milestone Anniversaries',
      'Corporate Offsites & Leadership Retreats',
      'Agro Workshops & Large Family Gatherings',
    ],
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    ],
    locationGuide:
      'Easily accessible via State Highway with wide approach roads suitable for buses, luxury cars, and heavy event logistics.',
  });
  console.log('✓ Seeded Farm House details and event photos');

  // 4. Resort Content (Strictly Launching Soon - booking disabled)
  await Resort.deleteMany({});
  await Resort.create({
    resortName: 'Willy Nilly Eco Resort',
    launchStatus: 'Launching Soon',
    launchMessage:
      'Our premier eco-luxury resort is currently under master planned development. Online booking is strictly disabled until official grand inauguration.',
    conceptDescription:
      'A luxury eco-sanctuary where authentic agro charm meets world-class hospitality. Featuring bio-climatic private villas, natural chemical-free pool lagoons, an Ayurvedic wellness center, organic farm-to-table fine dining, and guided nature trails.',
    featuresPlanned: [
      'Private Luxury Eco Cottages & Tree Villas',
      'Natural Chemical-Free Swimming Lagoon',
      'Ayurvedic Wellness & Yoga Pavilion',
      'Farm-to-Fork Organic Dining Restaurant',
      'Guided Agro & Bird Watching Trails',
      'Solar-Powered Carbon-Neutral Infrastructure',
    ],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    bookingEnabled: false,
  });
  console.log('✓ Seeded Resort Launching Soon preview');

  // 5. Horticulture Plants & Saplings
  await Plant.deleteMany({});
  const plants = await Plant.insertMany([
    {
      name: 'Alphonso Mango Sapling (Grafted)',
      scientificName: 'Mangifera indica',
      category: 'Fruit Plants',
      description:
        'Certified premium grafted Alphonso mango sapling yielding exceptionally sweet, aromatic fruit in 3-4 years.',
      price: 350,
      priceBasis: 'per sapling',
      availability: 'In Stock',
      careInstructions:
        'Requires fertile loamy soil, direct sunlight, and compost every 3 months. Water deeply twice weekly.',
      heightSize: '2.5 - 3 Feet Root Bag',
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 1,
    },
    {
      name: 'Hybrid Guava (Taiwan Pink)',
      scientificName: 'Psidium guajava',
      category: 'Fruit Plants',
      description:
        'Fast-fruiting Taiwan Pink guava variety with crisp pink flesh, very low seeds, and high natural sweetness.',
      price: 220,
      priceBasis: 'per sapling',
      availability: 'In Stock',
      careInstructions:
        'Regular watering during flowering; drought tolerant once established. Prune annually after harvest.',
      heightSize: '2 Feet Nursery Bag',
      images: [
        'https://images.unsplash.com/photo-1536511135899-7f37f3747656?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 2,
    },
    {
      name: 'Holy Basil (Krishna Tulsi)',
      scientificName: 'Ocimum sanctum',
      category: 'Medicinal Plants',
      description:
        'Potent therapeutic Krishna Tulsi with dark purple leaves, high essential oil content, and respiratory wellness properties.',
      price: 80,
      priceBasis: 'per pot',
      availability: 'In Stock',
      careInstructions:
        'Requires moist soil with good drainage and 4-6 hours of daily sunlight. Pinch flower buds for bushier growth.',
      heightSize: '1 Foot Clay Pot',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 3,
    },
    {
      name: 'Red Sandalwood Sapling',
      scientificName: 'Pterocarpus santalinus',
      category: 'Agro Forestry Saplings',
      description:
        'Hardy timber forestry sapling suitable for long-term agroforestry investment and farm boundary plantation.',
      price: 180,
      priceBasis: 'per sapling',
      availability: 'In Stock',
      careInstructions:
        'Requires dry to moderate tropical soil with good drainage. Minimal maintenance after first year.',
      heightSize: '1.5 Feet Nursery Polybag',
      images: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 4,
    },
    {
      name: 'Kagzi Seedless Lime',
      scientificName: 'Citrus aurantiifolia',
      category: 'Fruit Plants',
      description:
        'Prolific bearing thin-skinned juicy lime variety that produces aromatic fruit year-round.',
      price: 190,
      priceBasis: 'per sapling',
      availability: 'In Stock',
      careInstructions:
        'Needs full sun exposure and well-draining soil. Apply organic vermicompost every 60 days.',
      heightSize: '2 Feet Nursery Bag',
      images: [
        'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 5,
    },
    {
      name: 'Aromatic Lemongrass Clump',
      scientificName: 'Cymbopogon citratus',
      category: 'Organic Herbs',
      description:
        'Vigorous culinary and herbal tea grass clump that naturally repels mosquitoes and purifies the garden air.',
      price: 120,
      priceBasis: 'per clump',
      availability: 'In Stock',
      careInstructions:
        'Thrives in bright sun; harvest outer stalks regularly to encourage vigorous regrowth.',
      heightSize: '1.5 Feet Pot',
      images: [
        'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80',
      ],
      sortOrder: 6,
    },
  ]);
  console.log(`✓ Seeded ${plants.length} Horticulture plants & nursery listings`);

  // 6. Shop Rental Units (Pre-configured in admin; module remains toggled off by default per PRD)
  await ShopRental.deleteMany({});
  await ShopRental.insertMany([
    {
      title: 'Front Highway Facing Agro Retail Store',
      shopNumber: 'S-01',
      sizeSqFt: 350,
      rentAmount: 14000,
      rentPeriod: 'Monthly',
      location: 'Main Agro Campus Entrance Plaza, Ground Floor',
      description:
        'High-visibility commercial retail space right at the main campus entrance. Ideal for organic grocery, seed retailer, handicraft gallery, or tourist gift store.',
      facilities: [
        'Motorized Rolling Shutter',
        'Commercial 3-Phase Electricity',
        'Paved Front Parking & Walkway',
        'Dedicated Water Connection',
      ],
      images: [
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      sortOrder: 1,
    },
    {
      title: 'East Promenade Organic Food Corner',
      shopNumber: 'S-02',
      sizeSqFt: 240,
      rentAmount: 9500,
      rentPeriod: 'Monthly',
      location: 'East Agro Promenade near Nursery Pathway',
      description:
        'Cozy corner commercial unit perfectly positioned along the visitor walking path. Suitable for artisanal bakery, herbal juice bar, or eco cafe.',
      facilities: [
        'Wide Display Frontage',
        'Water Drainage & Sink Setup',
        'Paved Seating Patio Space',
        'Shared Restroom Access',
      ],
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      sortOrder: 2,
    },
    {
      title: 'Garden Tools & Agri Depot',
      shopNumber: 'S-03',
      sizeSqFt: 420,
      rentAmount: 16500,
      rentPeriod: 'Monthly',
      location: 'Service Lane Adjacent to Plant Nursery',
      description:
        'Spacious unit with rear loading access, ideal for farm equipment rental, organic fertilizers, and horticulture supply depot.',
      facilities: [
        'Heavy-Duty Rolling Shutter',
        'Rear Loading Dock',
        'Ventilated Storage Space',
        'Power Backup Line',
      ],
      images: [
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
      ],
      isAvailable: true,
      sortOrder: 3,
    },
  ]);
  console.log('✓ Seeded 3 Commercial Shop Rental units');

  // 7. Gallery Items
  await GalleryItem.deleteMany({});
  await GalleryItem.insertMany([
    {
      title: 'Morning Sun over Orchard Lawns',
      album: 'Property',
      imageUrl:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden morning light filtering through the organic orchards across the campus.',
      isPublic: true,
      sortOrder: 1,
    },
    {
      title: 'Deluxe Guest House Verandah',
      album: 'Guest House',
      imageUrl:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      caption: 'Private timber verandah overlooking landscaped flower beds.',
      isPublic: true,
      sortOrder: 2,
    },
    {
      title: 'Open Farm House Celebration Setup',
      album: 'Events',
      imageUrl:
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      caption: 'Illuminated fairy light setup across the 8-acre lawn for a destination reception.',
      isPublic: true,
      sortOrder: 3,
    },
    {
      title: 'Nursery Greenhouse & Fruit Saplings',
      album: 'Horticulture',
      imageUrl:
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      caption: 'Healthy grafted saplings and ornamental varieties inside our controlled nursery.',
      isPublic: true,
      sortOrder: 4,
    },
    {
      title: 'Evening Canopy Banquet Setup',
      album: 'Celebrations',
      imageUrl:
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      caption: 'Evening dining under the stars surrounded by tranquil countryside breeze.',
      isPublic: true,
      sortOrder: 5,
    },
    {
      title: 'Fresh Organic Harvest at Sunrise',
      album: 'Property',
      imageUrl:
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Fresh farm fruits picked right from our agro groves.',
      isPublic: true,
      sortOrder: 6,
    },
    {
      title: 'Aromatic Herb Garden',
      album: 'Horticulture',
      imageUrl:
        'https://images.unsplash.com/photo-1515150117512-33dd37333971?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rows of therapeutic basil, lemongrass, and mint in rich organic soil.',
      isPublic: true,
      sortOrder: 7,
    },
    {
      title: 'Upcoming Luxury Eco Resort Concept',
      album: 'Resort',
      imageUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      caption: 'Architectural vision for the upcoming premier bio-climatic resort sanctuary.',
      isPublic: true,
      sortOrder: 8,
    },
  ]);
  console.log('✓ Seeded 8 curated Gallery images across albums');

  // 8. Sample Booking Requests (so admin /admin/bookings & dashboard has real data)
  await BookingRequest.deleteMany({});
  const now = new Date();
  const checkIn1 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const checkOut1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const checkIn2 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const checkOut2 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  await BookingRequest.insertMany([
    {
      bookingReference: 'WN-BK-202610-8841',
      guestName: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      mobile: '+91 98201 54321',
      checkInDate: checkIn1,
      checkOutDate: checkOut1,
      guestCount: 2,
      roomsCount: 1,
      room: rooms[0]._id,
      specialRequest:
        'Celebrating our anniversary. Please arrange an early check-in around 11 AM if possible.',
      status: 'New',
    },
    {
      bookingReference: 'WN-BK-202610-9124',
      guestName: 'Rajesh Mukherjee',
      email: 'rajesh.m@example.com',
      mobile: '+91 98450 12389',
      checkInDate: checkIn2,
      checkOutDate: checkOut2,
      guestCount: 4,
      roomsCount: 1,
      room: rooms[2]._id,
      specialRequest:
        'Family holiday with two children. Requesting cot and farm tour orientation.',
      status: 'Confirmed',
    },
  ]);
  console.log('✓ Seeded 2 sample Guest House booking requests');

  // 9. Sample Enquiries (so admin /admin/enquiries has real data)
  await Enquiry.deleteMany({});
  await Enquiry.insertMany([
    {
      reference: 'WN-ENQ-202610-101',
      enquiryType: 'FarmHouse',
      name: 'Vikram & Pooja Malhotra',
      email: 'vikram.malhotra@example.com',
      mobile: '+91 98112 34567',
      message:
        'We are planning an outdoor evening wedding reception for around 450 guests in November. Would love to inspect the farm grounds and discuss catering setup options.',
      eventType: 'Destination Wedding Reception',
      preferredDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      expectedGuests: 450,
      status: 'New',
    },
    {
      reference: 'WN-ENQ-202610-102',
      enquiryType: 'Horticulture',
      name: 'Dr. Ramesh Patel',
      email: 'ramesh.patel@agrofarm.org',
      mobile: '+91 94230 76543',
      message:
        'Interested in purchasing 150 Alphonso mango grafted saplings and 50 Red Sandalwood saplings for our family estate plantation. Please provide commercial wholesale quote and delivery timeline.',
      plant: plants[0]._id,
      plantName: 'Alphonso Mango Sapling (Grafted)',
      status: 'Contacted',
      adminNotes: 'Quoted wholesale price via email on 09 Oct.',
    },
    {
      reference: 'WN-ENQ-202610-103',
      enquiryType: 'General',
      name: 'Sunita Roy',
      email: 'sunita.roy@example.com',
      mobile: '+91 99001 88776',
      message:
        'Can we bring a school botany club of 35 students for a half-day educational tour of the organic nursery?',
      status: 'In Progress',
    },
  ]);
  console.log('✓ Seeded 3 sample Enquiries');

  console.log('\n======================================================');
  console.log(' Success! All demo content populated into MongoDB.   ');
  console.log('======================================================\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n✗ Seed error:', err);
  process.exit(1);
});
