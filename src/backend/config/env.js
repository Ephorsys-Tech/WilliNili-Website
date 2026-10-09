import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/willy_nilly'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default('willy_nilly_dev_fallback_secret_key_1234567890'),
  SESSION_MAX_AGE_SECONDS: z.coerce.number().default(86400),
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().default(5),
  RATE_LIMIT_LOGIN_WINDOW_SECONDS: z.coerce.number().default(300),
  RATE_LIMIT_PUBLIC_MAX: z.coerce.number().default(50),
  RATE_LIMIT_PUBLIC_WINDOW_SECONDS: z.coerce.number().default(60),
  UPLOAD_MAX_BYTES: z.coerce.number().default(5242880),
  ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/webp'),
  NEXT_PUBLIC_DEFAULT_THEME: z.enum(['nature', 'luxury', 'earth', 'ocean']).default('nature'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV === 'production') {
  console.error('Invalid environment variables in production:', parsed.error.format());
  throw new Error('Invalid environment variables. Fix .env before running in production.');
}

export const env = parsed.success ? parsed.data : envSchema.parse({});
export default env;
