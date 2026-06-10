import dotenv from 'dotenv';
import * as yup from 'yup';
import { logger } from '../utils/logger.js';

dotenv.config();

const envSchema = yup.object({
  PORT: yup.number().default(5000),
  NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).default('development'),
  
  // Database configuration
  DB_USER: yup.string().required('DB_USER is required'),
  DB_HOST: yup.string().required('DB_HOST is required'),
  DB_DATABASE: yup.string().required('DB_DATABASE is required'),
  DB_PASSWORD: yup.string().required('DB_PASSWORD is required'),
  DB_PORT: yup.number().default(5432),
  DATABASE_URL: yup.string().optional(),

  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: yup.string().required('CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: yup.string().required('CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: yup.string().required('CLOUDINARY_API_SECRET is required'),

  // Auth configuration
  JWT_SECRET: yup.string().required('JWT_SECRET is required'),
  JWT_EXPIRES_IN: yup.string().default('1d'),
  BCRYPT_SALT_ROUNDS: yup.number().default(10),
});

let validatedEnv: any;

try {
  validatedEnv = envSchema.validateSync(process.env, { abortEarly: false, stripUnknown: true });
} catch (error) {
  if (error instanceof yup.ValidationError) {
    logger.error('Configuration validation failed:', error.errors);
  } else {
    logger.error('Configuration validation failed with unknown error', error);
  }
  process.exit(1);
}

export const config = {
  port: validatedEnv.PORT,
  env: validatedEnv.NODE_ENV,
  db: {
    user: validatedEnv.DB_USER,
    host: validatedEnv.DB_HOST,
    database: validatedEnv.DB_DATABASE,
    password: validatedEnv.DB_PASSWORD,
    port: validatedEnv.DB_PORT,
    connectionString: validatedEnv.DATABASE_URL,
  },
  cloudinary: {
    cloudName: validatedEnv.CLOUDINARY_CLOUD_NAME,
    apiKey: validatedEnv.CLOUDINARY_API_KEY,
    apiSecret: validatedEnv.CLOUDINARY_API_SECRET,
  },
  auth: {
    jwtSecret: validatedEnv.JWT_SECRET,
    jwtExpiresIn: validatedEnv.JWT_EXPIRES_IN,
    saltRounds: validatedEnv.BCRYPT_SALT_ROUNDS,
  },
} as const;
