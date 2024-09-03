import { defineType } from "sanity";

const languageCodes = ["af", "ar", "de", "en", "es", "fr", "hr", "id", "ja", "ka", "ko", "pt", "th", "tr", "vi", "zh"];

export const languages = languageCodes.map((lang) => ({
  id: lang,
  title: new Intl.DisplayNames(["en"], { type: "language" }).of(lang) as string,
  isDefault: lang === "en",
}));

export const localeText = defineType({
  title: "Localized Text",
  name: "localeText",
  type: "object",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true },
    },
  ],
  fields: languages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
    fieldset: lang.isDefault ? undefined : "translations",
  })),
});

export const localeString = defineType({
  title: "Localized String",
  name: "localeString",
  type: "object",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true },
    },
  ],
  fields: languages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
    fieldset: lang.isDefault ? undefined : "translations",
  })),
});
