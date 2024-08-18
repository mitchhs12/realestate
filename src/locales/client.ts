"use client";

import { createI18nClient } from "next-international/client";

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  af: () => import("./dictionaries/af"),
  ar: () => import("./dictionaries/ar"),
  de: () => import("./dictionaries/de"),
  en: () => import("./dictionaries/en"),
  es: () => import("./dictionaries/es"),
  fr: () => import("./dictionaries/fr"),
  hr: () => import("./dictionaries/hr"),
  id: () => import("./dictionaries/id"),
  ja: () => import("./dictionaries/ja"),
  ka: () => import("./dictionaries/ka"),
  ko: () => import("./dictionaries/ko"),
  pt: () => import("./dictionaries/pt"),
  th: () => import("./dictionaries/th"),
  tr: () => import("./dictionaries/tr"),
  vi: () => import("./dictionaries/vi"),
  zh: () => import("./dictionaries/zh"),
});
