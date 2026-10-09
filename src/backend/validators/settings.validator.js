import { z } from 'zod';

export const updateSiteSettingsSchema = z.object({
  businessName: z.string().trim().min(2).max(150).optional(),
  tagline: z.string().trim().max(200).optional(),
  ownerName: z.string().trim().min(2).max(100).optional(),
  ownerTitle: z.string().trim().max(100).optional(),
  ownerBio: z.string().trim().max(2000).optional(),
  ownerPhotoUrl: z.string().trim().optional(),
  aboutStory: z.string().trim().max(5000).optional(),
  vision: z.string().trim().max(2000).optional(),
  mission: z.string().trim().max(2000).optional(),
  highlights: z.array(z.string().trim()).optional(),
  phonePrimary: z.string().trim().max(30).optional(),
  phoneSecondary: z.string().trim().max(30).optional(),
  emailPrimary: z.string().trim().email().max(100).optional(),
  address: z.string().trim().max(300).optional(),
  locationMapUrl: z.string().trim().max(500).optional(),
  businessHours: z.string().trim().max(200).optional(),
  shopRentalActive: z.boolean().optional(),
  theme: z.enum(['nature', 'luxury', 'earth', 'ocean']).optional(),
  resortLaunchingText: z.string().trim().max(500).optional(),
  socialLinks: z
    .object({
      facebook: z.string().trim().optional(),
      instagram: z.string().trim().optional(),
      youtube: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
    })
    .optional(),
});

export const updateFarmHouseSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  propertyArea: z.string().trim().max(100).optional(),
  guestCapacity: z.string().trim().max(100).optional(),
  facilities: z.array(z.string().trim()).optional(),
  suitableEvents: z.array(z.string().trim()).optional(),
  images: z.array(z.string().trim()).optional(),
  locationGuide: z.string().trim().max(500).optional(),
});

export const updateResortSchema = z.object({
  resortName: z.string().trim().min(2).max(150).optional(),
  launchStatus: z.string().trim().max(100).optional(),
  launchMessage: z.string().trim().max(1000).optional(),
  conceptDescription: z.string().trim().max(5000).optional(),
  featuresPlanned: z.array(z.string().trim()).optional(),
  images: z.array(z.string().trim()).optional(),
  // Cannot enable booking in MVP
});
