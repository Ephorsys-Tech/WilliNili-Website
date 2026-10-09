import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import SiteSettings from '../../src/models/SiteSettings.js';
import ShopRental from '../../src/models/ShopRental.js';
import {
  listPublicShops,
  toggleModuleActivation,
  createShop,
} from '../../src/backend/services/shopRental.service.js';
import { createEnquiry } from '../../src/backend/services/enquiry.service.js';
import { NotFoundError, ForbiddenError } from '../../src/backend/errors/AppError.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);

  // Initialize SiteSettings with shopRentalActive: false (PRD default)
  await SiteSettings.create({
    businessName: 'Willy Nilly',
    shopRentalActive: false,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Shop Rental Module Activation Guard (PRD Business Rule 8 & 10)', () => {
  const adminUser = {
    id: new mongoose.Types.ObjectId().toString(),
    email: 'admin@willynilly.in',
    role: 'superadmin',
  };

  it('rejects public shop listing queries with NotFoundError when module is inactive', async () => {
    // When inactive, service must block public queries
    await expect(listPublicShops()).rejects.toThrow(NotFoundError);
  });

  it('rejects public shop rental enquiries with ForbiddenError when module is inactive', async () => {
    const enquiryPayload = {
      enquiryType: 'ShopRental',
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      mobile: '+91 9876543210',
      message: 'Interested in commercial shop leasing',
    };

    await expect(createEnquiry(enquiryPayload)).rejects.toThrow(ForbiddenError);
  });

  it('allows administrator to create a shop record while module is inactive', async () => {
    const shop = await createShop(
      {
        title: 'Craft & Agro Tools Store',
        shopNumber: 'S-01',
        sizeSqFt: 300,
        rentAmount: 14000,
        rentPeriod: 'Monthly',
        location: 'Entrance Arcade',
        description: 'Commercial shop unit ready for lease.',
        facilities: ['Shutter Door', 'Electricity'],
        isAvailable: true,
      },
      adminUser
    );

    expect(shop._id).toBeDefined();
    expect(shop.shopNumber).toBe('S-01');
  });

  it('activates the module via administrator action and exposes public listings', async () => {
    await toggleModuleActivation(true, adminUser);

    const publicListings = await listPublicShops();
    expect(Array.isArray(publicListings)).toBe(true);
    expect(publicListings.length).toBeGreaterThanOrEqual(1);
    expect(publicListings[0].title).toBe('Craft & Agro Tools Store');
  });

  it('allows public enquiry submission when module is activated', async () => {
    const shop = await ShopRental.findOne();
    const enquiryPayload = {
      enquiryType: 'ShopRental',
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      mobile: '+91 9876543210',
      message: 'Requesting walkthrough for commercial shop leasing',
      shop: shop._id.toString(),
    };

    const res = await createEnquiry(enquiryPayload);
    expect(res.reference).toMatch(/^WN-ENQ-/);
    expect(res.enquiryType).toBe('ShopRental');
  });

  it('deactivates the module and immediately reinstates 404 blocking', async () => {
    await toggleModuleActivation(false, adminUser);

    // Should immediately block public listings again
    await expect(listPublicShops()).rejects.toThrow(NotFoundError);
  });
});
