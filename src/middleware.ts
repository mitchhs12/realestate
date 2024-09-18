import { languages, defaultLanguage, locales, LanguageType } from "@/lib/validations";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
  // urlMappingStrategy: "rewrite",
});

export function middleware(request: NextRequest) {
  // Get the "Accept-Language" header from the request
  const acceptLanguage = request.headers.get("Accept-Language");

  // Detect the preferred language from the Accept-Language header
  let detectedLocale = defaultLanguage;
  let matchedCurrency = "USD";

  if (acceptLanguage) {
    const language = acceptLanguage.split(",")[0]; // Primary language
    // Match the detected language with your supported locales
    detectedLocale = languages.includes(language as LanguageType) ? language : defaultLanguage;

    // Get the matched currency for the detected locale
    matchedCurrency = locales.find((option) => option.locale === detectedLocale)?.currency || "USD";
  }

  // Use custom headers to pass the locale and currency to the server-side
  const response = I18nMiddleware(request);
  response.headers.set("x-locale", detectedLocale);
  response.headers.set("x-currency", matchedCurrency);

  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|[^/]+/studio).*)"],
};
