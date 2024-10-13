import { z } from "zod";
import { FeatureCollection, Point } from "geojson";
import {
  US,
  DE,
  GB,
  AU,
  JP,
  CH,
  IN,
  CO,
  MX,
  PE,
  CA,
  CN,
  SG,
  AE,
  BR,
  HK,
  ZA,
  KR,
  NZ,
  TR,
  TH,
  ID,
  VN,
  CR,
  HR,
  GE,
} from "country-flag-icons/react/3x2";

export const languages: LanguageType[] = [
  "af",
  "ar",
  "de",
  "en",
  "es",
  "fr",
  "hr",
  "id",
  "ja",
  "ka",
  "ko",
  "pt",
  "th",
  "tr",
  "vi",
  "zh",
];

export const languagesRequiringClientSideTranslation: LanguageType[] = ["ar", "ja", "ka", "ko", "th", "zh"];

export const updateNameSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Cannot be empty"),
});

export const updatePhoneSchema = z.object({
  phoneNumber: z.string().min(1, "Cannot be empty"),
});

export const updateCurrencySchema = z.object({
  currency: z.string().min(1, "Cannot be empty"),
});

export const updateLanguageSchema = z.object({
  language: z.enum(["af", "ar", "de", "en", "es", "fr", "hr", "id", "ja", "ka", "ko", "pt", "th", "tr", "vi", "zh"]),
});

export const updateSettingsSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
  currency: z.string().min(1, "Cannot be empty"),
  language: z.enum(["af", "ar", "de", "en", "es", "fr", "hr", "id", "ja", "ka", "ko", "pt", "th", "tr", "vi", "zh"]),
});

type CountryKey = "AR" | "MX" | "BR" | "CO" | "CL" | "EC" | "PE" | "UY";

interface CityInfo {
  folder: string;
  city: { id: string; translation: string };
  neighborhoods: { id: string; translation: string }[];
}

export type CountryProps = Record<CountryKey, CityInfo>;

export const locationImageIds = {
  AR: {
    folder: "argentina",
    city: "buenos-aires",
    neighborhoods: ["palermo", "recoleta", "belgrano"],
  },
  MX: {
    folder: "mexico",
    city: "mexico-city",
    neighborhoods: ["polanco", "condesa", "roma-norte"],
  },
  BR: {
    folder: "brazil",
    city: "rio-de-janeiro",
    neighborhoods: ["ipanema", "leblon", "barra-da-tijuca"],
  },
  CO: {
    folder: "colombia",
    city: "medellin",
    neighborhoods: ["el-poblado", "laureles"],
  },
  CL: {
    folder: "chile",
    city: "santiago",
    neighborhoods: ["providencia", "las-condes", "vitacura"],
  },
  EC: {
    folder: "ecuador",
    city: "quito",
    neighborhoods: ["la-floresta", "cumbaya", "gonzalez-suarez"],
  },
  PE: {
    folder: "peru",
    city: "lima",
    neighborhoods: ["miraflores", "san-isidro", "barranco"],
  },
  UY: {
    folder: "uruguay",
    city: "montevideo",
    neighborhoods: ["punta-carretas", "pocitos", "carrasco"],
  },
};

export const userFavoritesSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"), // Validates user ID
  homeId: z.number().int().positive("Home ID must be a positive integer"), // Validates home ID
  favoritedAt: z.date().optional(), // Optional favorited date; defaults to now()
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
  language: z.string().nullable(),
  priceUsd: z.number(),
  priceNegotiable: z.boolean(),
  contactName: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  listingType: z.string().nullable(),
  areaSqm: z.number(),
  isActive: z.boolean(),
  isComplete: z.boolean(),
  completedAt: z.date().nullable(),
  listingFlowStep: z.number().min(0, "Cannot be empty"),
});

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type UpdatePhoneValues = z.infer<typeof updatePhoneSchema>;
export type UpdateCurrencyValues = z.infer<typeof updateCurrencySchema>;
export type UpdateSettingsValues = z.infer<typeof updateSettingsSchema>;
export type UpdateLanguageValues = z.infer<typeof updateLanguageSchema>;
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
  id: number;
  name: string | null;
  address: string | null;
  description: string | null;
  type: string[];
  features: string[];
  price: number;
  priceUsd: number;
  currency: string | null;
  bedrooms: number;
  bathrooms: number;
  livingrooms: number;
  kitchens: number;
  capacity: number;
  photos: string[];
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  listingType: string | null;
  country: string | null;
};

export type CurrencyType = {
  symbol: string;
  usdPrice: number;
  decimalsLimit: number;
};

