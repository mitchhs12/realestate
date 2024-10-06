import type { MetadataRoute } from "next";
import { languages } from "../lib/validations"; // Assuming this is an array like ['es', 'en', 'fr']
import { getAllArticleSlugs } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = "https://www.vivaideal.com";
  let routes = [
    "/articles",
    "/data",
    "/client",
    "/homes",
    "/legal",
    "/legal/terms-and-conditions",
    "/legal/privacy-policy",
    "/my-properties",
    "/my-wishlists",
    "/search",
    "/sell",
    "/settings",
  ];

  // Fetch all articles from Sanity
  const articles = await getAllArticleSlugs();

  routes = routes.concat(articles.map((article: any) => `/articles/${article.slug}`));

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

  const links = [
    {
      url: url,
      lastModified: new Date(),
      alternates: createAlternates(""), // No route, just the base URL
    },
    ...routes.map((route) => ({
      url: `${url}${route}`,
      lastModified: new Date(),
      alternates: createAlternates(route),
    })),
  ];

  return links;
}
