import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../logging/logger.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const uri = process.env.MONGODB_URI || env.MONGODB_URI;

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      logger.info('MongoDB connected successfully');
      return m;
    }).catch(async (err) => {
      logger.warn('Initial MongoDB connection failed. Checking test/memory fallback...', { error: err.message });
      // In test or offline development, if MongoMemoryServer is requested or available
      if (process.env.NODE_ENV === 'test' || process.env.ENABLE_IN_MEMORY_DB === 'true') {
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          if (!global.__MONGO_MEM_SERVER__) {
            global.__MONGO_MEM_SERVER__ = await MongoMemoryServer.create();
          }
          const memUri = global.__MONGO_MEM_SERVER__.getUri();
          logger.info('Connected to In-Memory MongoDB for testing/fallback');
          return mongoose.connect(memUri, opts);
        } catch (memErr) {
          logger.error('Failed to start in-memory Mongo server', { error: memErr.message });
          throw err;
        }
      }
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export default connectDB;
