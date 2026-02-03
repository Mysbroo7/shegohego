// Global Configuration for Shego and Hego
// Supports multiple languages, currencies, and regions

export const SUPPORTED_LANGUAGES = {
  ar: { name: 'العربية', nativeName: 'العربية', rtl: true },
  en: { name: 'English', nativeName: 'English', rtl: false },
  es: { name: 'Español', nativeName: 'Español', rtl: false },
  fr: { name: 'Français', nativeName: 'Français', rtl: false },
  de: { name: 'Deutsch', nativeName: 'Deutsch', rtl: false },
  it: { name: 'Italiano', nativeName: 'Italiano', rtl: false },
  pt: { name: 'Português', nativeName: 'Português', rtl: false },
  ru: { name: 'Русский', nativeName: 'Русский', rtl: false },
  ja: { name: '日本語', nativeName: '日本語', rtl: false },
  zh: { name: '中文', nativeName: '中文', rtl: false },
  ko: { name: '한국어', nativeName: '한국어', rtl: false },
  hi: { name: 'हिन्दी', nativeName: 'हिन्दी', rtl: false },
  tr: { name: 'Türkçe', nativeName: 'Türkçe', rtl: false },
  th: { name: 'ไทย', nativeName: 'ไทย', rtl: false },
  id: { name: 'Bahasa Indonesia', nativeName: 'Bahasa Indonesia', rtl: false },
};

export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', countries: ['US', 'CA', 'AU'] },
  EUR: { symbol: '€', name: 'Euro', countries: ['DE', 'FR', 'IT', 'ES'] },
  GBP: { symbol: '£', name: 'British Pound', countries: ['GB', 'IE'] },
  JPY: { symbol: '¥', name: 'Japanese Yen', countries: ['JP'] },
  CNY: { symbol: '¥', name: 'Chinese Yuan', countries: ['CN'] },
  INR: { symbol: '₹', name: 'Indian Rupee', countries: ['IN'] },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', countries: ['AE'] },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', countries: ['SA'] },
  EGP: { symbol: 'ج.م', name: 'Egyptian Pound', countries: ['EG'] },
  AUD: { symbol: 'A$', name: 'Australian Dollar', countries: ['AU'] },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', countries: ['CA'] },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', countries: ['CH'] },
  SEK: { symbol: 'kr', name: 'Swedish Krona', countries: ['SE'] },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', countries: ['NO'] },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', countries: ['SG'] },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', countries: ['HK'] },
  MXN: { symbol: '$', name: 'Mexican Peso', countries: ['MX'] },
  BRL: { symbol: 'R$', name: 'Brazilian Real', countries: ['BR'] },
  ZAR: { symbol: 'R', name: 'South African Rand', countries: ['ZA'] },
};

export const REGIONS = {
  MIDDLE_EAST: ['AE', 'SA', 'EG', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'YE', 'PS'],
  EUROPE: ['DE', 'FR', 'IT', 'ES', 'GB', 'IE', 'SE', 'NO', 'CH', 'AT', 'BE', 'NL'],
  ASIA: ['JP', 'CN', 'IN', 'SG', 'HK', 'TH', 'ID', 'MY', 'PH', 'VN', 'KR'],
  AMERICAS: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO'],
  AFRICA: ['ZA', 'NG', 'KE', 'GH', 'MA', 'TN'],
  OCEANIA: ['AU', 'NZ'],
};

export const COMPLIANCE = {
  GDPR: {
    regions: ['DE', 'FR', 'IT', 'ES', 'GB', 'IE', 'SE', 'NO', 'CH', 'AT', 'BE', 'NL'],
    requirements: ['data_privacy', 'user_consent', 'right_to_be_forgotten'],
  },
  CCPA: {
    regions: ['US'],
    requirements: ['data_privacy', 'user_consent', 'data_sale_opt_out'],
  },
  LGPD: {
    regions: ['BR'],
    requirements: ['data_privacy', 'user_consent'],
  },
};

export const THEME_COLORS = {
  primary: '#FF4444',      // Red
  secondary: '#FF8800',    // Orange
  accent: '#FFCC00',       // Yellow
  background: '#FFFFFF',
  darkBackground: '#1A1A1A',
  text: '#333333',
  lightText: '#666666',
  border: '#EEEEEE',
};

export const API_ENDPOINTS = {
  development: 'http://localhost:3000',
  production: 'https://api.shegoandhego.com',
  cdn: 'https://cdn.shegoandhego.com',
};

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const VIDEO_LIMITS = {
  maxDuration: 10 * 60, // 10 minutes in seconds
  maxFileSize: 500 * 1024 * 1024, // 500MB
  minDuration: 3, // 3 seconds
  supportedFormats: ['mp4', 'mov', 'avi', 'mkv'],
};

export const STORAGE_LIMITS = {
  freeUserStorage: 5 * 1024 * 1024 * 1024, // 5GB
  premiumUserStorage: 100 * 1024 * 1024 * 1024, // 100GB
};

export const RATE_LIMITS = {
  videosPerDay: 50,
  commentsPerHour: 100,
  messagesPerMinute: 30,
};
