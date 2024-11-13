import type { MetadataRoute } from "next";
import { languages } from "../lib/validations"; // Assuming this is an array like ['es', 'en', 'fr']
import { getAllArticleSlugs } from "@/lib/sanity";
import { getAllHomeIds } from "./[locale]/search/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = "https://www.vivaideal.com";
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
    "/start",
    "/settings",
  ];

  // Fetch all articles from Sanity
  const articles = await getAllArticleSlugs();
  routes = routes.concat(articles.map((article: any) => `/articles/${article.slug}`));

  // Fetch all properties from Prisma
  const homeIds = await getAllHomeIds();
  routes = routes.concat(homeIds.map((id: number) => `/homes/${id}`));

  // Helper function to dynamically create alternates in the expected format
  const createAlternates = (route: string) => {
    return {
      languages: languages.reduce(
        (acc, lang) => {
          acc[lang] = `${url}/${lang}${route}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    };
  };

  // Create links for each language and route combination
  const links = [
    // Non-localized URLs (without language suffix)
    ...routes.map((route) => ({
      url: `${url}${route}`, // Non-localized base URL
      lastModified: new Date(),
      alternates: createAlternates(route),
    })),

    // Base URLs for each language
    ...languages.map((lang) => ({
      url: `${url}/${lang}`, // Base URL for each language
      lastModified: new Date(),
      alternates: createAlternates(""),
    })),

    // URLs for each route in each language
    ...languages.flatMap((lang) => {
      return routes.map((route) => ({
        url: `${url}/${lang}${route}`, // Language-specific URL for each route
        lastModified: new Date(),
        alternates: createAlternates(route),
      }));
    }),
  ];
  console.log("links", links[0]);

  console.log("links", links[0].alternates);

  return links;
}
