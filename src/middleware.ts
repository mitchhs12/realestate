import { languages, defaultLanguage } from "@/lib/validations";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
  urlMappingStrategy: "rewrite",
});

export function middleware(request: NextRequest) {
  // Use custom headers to pass the locale and currency to the server-side
  const response = I18nMiddleware(request);
  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|[^/]+/studio).*)"],
};
