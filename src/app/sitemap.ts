import type { MetadataRoute } from "next";
import { languages, LanguageType } from "@/lib/validations"; // Assuming this is an array like ['es', 'en', 'fr']
import { getAllArticleSlugs } from "@/lib/sanity";
import { getAllHomeIds } from "./[locale]/search/actions";
import { getLanguageAlternates } from "@/lib/utils";

const baseUrl = "https://www.vivaideal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let routes = [
    "/about",
    "/articles",
    "/data",
    "/legal",
    "/legal/terms-and-conditions",
    "/legal/privacy-policy",
    "/my-properties",
    "/my-wishlists",
    "/search",
    "/sell",
    "/pricing",
    "/settings",
  ];

  // Fetch all articles from Sanity
  const articles = await getAllArticleSlugs();
  routes = routes.concat(articles.map((article: any) => `/articles/${article.slug}`));

  // Fetch all properties from Prisma
  const homeIds = await getAllHomeIds();
  routes = routes.concat(homeIds.map((id: number) => `/homes/${id}`));

  const createAlternates = (currentLang: LanguageType, route?: string) => {
    return {
      languages: getLanguageAlternates(currentLang, route),
    };
  };

  // Create links for each language and route combination
  const links = [
    // Base URLs for each language
    ...languages.map((lang) => ({
      url: `${baseUrl}/${lang}`, // Base URL for each language
      lastModified: new Date(),
      alternates: createAlternates(lang),
    })),

    // URLs for each route in each language
    ...languages.flatMap((lang) => {
      return routes.map((route) => ({
        url: `${baseUrl}/${lang}${route}`, // Language-specific URL for each route
        lastModified: new Date(),
        alternates: createAlternates(lang, route),
      }));
    }),
  ];

  return links;
}
