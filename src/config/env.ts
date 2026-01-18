import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  ADMIN_EMAIL: required('ADMIN_EMAIL'),
  ADMIN_NAME: required('ADMIN_NAME'),
  MANAGER_EMAIL: required('MANAGER_EMAIL'),
  MANAGER_NAME: required('MANAGER_NAME'),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD'),
  MANAGER_PASSWORD: required('MANAGER_PASSWORD'),
};
