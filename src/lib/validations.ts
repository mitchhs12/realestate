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

export const currencyOptions: ReadonlyArray<{ locale: string; currency: string; decimalsLimit: number }> = [
  { locale: "en-US", currency: "USD", decimalsLimit: 2 },
  { locale: "de-DE", currency: "EUR", decimalsLimit: 2 },
  { locale: "en-GB", currency: "GBP", decimalsLimit: 2 },
  { locale: "en-AU", currency: "AUD", decimalsLimit: 2 },
  { locale: "ja-JP", currency: "JPY", decimalsLimit: 0 }, // Japanese Yen has no decimal places
  { locale: "fr-CH", currency: "CHF", decimalsLimit: 2 },
  { locale: "en-IN", currency: "INR", decimalsLimit: 2 },
  { locale: "es-CO", currency: "COP", decimalsLimit: 2 },
  { locale: "es-MX", currency: "MXN", decimalsLimit: 2 },
  { locale: "es-PE", currency: "PEN", decimalsLimit: 2 },
  { locale: "en-CA", currency: "CAD", decimalsLimit: 2 },
  { locale: "zh-CN", currency: "CNY", decimalsLimit: 2 },
  { locale: "en-SG", currency: "SGD", decimalsLimit: 2 },
  { locale: "ar-AE", currency: "AED", decimalsLimit: 2 },
  { locale: "pt-BR", currency: "BRL", decimalsLimit: 2 },
  { locale: "zh-HK", currency: "HKD", decimalsLimit: 2 },
  { locale: "af-ZA", currency: "ZAR", decimalsLimit: 2 },
  { locale: "ko-KR", currency: "KRW", decimalsLimit: 0 }, // South Korean Won has no decimal places
  { locale: "en-NZ", currency: "NZD", decimalsLimit: 2 },
  { locale: "tr-TR", currency: "TRY", decimalsLimit: 2 },
  { locale: "th-TH", currency: "THB", decimalsLimit: 2 },
  { locale: "id-ID", currency: "IDR", decimalsLimit: 0 }, // Indonesian Rupiah has no decimal places
  { locale: "vi-VN", currency: "VND", decimalsLimit: 0 }, // Vietnamese Dong has no decimal places
  { locale: "es-CR", currency: "CRC", decimalsLimit: 2 },
  { locale: "hr-HR", currency: "HRK", decimalsLimit: 2 },
  { locale: "ka-GE", currency: "GEL", decimalsLimit: 2 },
];

export type HomesGeoJson = FeatureCollection<Point, HomeFeatureProps>;
