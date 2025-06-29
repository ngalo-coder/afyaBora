import Constants from 'expo-constants';

// ERPNext Configuration
export const ERPNEXT_URL = Constants.expoConfig?.extra?.ERPNEXT_URL || process.env.EXPO_PUBLIC_ERPNEXT_URL;
export const ERPNEXT_API_KEY = Constants.expoConfig?.extra?.ERPNEXT_API_KEY || process.env.EXPO_PUBLIC_ERPNEXT_API_KEY;
export const ERPNEXT_API_SECRET = Constants.expoConfig?.extra?.ERPNEXT_API_SECRET || process.env.EXPO_PUBLIC_ERPNEXT_API_SECRET;

// M-Pesa Configuration (Kenya)
export const MPESA_CONSUMER_KEY = Constants.expoConfig?.extra?.MPESA_CONSUMER_KEY || process.env.EXPO_PUBLIC_MPESA_CONSUMER_KEY;
export const MPESA_CONSUMER_SECRET = Constants.expoConfig?.extra?.MPESA_CONSUMER_SECRET || process.env.EXPO_PUBLIC_MPESA_CONSUMER_SECRET;
export const MPESA_SHORTCODE = Constants.expoConfig?.extra?.MPESA_SHORTCODE || process.env.EXPO_PUBLIC_MPESA_SHORTCODE;

// App Configuration
export const APP_NAME = Constants.expoConfig?.extra?.APP_NAME || process.env.EXPO_PUBLIC_APP_NAME;
export const APP_VERSION = Constants.expoConfig?.extra?.APP_VERSION || process.env.EXPO_PUBLIC_APP_VERSION;
export const ENVIRONMENT = Constants.expoConfig?.extra?.ENVIRONMENT || process.env.EXPO_PUBLIC_ENVIRONMENT;

// Firebase Configuration (for notifications)
export const FIREBASE_API_KEY = Constants.expoConfig?.extra?.FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
export const FIREBASE_PROJECT_ID = Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

// Sentry Configuration (for error tracking)
export const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN || process.env.EXPO_PUBLIC_SENTRY_DSN;
