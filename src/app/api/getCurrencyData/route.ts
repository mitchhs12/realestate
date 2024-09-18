import { NextResponse } from "next/server";
import { locales } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const currencySymbols = locales.map((option) => option.currency);
  const prices = await prisma.currencies.findMany({
    where: {
      symbol: {
        in: currencySymbols,
      },
    },
    select: {
      symbol: true,
      usdPrice: true,
    },
  });

  const language = request.headers.get("x-vercel-ip-country");

  // Get the matched currency for the detected locale
  const localeData = locales.find((option) => option.locale === language);
  const defaultCurrency = localeData?.currency || "USD";

  // Return detected locale and currency in the response
  return NextResponse.json({ prices: prices, defaultCurrency: defaultCurrency }, { status: 200 });
}
