import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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
  } catch (err) {
    console.warn(`Could not load ${filename}:`, err.message);
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const destinationMap = {
  sandhya:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624287/willy_nilly/destinations/sandhya-agro-farm-house.jpg',
  sangeeta:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624288/willy_nilly/destinations/sangeeta-grafting-nursery.jpg',
  allora:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624285/willy_nilly/destinations/allora-jungle-resort.jpg',
  circuit:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624289/willy_nilly/destinations/willy-nilly-agro-circuit.jpg',
  launching:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624289/willy_nilly/destinations/willy-nilly-agro-circuit.jpg',
  raghurajpur:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg',
  dhauli:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793425868/premium_photo-1754269420949-4989af0ba74c.avif',
  pipili:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793429126/willy_nilly/tourist_places/e72icevlouwmal5t0lsl.jpg',
  chilika:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793430591/village-pahad-jharna.jpg',
  konark:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793425868/premium_photo-1754269420949-4989af0ba74c.avif',
  chandaka:
    'https://res.cloudinary.com/aibkshp5/image/upload/v1793624285/willy_nilly/destinations/allora-jungle-resort.jpg',
};

async function updateDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const farmHouse = await db.collection('farmhouses').findOne();

  if (farmHouse) {
    console.log('Found farmHouse:', farmHouse._id);
    let updated = false;

    if (!farmHouse.heroImage || farmHouse.heroImage === '') {
      farmHouse.heroImage = destinationMap.sandhya;
      updated = true;
    }

    if (Array.isArray(farmHouse.touristPlaces)) {
      farmHouse.touristPlaces.forEach((p) => {
        const lower = (p.name || '').toLowerCase();
        for (const [key, url] of Object.entries(destinationMap)) {
          if (lower.includes(key)) {
            p.image = url;
            updated = true;
            console.log('Set image for', p.name, '->', url);
            break;
          }
        }
      });
    }

    if (updated) {
      await db.collection('farmhouses').updateOne(
        { _id: farmHouse._id },
        { $set: { heroImage: farmHouse.heroImage, touristPlaces: farmHouse.touristPlaces } }
      );
      console.log('Database updated successfully!');
    } else {
      console.log('All images were already up to date.');
    }
  } else {
    console.log('No farmHouse document found in database.');
  }

  await mongoose.disconnect();
}

updateDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
