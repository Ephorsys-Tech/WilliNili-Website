/**
 * Farmhouse Hubs & Dedicated Nearest Places Data
 * Each farmhouse property has its own identity, specific activities, and mapped nearest explorable destinations.
 */

export const FARMHOUSE_HUBS = [
  {
    id: 'sandhya-farm',
    slug: 'sandhya-agro-farm-house-kisan-nagar-cuttack',
    name: 'Sandhya Agro Farm House',
    tagline: 'Basecamp Agro Retreat, Fishing Pond & 50-Person Picnic Spot',
    location: 'Sagadipatana, Barda, Kisan Nagar, Cuttack (Katak), Odisha',
    district: 'Cuttack',
    distanceLabel: 'Basecamp Destination (Kisan Nagar)',
    travelTime: '40 mins from Cuttack / 60 mins from BBSR',
    heroImage: '',
    mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
    picnicCapacity: 'Specially Arranged for Groups Up to 50 People',
    badge: 'Flagship Farmhouse Basecamp',
    badgeColor: 'bg-emerald-700 text-white',
    description:
      'Our primary agro retreat tucked in Sagadipatana, Kisan Nagar. Features a crystal-clear freshwater fishing pond for angling, precious White & Red Sandalwood, Agarwood, Mahogany, and Betelnut palm agroforestry, free-range turkey and colour bird cultivation yards, open shaded verandas, and woodfire outdoor cooking setups ideal for 50-person family or corporate day picnics.',
    highlights: [
      {
        title: 'Recreational Fishing Pond',
        desc: 'Sweet-water angling pond stocked with Rohu, Bhakura & Mirikali with shaded bamboo banks.',
        icon: 'Fish',
      },
      {
        title: 'Precious Sandalwood & Agarwood',
        desc: 'Sacred White/Red Chandan, Agarwood (Oud), Mahogany avenues & multi-tier Betelnut cultivation.',
        icon: 'Trees',
      },
      {
        title: 'Turkey & Colour Bird Farming',
        desc: 'Free-range heritage turkeys and ornamental avian enclosures in natural open-air yards.',
        icon: 'Bird',
      },
      {
        title: '50-Person Day Picnic Pavilions',
        desc: 'Lawn gazebos, clean washrooms, power backup, and outdoor woodfire chulha setup.',
        icon: 'Users',
      },
    ],
    cuisine: [
      'Fresh freshwater pond fish curry (Machha Jhola)',
      'Clay-pot slow-cooked desi chicken (Handi Mansha)',
      'Traditional woodfire Dalma with roasted cumin & desi ghee',
      'Fresh farm-harvested betel leaves (Paan) & tender coconut water',
    ],
    facilities: [
      'Freshwater Angling & Aquaculture Fishing Pond',
      'White & Red Sandalwood, Agarwood & Mahogany Groves',
      'Colour Bird Aviary & Free-Range Turkey Farming Yard',
      'Private Day-Picnic Pavilions (Arranged for Up to 50 People)',
      'Traditional Woodfire Chulha & Earthen Pot Cooking Yards',
      'Covered Dining Verandas & Modern Sanitized Restrooms',
      'Expansive Open Lawns with Ambient Lighting & Power Backup',
      'Ample Secure Vehicle Parking',
    ],
    // Nearest explorable destinations specifically from Sandhya Farm House
    nearestPlaces: [
      {
        name: 'Sangeeta Grafting & Nursery (Juanga, Niali)',
        category: 'Agro Nursery & Plant Sale',
        distance: '28 km from Sandhya Farm House',
        travelTime: '35 mins drive',
        description:
          'Premier grafting nursery with 2 Lakh (200,000+) mango and kaju grafted plants available for direct sale, with vegetative grafting demonstrations.',
        slug: 'sangeeta-grafting-nursery-juanga-niali',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Niali+Cuttack+Odisha',
        highlight: '2 Lakh Plants for Sale • Cashew & Mango',
      },
      {
        name: 'Dhauli Shanti Stupa & Daya River Agro Valley',
        category: 'History & River Valley',
        distance: '12 km from Sandhya Farm House',
        travelTime: '20 mins drive',
        description:
          'Majestic white Peace Pagoda overlooking fertile alluvial paddy plains, bamboo groves, and pastoral Odia villages on the Daya river banks.',
        slug: 'dhauli-shanti-stupa-daya-river-agro-valley',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Dhauli+Shanti+Stupa+Odisha',
        highlight: 'Ashokan Rock Edicts • Daya River Vista',
      },
      {
        name: 'Raghurajpur Heritage Craft & Agro Village',
        category: 'Agro Heritage & Craft',
        distance: '22 km from Sandhya Farm House',
        travelTime: '35 mins drive',
        description:
          'World-famous heritage craft village surrounded by dense coconut groves, betel-leaf (Paan Baraja) farms, and living Pattachitra master artists.',
        slug: 'raghurajpur-heritage-craft-agro-village',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Raghurajpur+Odisha',
        highlight: 'Living Heritage Village • Pattachitra & Betel Farms',
      },
      {
        name: 'Pipili Artisan Village & Organic Hub',
        category: 'Cultural Village',
        distance: '16 km from Sandhya Farm House',
        travelTime: '25 mins drive',
        description:
          'Renowned global destination for exquisite Odisha applique handcrafts, colourful artisan workshops, and surrounding lush countryside agro-settlements.',
        slug: 'pipili-artisan-village-organic-hub',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Pipili+Odisha',
        highlight: 'Applique Craft Workshops • Chhena Poda',
      },
    ],
  },
  {
    id: 'sangeeta-nursery',
    slug: 'sangeeta-grafting-nursery-juanga-niali',
    name: 'Sangeeta Grafting & Nursery',
    tagline: 'Premier Vegetative Grafting Hub & 2 Lakh Plants Inventory for Sale',
    location: 'Juanga, Niali, Cuttack (Katak) District, Odisha',
    district: 'Cuttack (Niali)',
    distanceLabel: '28 km from Sandhya Farm House',
    travelTime: '35 mins scenic drive via Niali Highway',
    heroImage: '',
    mapUrl: 'https://maps.google.com/?q=Niali+Cuttack+Odisha',
    picnicCapacity: 'Horticultural Consultation & Plant Sales Center',
    badge: '200,000+ Plants for Sale',
    badgeColor: 'bg-teal-700 text-white',
    description:
      'Premier horticultural propagation and commercial vegetative grafting nursery holding an active inventory of over 2 Lakh (200,000+) certified high-yield mango and kaju (cashew) grafted saplings. Offers live wedge grafting demonstrations, rootstock hardening workshops, and soil health consultation for farmers and orchard owners.',
    highlights: [
      {
        title: '2 Lakh Plants for Sale',
        desc: 'Over 200,000 disease-resistant grafted mango and cashew saplings ready for immediate dispatch.',
        icon: 'Sprout',
      },
      {
        title: 'Live Grafting Demonstrations',
        desc: 'Hands-on training in softwood grafting, epicotyl techniques, and organic potting blends.',
        icon: 'Award',
      },
      {
        title: 'Commercial Orchard Planning',
        desc: 'Expert guidance on spacing, high-density planting, micro-irrigation, and canopy pruning.',
        icon: 'Compass',
      },
      {
        title: 'Farmer Knowledge Exchange',
        desc: 'Generational rural plant breeding lore and community agro-extension support.',
        icon: 'Users',
      },
    ],
    cuisine: [
      'Sweet tender Niali green coconut water',
      'Clay-cup spiced cardamom tea',
      'Seasonal tree-ripened mango tastings',
      'Woodfire Odia Chhena Gaja sweets',
    ],
    facilities: [
      'Polyhouse Propagation Shade Tunnels',
      'Direct Plant Sales Counter & Wholesale Logistics',
      'Live Grafting Training Sheds & Lecture Yard',
      'Demonstration Mango & Cashew Mother Orchards',
      'Restroom & Drinking Water Stations',
      'Dedicated Vehicle Loading Bay for Sapling Transport',
    ],
    // Nearest explorable destinations specifically from Sangeeta Nursery (Niali)
    nearestPlaces: [
      {
        name: 'Sandhya Agro Farm House (Kisan Nagar)',
        category: 'Flagship Farmhouse & Picnic Spot',
        distance: '28 km from Sangeeta Nursery',
        travelTime: '35 mins drive',
        description:
          'Flagship agro retreat in Sagadipatana with a fishing pond, Sandalwood & Agarwood groves, turkey farming, and 50-person group picnic grounds.',
        slug: 'sandhya-agro-farm-house-kisan-nagar-cuttack',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
        highlight: 'Basecamp Retreat • 50-Pax Picnic Ready',
      },
      {
        name: 'Madhavananda Temple & Prachi Valley River Belt',
        category: 'Heritage & River Valley',
        distance: '10 km from Sangeeta Nursery',
        travelTime: '15 mins drive',
        description:
          'Ancient 12th-century temple on the holy Prachi River, surrounded by fertile riverine vegetable farmlands and historic Odia sculpture.',
        slug: 'dhauli-shanti-stupa-daya-river-agro-valley',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Niali+Odisha',
        highlight: 'Prachi River Heritage • Agrarian Farmlands',
      },
      {
        name: 'Pipili Artisan Village & Organic Hub',
        category: 'Cultural Village',
        distance: '20 km from Sangeeta Nursery',
        travelTime: '30 mins drive',
        description:
          'Odisha’s applique handcraft center, colourful market streets, and delicious fresh caramelized Chhena Poda.',
        slug: 'pipili-artisan-village-organic-hub',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Pipili+Odisha',
        highlight: 'Applique Craft Village • Rural Markets',
      },
    ],
  },
  {
    id: 'allora-resort',
    slug: 'allora-agro-forestry-jungle-resort-dhenkanal',
    name: 'Allora Agro Forestry & Jungle Resort',
    tagline: '5,000 Mother Plants of Cashew & Mango • Upcoming Eco-Jungle Sanctuary',
    location: 'Gobindaprasad, Odapada, Dhenkanal District, Odisha',
    district: 'Dhenkanal',
    distanceLabel: '55 km from Sandhya Farm House',
    travelTime: '1 hr 15 mins highway drive via NH 55',
    heroImage: '',
    mapUrl: 'https://maps.google.com/?q=Odapada+Dhenkanal+Odisha',
    picnicCapacity: 'Jungle Canopy Villas & Biodiversity Sanctuary',
    badge: '5,000 Mother Plants • Jungle Resort',
    badgeColor: 'bg-amber-600 text-white',
    description:
      'Massive biodiversity sanctuary spreading across rolling Dhenkanal hillocks with 5,000 certified mother plants of cashew (kaju) and mango. Developing into an upcoming luxury eco-jungle resort featuring forest canopy wooden villas, natural contour water harvesting lakes, stargazing terraces, and deep-nature forest bathing.',
    highlights: [
      {
        title: '5,000 Certified Mother Plants',
        desc: 'Massive germplasm gene bank of premium cashew and mango mother trees with contour terracing.',
        icon: 'Trees',
      },
      {
        title: 'Upcoming Jungle Resort Villas',
        desc: 'Eco-sensitive timber canopy suites, open-air stargazing verandas, and forest bathing pathways.',
        icon: 'Home',
      },
      {
        title: 'Contour Rainwater Lakes',
        desc: 'Engineered watershed retention ponds preserving groundwater tables and supporting wild birds.',
        icon: 'Compass',
      },
      {
        title: 'Wild Dhenkanal Forest Lore',
        desc: 'Sal tree lore, indigenous tribal wild food demonstrations, and night sky stargazing.',
        icon: 'Sparkles',
      },
    ],
    cuisine: [
      'Woodfire smoked bamboo shoot delicacies (Karadi)',
      'Pure wild forest honey harvested from local Sal tree reserves',
      'Handi mutton cooked slowly over forest sal-wood fires',
      'Desi roasted wild tubers and sweet river greens',
    ],
    facilities: [
      '5,000 Mother Plant Cashew & Mango Gene Blocks',
      'Contour Rainwater Harvesting Reservoirs',
      'Upcoming Forest Canopy Accommodation Units',
      'Nature Trail Walking Paths & Forest Bathing Corridors',
      'Open Sky Fire Pit & Tribal Cultural Performance Arena',
      'Eco-Logistics Camp & Visitor Information Desk',
    ],
    // Nearest explorable destinations specifically from Allora (Dhenkanal)
    nearestPlaces: [
      {
        name: 'Kapilash Hill Temple & Wildlife Sanctuary',
        category: 'Eco-Sanctuary & Wildlife',
        distance: '32 km from Allora Resort',
        travelTime: '45 mins drive',
        description:
          'Perched at 2,239 feet above sea level, Kapilash features dense Sal & Teak forests, elephant migration corridors, and ancient Shiva shrines.',
        slug: 'chandaka-dampara-agro-nature-sanctuary',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Kapilash+Dhenkanal+Odisha',
        highlight: 'Wildlife Sanctuary • Cloud-Kissed Hill Top',
      },
      {
        name: 'Saptasajya Eco-Valley & Natural Streams',
        category: 'Nature & Forest Reserve',
        distance: '24 km from Allora Resort',
        travelTime: '35 mins drive',
        description:
          'Seven interconnected hills with perennial freshwater springs, mythical Ramayana connections, and lush picnic groves under wild mango canopies.',
        slug: 'chandaka-dampara-agro-nature-sanctuary',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Saptasajya+Dhenkanal+Odisha',
        highlight: 'Perennial Hill Streams • Seven Valley Hills',
      },
      {
        name: 'Sandhya Agro Farm House (Kisan Nagar)',
        category: 'Flagship Farmhouse & Picnic Spot',
        distance: '55 km from Allora Resort',
        travelTime: '1 hr 15 mins highway drive',
        description:
          'Basecamp agro retreat in Sagadipatana with a fishing pond, Sandalwood groves, and 50-person group picnic grounds.',
        slug: 'sandhya-agro-farm-house-kisan-nagar-cuttack',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
        highlight: 'Basecamp Destination • 50-Pax Picnic Grounds',
      },
    ],
  },
  {
    id: 'willy-nilly-corridor',
    slug: 'willy-nilly-agro-eco-tourism-project-2026',
    name: 'Willy Nilly Agro Eco Tourism Project',
    tagline: 'Top Priority State Circuit • Official Launch Scheduled Before Dec 2026',
    location: 'Integrated Regional Agro Corridor (Cuttack – Niali – Dhenkanal)',
    district: 'Odisha State Circuit',
    distanceLabel: 'Top Priority Regional Corridor',
    travelTime: 'Grand Launch Target: Before Dec 2026',
    heroImage: '',
    mapUrl: 'https://maps.google.com/?q=Cuttack+Odisha',
    picnicCapacity: 'Regional Agro-Corridor & VIP Priority Pre-Booking',
    badge: 'Top Priority • Launching Dec 2026',
    badgeColor: 'bg-rose-700 text-white animate-pulse',
    description:
      'Odisha’s flagship integrated agro-eco-tourism corridor connecting Sandhya Farm House (Kisan Nagar), Sangeeta Grafting Nursery (Niali), and Allora Agro Forestry & Jungle Resort (Dhenkanal). Scheduled for grand official inauguration before December 2026 with VIP priority registrations and investor previews open today.',
    highlights: [
      {
        title: 'December 2026 Grand Launch',
        desc: 'Top priority government and private agro-tourism corridor connecting 3 iconic regional hubs.',
        icon: 'Award',
      },
      {
        title: 'Complete Farm-to-Fork Loop',
        desc: 'Organic harvests, solar micro-irrigation, zero-waste composting, and indigenous Odia cuisine.',
        icon: 'Sprout',
      },
      {
        title: 'Rural Community Empowerment',
        desc: 'Creating direct livelihood opportunities for local farmers, craftsmen, and folk artists.',
        icon: 'Users',
      },
      {
        title: 'Seamless Tourist Circuit',
        desc: 'Guided tour buses and day-picnic packages covering farms, nurseries, forests, and temples.',
        icon: 'Compass',
      },
    ],
    cuisine: [
      'Grand 100% organic farm banquet cooked over traditional firewood chulhas',
      'Heritage indigenous grain porridge and fresh green coconut water',
      'Wild forest honey dressings and woodfire caramelized sweet delicacies',
    ],
    facilities: [
      'Integrated Multi-District Transportation Corridor',
      'VIP Priority Hospitality Lounges & Registration Desks',
      'Community Agro-Tourism Exhibition Centers',
      'Solar-Powered Eco-Rest Stops & Charging Depots',
    ],
    // Nearest places connecting the entire circuit
    nearestPlaces: [
      {
        name: 'Sandhya Agro Farm House (Kisan Nagar)',
        category: 'Flagship Farmhouse & Picnic Spot',
        distance: 'Basecamp Destination',
        travelTime: 'Basecamp Hub',
        description: 'Angling pond, white/red sandalwood, 50-person group picnics.',
        slug: 'sandhya-agro-farm-house-kisan-nagar-cuttack',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
        highlight: 'Basecamp • 50-Pax Picnic Grounds',
      },
      {
        name: 'Sangeeta Grafting & Nursery (Niali)',
        category: 'Agro Nursery & Plant Sale',
        distance: '28 km from Sandhya Farm House',
        travelTime: '35 mins drive',
        description: '2 Lakh grafted cashew and mango plants for sale.',
        slug: 'sangeeta-grafting-nursery-juanga-niali',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Niali+Cuttack+Odisha',
        highlight: '2 Lakh Plants for Sale',
      },
      {
        name: 'Allora Agro Forestry & Jungle Resort (Dhenkanal)',
        category: 'Forestry & Jungle Resort',
        distance: '55 km from Sandhya Farm House',
        travelTime: '1 hr 15 mins highway drive',
        description: '5,000 cashew/mango mother plants and upcoming canopy villas.',
        slug: 'allora-agro-forestry-jungle-resort-dhenkanal',
        image: '',
        mapUrl: 'https://maps.google.com/?q=Odapada+Dhenkanal+Odisha',
        highlight: '5,000 Mother Plants • Jungle Resort',
      },
    ],
  },
];

export function getFarmhouseHubById(id) {
  return FARMHOUSE_HUBS.find((h) => h.id === id) || FARMHOUSE_HUBS[0];
}

export function getFarmhouseHubBySlug(slug) {
  return FARMHOUSE_HUBS.find((h) => h.slug === slug);
}
