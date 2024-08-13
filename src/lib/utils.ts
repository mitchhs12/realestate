import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { currencyOptions } from "@/lib/validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatPrice = (currency: string, value: number): string => {
  const option = currencyOptions.find((option) => option.currency === currency);
  const locale = option?.locale || "en-US";
  const decimals = option?.decimalsLimit || 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: decimals,
  }).format(value);
};
