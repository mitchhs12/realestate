import type { MetadataRoute } from "next";
import { languages } from "../lib/validations"; // Assuming this is an array like ['es', 'en', 'fr']

export default function sitemap(): MetadataRoute.Sitemap {
  const url = "https://www.vivaideal.com";
  const routes = ["/articles", "/client", "/homes", "/legal", "/my-properties", "/search", "/sell", "/settings"];

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
