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
