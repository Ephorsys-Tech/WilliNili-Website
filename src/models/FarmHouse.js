import mongoose from 'mongoose';

const FarmHouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Sandhya Agro Farm House & Willy Nilly Eco Retreat',
      trim: true,
    },
    description: {
      type: String,
      default:
        'Flagship agro retreat in Sagadipatana, Kisan Nagar, Cuttack featuring a freshwater fishing pond, White & Red Sandalwood, Agarwood, Mahogany, Betel Nut groves, Colour Bird & Turkey cultivation, and curated 50-person day picnic setups.',
    },
    heroImage: {
      type: String,
      default: '',
    },
    propertyArea: {
      type: String,
      default: '8 Acres of Natural Agroforestry & Lawns',
    },
    guestCapacity: {
      type: String,
      default: 'Ideal for 50-Person Picnics to 800+ Event Gatherings',
    },
    facilities: {
      type: [String],
      default: [
        'Freshwater Angling & Aquaculture Fishing Pond',
        'White & Red Sandalwood, Agarwood & Mahogany Groves',
        'Colour Bird Aviary & Free-Range Turkey Farming Yard',
        'Private Day-Picnic Pavilions (Arranged for Up to 50 People)',
        'Traditional Woodfire Chulha & Earthen Pot Cooking Yards',
        'Covered Dining Verandas & Modern Sanitized Restrooms',
        'Expansive Open Lawns with Ambient Lighting & Power Backup',
        'Ample Secure Vehicle Parking',
      ],
    },
    suitableEvents: {
      type: [String],
      default: [
        '50-Person Family & Corporate Day Picnics',
        'Freshwater Pond Angling & Aquaculture Outings',
        'Agroforestry & Sandalwood Botanical Tours',
        'Destination Weddings & Cultural Celebrations',
        'School Nature Excursions & Organic Farming Workshops',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    locationGuide: {
      type: String,
      default: 'Conveniently accessible via Highway connecting key urban hubs with tranquil nature surroundings.',
    },
    touristPlaces: {
      type: [
        {
          name: { type: String, required: true },
          category: { type: String, default: 'Cultural & Agro Heritage' },
          distance: { type: String, default: '20 km from Farm' },
          travelTime: { type: String, default: '30 mins' },
          description: { type: String, required: true },
          cultureHighlight: { type: String, default: '' },
          cuisineHighlight: { type: String, default: '' },
          farmingMethod: { type: String, default: '' },
          image: { type: String, default: '' },
          mapUrl: { type: String, default: '' },
        },
      ],
      default: [
        {
          name: 'Sandhya Agro Farm House (Sagadipatana, Kisan Nagar, Cuttack)',
          category: 'Flagship Farmhouse & Picnic Spot',
          distance: 'Basecamp Destination (Cuttack)',
          travelTime: '40 mins from Cuttack / 60 mins from BBSR',
          description:
            'Flagship agro retreat in Sagadipatana, Barda, Kisan Nagar. Features a freshwater fishing pond, white & red sandalwood, agarwood, mahogany, betelnut cultivation, colour bird & turkey farming, and specialized 50-person day picnic setups.',
          cultureHighlight:
            'Living rural Odia farm hospitality, open shaded verandas, traditional folk leisure, and countryside angling.',
          cuisineHighlight:
            'Fresh pond fish curry, clay-pot desi chicken, woodfire Dalma, and fresh farm-harvested betel leaf.',
          farmingMethod:
            'Multi-tier agroforestry with White/Red Sandalwood, Agarwood, Betel Nut palms, aquaculture pond, and free-range turkey/poultry yards.',
          image: '',
          mapUrl: 'https://maps.google.com/?q=Kisan+Nagar+Cuttack+Odisha',
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
        },
        {
          name: 'Raghurajpur Heritage Craft & Agro Village',
          category: 'Agro Heritage & Craft',
          distance: '22 km from Farm',
          travelTime: '35 mins drive',
          description:
            'A world-famous living heritage village nestled amidst dense coconut groves, betel-leaf (Paan Baraja) farms, and palm orchards where every family preserves classical Odia artisan traditions.',
          cultureHighlight:
            'Live masterclasses in Pattachitra scroll art, palm-leaf engravings, Gotipua dance roots, and traditional mud-plastered houses with heritage murals.',
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
            'Ancient Ashokan rock edicts dating to 261 BC, peaceful Buddhist rock carvings, and serene sunrise vistas over rural countryside.',
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
      ],
    },
    agroExperiences: {
      type: [
        {
          title: { type: String, required: true },
          subtitle: { type: String, default: '' },
          icon: { type: String, default: 'Sprout' },
          description: { type: String, required: true },
          features: { type: [String], default: [] },
          tag: { type: String, default: 'Agro Experience' },
        },
      ],
      default: [
        {
          title: 'Authentic Agro Farming & Living Methods',
          subtitle: 'Live Indigenous Agriculture & Paddy Walkways',
          icon: 'Sprout',
          description:
            'Step directly into the fertile soil. Learn time-tested traditional farming methods, understand drip and canal irrigation, witness seed saving, and participate in organic composting.',
          features: [
            'Guided morning agro walks across vegetable & paddy beds',
            'Desi Gaushala & traditional bio-fertilizer preparation',
            'Hands-on sapling plantation & horticulture care',
            'Fresh organic seasonal fruit harvesting',
          ],
          tag: 'Agro Farming',
        },
        {
          title: 'Traditional Odia Farm-Fresh Dining',
          subtitle: 'Woodfire Chulha & Earthen Pot Cooking',
          icon: 'Utensils',
          description:
            'Savour nutritious, wholesome Odia meals prepared with organic produce harvested right from our fields, cooked slowly over firewood in clay pots (Handi/Matka) and served fresh on banana leaves.',
          features: [
            'Slow-cooked Dalma with pure Desi Ghee on woodfire',
            'Refreshing Pakhala Bhata with roasted seasonal greens (Saaga Bhaja)',
            'Warm authentic Chhena Poda caramelized in sal leaves',
            'Pure jaggery herbal teas & fresh tender coconut water',
          ],
          tag: 'Traditional Cuisine',
        },
        {
          title: 'Serene Rural Stay & Cultural Lifestyle',
          subtitle: 'Tranquil Verandas, Fresh Air & Starlit Gatherings',
          icon: 'Home',
          description:
            'Escape concrete chaos. Experience the serenity of rural life with welcoming verandas, morning peacocks and bird songs, handcrafted bamboo swings, and warm evening bonfire conversations under starry skies.',
          features: [
            'Spacious rustic farm verandas with natural cross-ventilation',
            'Terracotta pottery workshops & folk handicraft showcase',
            'Sunset birdwatching across our natural lotus pond',
            'Starlit open lawns with ambient fairy lights & full power backup',
          ],
          tag: 'Cultural Living',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FarmHouse || mongoose.model('FarmHouse', FarmHouseSchema);
