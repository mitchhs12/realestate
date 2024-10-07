import { languages, defaultLanguage } from "@/lib/validations";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

// Create the I18n middleware
const I18nMiddleware = createI18nMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
  // urlMappingStrategy: "rewrite",
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
