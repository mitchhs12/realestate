import { z } from "zod";
import { FeatureCollection, Point } from "geojson";

export const updateNameSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Cannot be empty"),
});

export const updateCurrencySchema = z.object({
  currency: z.string().min(1, "Cannot be empty"),
});

export const updateSettingsSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
  currency: z.string().min(1, "Cannot be empty"),
});

export const homeSchema = z.object({
  id: z.number().int(),
  ownerId: z.string().trim().min(1, "Cannot be empty"),
  title: z.string().trim().min(1).nullable(),
  description: z.string().trim().min(1).nullable(),
  address: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  subRegion: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.array(z.string()),
  features: z.array(z.string()),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  livingrooms: z.number().int(),
  kitchens: z.number().int(),
  capacity: z.number().int(),
  photos: z.array(z.string()),
  price: z.number(),
  currency: z.string().nullable(),
  priceUsd: z.number(),
  priceNegotiable: z.boolean(),
  contactName: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  listingType: z.string().nullable(),
  areaSqm: z.number(),
  isActive: z.boolean(),
  listingFlowStep: z.number().min(0, "Cannot be empty"),
});

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type UpdateCurrencyValues = z.infer<typeof updateCurrencySchema>;
export type UpdateSettingsValues = z.infer<typeof updateSettingsSchema>;

export type HomeType = z.infer<typeof homeSchema>;

export type CoordinatesType = {
  long: number; // x coordinate
  lat: number; // y coordinate
};
export type BoundsType = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export type HomeFeatureProps = {
  name: string | null;
  address: string | null;
  description: string | null;
  type: string[];
  features: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingrooms: number;
  kitchens: number;
  capacity: number;
  photos: string[];
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

export type CurrencyType = {
  symbol: string;
  usdPrice: number | null;
};

export const currencyOptions: ReadonlyArray<{ locale: string; currency: string }> = [
  { locale: "en-US", currency: "USD" },
  { locale: "de-DE", currency: "EUR" },
  { locale: "en-GB", currency: "GBP" },
  { locale: "en-AU", currency: "AUD" },
  { locale: "ja-JP", currency: "JPY" },
  { locale: "fr-CH", currency: "CHF" },
  { locale: "en-IN", currency: "INR" },
  { locale: "es-CO", currency: "COP" },
  { locale: "es-MX", currency: "MXN" },
  { locale: "es-PE", currency: "PEN" },
  { locale: "en-CA", currency: "CAD" },
  { locale: "zh-CN", currency: "CNY" },
  { locale: "en-SG", currency: "SGD" },
  { locale: "ar-AE", currency: "AED" },
  { locale: "pt-BR", currency: "BRL" },
  { locale: "zh-HK", currency: "HKD" },
  { locale: "af-ZA", currency: "ZAR" },
  { locale: "ko-KR", currency: "KRW" },
  { locale: "en-NZ", currency: "NZD" },
  { locale: "tr-TR", currency: "TRY" },
  { locale: "th-TH", currency: "THB" },
  { locale: "id-ID", currency: "IDR" },
  { locale: "vi-VN", currency: "VND" },
  { locale: "es-CR", currency: "CRC" },
  { locale: "hr-HR", currency: "HRK" },
  { locale: "ka-GE", currency: "GEL" },
];

export type HomesGeoJson = FeatureCollection<Point, HomeFeatureProps>;
