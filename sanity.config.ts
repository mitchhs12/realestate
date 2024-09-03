"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig, defineField } from "sanity";
import { structureTool } from "sanity/structure";
import { languageFilter } from "@sanity/language-filter";
import { languages } from "./src/sanity/schemaTypes/languages";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import Logo from "./src/components/ui/logo";
import { codeInput } from "@sanity/code-input";

const preparedLanguages = languages.map((lang) => ({
  id: lang.id,
  title: lang.title,
}));

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  icon: Logo,
  ignoreBrowserWarning: true,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    codeInput(),
    languageFilter({
      supportedLanguages: preparedLanguages,
      defaultLanguages: ["en"],
      documentTypes: ["article"],
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !enclosingType.name.startsWith("locale") || selectedLanguageIds.includes(member.name),
    }),
    internationalizedArray({
      buttonAddAll: false,
      languages: preparedLanguages,
      defaultLanguages: ["en"],
      fieldTypes: [
        defineField({
          name: "localizedBlockContent",
          type: "array",
          of: [{ type: "block" }, { type: "image", options: { hotspot: true } }, { type: "code" }],
        }),
      ],
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
