import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { locales, CurrencyType } from "./validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatPrice = (currency: string, value: number, decimals?: number): string => {
  const option = locales.find((option) => option.currency === currency);
  const locale = option?.locale || "US";
  const decimalsLimit = option?.decimalsLimit ?? 2;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: decimals || decimalsLimit,
  }).format(value);

  return formattedPrice;
};

export const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).filter((word) => word).length; // Count words
  const readingTimeMinutes = Math.ceil(words / wordsPerMinute); // Round up to the nearest minute
  return readingTimeMinutes;
};

export const getReadingTime = (portableText: any) => {
  const plainText = portableText
    .map((block: any) => {
      if (block._type === "block" && block.children) {
        return block.children.map((child: any) => child.text).join(" ");
      }
      return "";
    })
    .join(" ");

  const readingTime = calculateReadingTime(plainText);
  return readingTime;
};

export const formatBrokenPrice = (
  currency: string,
  value: number,
  decimals: number
): { symbol: string; number: string; symbolFirst: boolean } => {
  const option = locales.find((option) => option.currency === currency);
  const locale = option?.locale || "US";

  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: decimals,
  }).formatToParts(value);

  // Find the position of the currency symbol and the number
  const symbol = parts.find((part) => part.type === "currency")?.value || "";
  const number = parts
    .filter((part) => part.type !== "currency")
    .map((part) => part.value)
    .join("");

  // Determine if the symbol is before or after the number
  const symbolFirst = parts[0].type === "currency";

  return {
    symbol,
    number,
    symbolFirst,
  };
};

export const getCountryNameForLocale = (countryCode: string, locale: string) => {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  return displayNames.of(countryCode);
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
  const decimalsLimit = locales.find((option) => option.currency === symbol)?.decimalsLimit ?? 2;
  return { symbol: symbol, usdPrice: price, decimalsLimit: decimalsLimit };
};

export const formatNumber = (num: number | null, numerals: any) => {
  if (num === null) return "";
  if (isNaN(num)) return ""; // Handle cases where num is not a valid number
  return new Intl.NumberFormat(numerals).format(num);
};

export const handleCopy = (text: string, field: string, setCopiedField: (field: string | null) => void) => {
  navigator.clipboard.writeText(text);
  setCopiedField(field);
  setTimeout(() => setCopiedField(null), 2000); // Reset the copied state after 2 seconds
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const findMatching = (
  object: Array<{ id: string; name: string; translation: string }>,
  array: any,
  key: string
) => {
  if (!array) {
    return [];
  }

  return object.filter((item) => {
    if (Array.isArray(array[key])) {
      return array[key].includes(item.name);
    }
    return array[key] === item.id;
  });
};

export const findMatchingItem = (
  object: Array<{ id: string; translation: string }>,
  value: string | null | undefined
): { id: string; translation: string } | undefined => {
  return object.find((item) => item.id === value);
};

export type PhoneLocale = {
  ext: string;
  country: string;
  phone: string;
  [key: string]: string; // Add this line to allow any string key
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

export function getPath(headers: any) {
  const referer = headers["referer"] || "";
  const host = headers["host"] || "";

  // Extract the path by removing the protocol and host part from the referer
  if (referer.includes(host)) {
    return referer.split(host)[1] || "/";
  }

  // Fallback to root if the path cannot be determined
  return "/";
}

export const fetchTypeImage = () => {};

export const resizeImageToMinDimensions = async (
  file: File,
  minDimension: number,
  heightError: string,
  widthError: string
): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Failed to get canvas context"));
      }

      const { width, height } = img;

      // Check if either dimension is smaller than the minimum dimension
      console.log("minDimension", minDimension);
      width < minDimension && reject(new Error(widthError));
      height < minDimension && reject(new Error(heightError));

      // Scale down image while keeping the aspect ratio, until the smallest dimension is minDimension
      const scale = minDimension / Math.min(width, height);
      const targetWidth = width * scale;
      const targetHeight = height * scale;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Image resizing failed"));
          }
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        },
        file.type,
        1
      );
    };

    reader.readAsDataURL(file);
  });
};
