import { languages, defaultLanguage } from "@/lib/validations";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

// Set up rate limiting
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 s"),
});

// Create the I18n middleware
const I18nMiddleware = createI18nMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
  urlMappingStrategy: "rewrite",
});

// Combined middleware function
export async function middleware(request: NextRequest) {
  // Rate limiting logic
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // Internationalization logic
  const response = I18nMiddleware(request);
  return response;
}

// Configuration for matching routes
export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|[^/]+/studio).*)"],
};
