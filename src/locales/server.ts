import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
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
