import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { locales, CurrencyType } from "@/lib/validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatPrice = (currency: string, value: number): string => {
  const option = locales.find((option) => option.currency === currency);
  const locale = option?.locale || "en-US";
  const decimals = 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const getFullCountryName = (locale: string) => {
  const countryCode = locale.split("-")[1];
  return new Intl.DisplayNames([locale], { type: "region" }).of(countryCode);
};

export const getFullLanguageName = (language: string) => {
  return new Intl.DisplayNames([language], { type: "language" }).of(language);
};

export const getFlagEmoji = (countryCode: string) => {
  return countryCode.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

export const getCurrency = (currencies: CurrencyType[], symbol: string): CurrencyType => {
  const price = currencies.find((currency) => currency.symbol === symbol)?.usdPrice || 1;
  return { symbol: symbol, usdPrice: price };
};

export const formatNumber = (num: number, numerals: any) => {
  return new Intl.NumberFormat(numerals).format(num);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function getPhoneLocale(currentLocale: string) {
  let localeModule;

  switch (currentLocale) {
    case "af":
      localeModule = await import("@/locales/countries/af");
      break;
    case "ar":
      localeModule = await import("@/locales/countries/ar");
      break;
    case "de":
      localeModule = await import("@/locales/countries/de");
      break;
    case "es":
      localeModule = await import("@/locales/countries/es");
      break;
    case "fr":
      localeModule = await import("@/locales/countries/fr");
      break;
    case "hr":
      localeModule = await import("@/locales/countries/hr");
      break;
    case "id":
      localeModule = await import("@/locales/countries/id");
      break;
    case "ja":
      localeModule = await import("@/locales/countries/ja");
      break;
    case "ka":
      localeModule = await import("@/locales/countries/ka");
      break;
    case "ko":
      localeModule = await import("@/locales/countries/ko");
      break;
    case "pt":
      localeModule = await import("@/locales/countries/pt");
      break;
    case "th":
      localeModule = await import("@/locales/countries/th");
      break;
    case "tr":
      localeModule = await import("@/locales/countries/tr");
      break;
    case "vi":
      localeModule = await import("@/locales/countries/vi");
      break;
    case "zh":
      localeModule = await import("@/locales/countries/zh");
      break;
    default:
      localeModule = await import("@/locales/countries/en"); // Default to English
  }

  // Return the object as it is, since it's already structured correctly.
  return localeModule.default;
}
