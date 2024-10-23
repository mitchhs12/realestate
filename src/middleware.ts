import { languages, defaultLanguage } from "@/lib/validations";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";
import { LanguageType } from "@/lib/validations";

// Create the I18n middleware
const I18nMiddleware = createI18nMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
  urlMappingStrategy: "rewriteDefault",
  resolveLocaleFromRequest: (request: NextRequest) => {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");

    // Assuming the locale is the first path segment
    const locale = pathSegments[1] as LanguageType;

    // Check if the locale is valid
    if (languages.includes(locale)) {
      return locale;
    }

    // If locale isn't valid, fallback to the defaultLocale
    return defaultLanguage;
  },
});

// Combined middleware function
export async function middleware(request: NextRequest) {
  // Internationalization logic
  const response = I18nMiddleware(request);
  return response;
}

// Configuration for matching routes
export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|[^/]+/studio).*)"],
};
