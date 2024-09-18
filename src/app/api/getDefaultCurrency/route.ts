import { NextResponse } from "next/server";
import { languages, locales, LanguageType } from "@/lib/validations";

export async function GET(request: Request) {
  const language = request.headers.get("x-vercel-ip-country");

  console.log("language header", language);

  // Get the matched currency for the detected locale
  const localeData = locales.find((option) => option.locale === language);
  const matchedCurrency = localeData?.currency || "USD";

  // Return detected locale and currency in the response
  return NextResponse.json({ currency: matchedCurrency }, { status: 200 });
}