export const locales: ReadonlyArray<{
  locale: string;
  currency: string;
  decimalsLimit: number;
  language: string;
  flag: any;
}> = [
  { locale: "US", currency: "USD", decimalsLimit: 2, language: "en", flag: US },
  { locale: "DE", currency: "EUR", decimalsLimit: 2, language: "de", flag: DE },
  { locale: "GB", currency: "GBP", decimalsLimit: 2, language: "en", flag: GB },
  { locale: "AU", currency: "AUD", decimalsLimit: 2, language: "en", flag: AU },
  { locale: "JP", currency: "JPY", decimalsLimit: 0, language: "ja", flag: JP }, // Japanese Yen has no decimal places
  { locale: "CH", currency: "CHF", decimalsLimit: 2, language: "fr", flag: CH },
  { locale: "IN", currency: "INR", decimalsLimit: 2, language: "en", flag: IN },
  { locale: "CO", currency: "COP", decimalsLimit: 2, language: "es", flag: CO },
  { locale: "MX", currency: "MXN", decimalsLimit: 2, language: "es", flag: MX },
  { locale: "PE", currency: "PEN", decimalsLimit: 2, language: "es", flag: PE },
  { locale: "CA", currency: "CAD", decimalsLimit: 2, language: "en", flag: CA },
  { locale: "CN", currency: "CNY", decimalsLimit: 2, language: "zh", flag: CN },
  { locale: "SG", currency: "SGD", decimalsLimit: 2, language: "en", flag: SG },
  { locale: "AE", currency: "AED", decimalsLimit: 2, language: "ar", flag: AE },
  { locale: "BR", currency: "BRL", decimalsLimit: 2, language: "pt", flag: BR },
  { locale: "HK", currency: "HKD", decimalsLimit: 2, language: "zh", flag: HK },
  { locale: "ZA", currency: "ZAR", decimalsLimit: 2, language: "af", flag: ZA },
  { locale: "KR", currency: "KRW", decimalsLimit: 0, language: "ko", flag: KR }, // South Korean Won has no decimal places
  { locale: "NZ", currency: "NZD", decimalsLimit: 2, language: "en", flag: NZ },
  { locale: "TR", currency: "TRY", decimalsLimit: 2, language: "tr", flag: TR },
  { locale: "TH", currency: "THB", decimalsLimit: 2, language: "th", flag: TH },
  { locale: "ID", currency: "IDR", decimalsLimit: 0, language: "id", flag: ID }, // Indonesian Rupiah has no decimal places
  { locale: "VN", currency: "VND", decimalsLimit: 0, language: "vi", flag: VN }, // Vietnamese Dong has no decimal places
  { locale: "CR", currency: "CRC", decimalsLimit: 2, language: "es", flag: CR },
  { locale: "HR", currency: "HRK", decimalsLimit: 2, language: "hr", flag: HR },
  { locale: "GE", currency: "GEL", decimalsLimit: 2, language: "ka", flag: GE },
];

export const localeToFlagMap: { [key: string]: React.ComponentType } = {
  US: US,
  DE: DE,
  GB: GB,
  AU: AU,
  JP: JP,
  CH: CH,
  IN: IN,
  CO: CO,
  MX: MX,
  PE: PE,
  CA: CA,
  CN: CN,
  SG: SG,
  AE: AE,
  BR: BR,
  HK: HK,
  ZA: ZA,
  KR: KR,
  NZ: NZ,
  TR: TR,
  TH: TH,
  ID: ID,
  VN: VN,
  CR: CR,
  HR: HR,
  GE: GE,
};

export const languageToFlagMap = {
  af: "ZA", // South Africa
  ar: "SA", // Saudi Arabia
  de: "DE", // Germany
  en: "US", // United States (common for English)
  es: "ES", // Spain
  fr: "FR", // France
  hr: "HR", // Croatia
  id: "ID", // Indonesia
  ja: "JP", // Japan
  ka: "GE", // Georgia
  ko: "KR", // South Korea
  pt: "PT", // Portugal (or "BR" for Brazil)
  th: "TH", // Thailand
  tr: "TR", // Turkey
  vi: "VN", // Vietnam
  zh: "CN", // China
};

export const defaultLanguage = "en";
export const defaultCurrency = "USD";

export const sellGuides: string[] = [
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Brazil",
];

export const buyGuides: string[] = [
  "India",
  "South Korea",
  "Argentina",
  "Peru",
  "Colombia",
  "Venezuela",
  "Vietnam",
  "Indonesia",
  "New Zealand",
  "Cayman Islands",
];

export const numeralMap: { [key in LanguageType]: string } = {
  af: "af", // Afrikaans uses Arabic numerals
  ar: "ar-EG", // Arabic (Egypt) for Arabic numerals
  de: "de", // German uses Arabic numerals
  en: "en", // English uses Arabic numerals
  es: "es", // Spanish uses Arabic numerals
  fr: "fr", // French uses Arabic numerals
  hr: "hr", // Croatian uses Arabic numerals
  id: "id", // Indonesian uses Arabic numerals
  ja: "ja-JP", // Japanese with traditional Japanese numerals
  ka: "ka-GE", // Georgian numerals (though Arabic numerals are common)
  ko: "ko-KR", // Korean with traditional numerals
  pt: "pt", // Portuguese uses Arabic numerals
  th: "th-TH", // Thai numerals
  tr: "tr", // Turkish uses Arabic numerals
  vi: "vi", // Vietnamese uses Arabic numerals
  zh: "zh", // Chinese uses Arabic numerals
};

export type ArticleType = {
  localizedTitle: string;
  thumbnailDescription: string;
  currentSlug: string;
  thumbnailImage: any;
  _createdAt: string;
};

export type FullArticle = {
  localizedTitle: string;
  titleImage: any;
  content: any;
  currentSlug: string;
  author: {
    name: string;
    bio: string;
    image: any;
  };
};

export type TypeObject = {
  id: string;
  name: string;
  translation: string;
};

export type LanguageType =
  | "af"
  | "ar"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "hr"
  | "id"
  | "ja"
  | "ka"
  | "ko"
  | "pt"
  | "th"
  | "tr"
  | "vi"
  | "zh";
export type HomesGeoJson = FeatureCollection<Point, HomeFeatureProps>;
