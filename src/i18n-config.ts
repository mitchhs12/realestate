import { defaultLanguage, languages } from "@/lib/validations";

export const i18n = {
  defaultLocale: defaultLanguage,
  locales: languages,
} as const;

export type Locale = (typeof i18n)["locales"][number];
