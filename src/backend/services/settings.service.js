import connectDB from '../config/db.js';
import SiteSettings from '../../models/SiteSettings.js';
import FarmHouse from '../../models/FarmHouse.js';
import Resort from '../../models/Resort.js';
import AuditLog from '../../models/AuditLog.js';

export async function getOrCreateSiteSettings() {
  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

export async function getPublicSettings() {
  const settings = await getOrCreateSiteSettings();
  return {
    businessName: settings.businessName,
    tagline: settings.tagline,
    ownerName: settings.ownerName,
    ownerTitle: settings.ownerTitle,
    ownerBio: settings.ownerBio,
    ownerPhotoUrl: settings.ownerPhotoUrl,
    aboutStory: settings.aboutStory,
    vision: settings.vision,
    mission: settings.mission,
    highlights: settings.highlights,
    phonePrimary: settings.phonePrimary,
    phoneSecondary: settings.phoneSecondary,
    emailPrimary: settings.emailPrimary,
    address: settings.address,
    locationMapUrl: settings.locationMapUrl,
    businessHours: settings.businessHours,
    shopRentalActive: settings.shopRentalActive,
    theme: settings.theme,
    resortLaunchingText: settings.resortLaunchingText,
    socialLinks: settings.socialLinks,
  };
}

export async function updateSiteSettings(data, adminUser) {
  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'SITE_SETTINGS_UPDATE',
    targetModel: 'SiteSettings',
    targetId: settings._id.toString(),
    details: data,
  });

  return settings;
}

export async function getOrCreateFarmHouseContent() {
  await connectDB();
  let farmHouse = await FarmHouse.findOne();
  if (!farmHouse) {
    farmHouse = await FarmHouse.create({});
  } else {
    let needsSave = false;
    const defaults = new FarmHouse();

    // Clean any legacy dummy Unsplash or local destination images from images array
    if (Array.isArray(farmHouse.images) && farmHouse.images.length > 0) {
      const cleaned = farmHouse.images.filter(
        (url) => url && !url.includes('images.unsplash.com') && !url.includes('/images/destinations/')
      );
      if (cleaned.length !== farmHouse.images.length) {
        farmHouse.images = cleaned;
        needsSave = true;
      }
    }

    // Clean any legacy dummy images from touristPlaces
    if (Array.isArray(farmHouse.touristPlaces) && farmHouse.touristPlaces.length > 0) {
      farmHouse.touristPlaces.forEach((place) => {
        if (
          place.image &&
          (place.image.includes('images.unsplash.com') || place.image.includes('/images/destinations/'))
        ) {
          place.image = '';
          needsSave = true;
        }
      });
    }

    if (!farmHouse.touristPlaces || farmHouse.touristPlaces.length === 0) {
      farmHouse.touristPlaces = defaults.touristPlaces;
      needsSave = true;
    }
    if (!farmHouse.agroExperiences || farmHouse.agroExperiences.length === 0) {
      farmHouse.agroExperiences = defaults.agroExperiences;
      needsSave = true;
    }
    if (needsSave) {
      await farmHouse.save();
    }
  }
  return farmHouse;
}

export async function updateFarmHouseContent(data, adminUser) {
  await connectDB();
  let farmHouse = await FarmHouse.findOne();
  if (!farmHouse) {
    farmHouse = await FarmHouse.create(data);
  } else {
    Object.assign(farmHouse, data);
    await farmHouse.save();
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'FARM_HOUSE_UPDATE',
    targetModel: 'FarmHouse',
    targetId: farmHouse._id.toString(),
    details: data,
  });

  return farmHouse;
}

export async function getOrCreateResortContent() {
  await connectDB();
  let resort = await Resort.findOne();
  if (!resort) {
    resort = await Resort.create({});
  }
  return resort;
}

export async function updateResortContent(data, adminUser) {
  await connectDB();
  // Ensure bookingEnabled remains false in MVP
  const safeData = { ...data, bookingEnabled: false };
  let resort = await Resort.findOne();
  if (!resort) {
    resort = await Resort.create(safeData);
  } else {
    Object.assign(resort, safeData);
    await resort.save();
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'RESORT_UPDATE',
    targetModel: 'Resort',
    targetId: resort._id.toString(),
    details: safeData,
  });

  return resort;
}
