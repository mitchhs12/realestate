"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType } from "@/lib/validations";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { useState } from "react";
import Link from "next/link";
import lookup from "country-code-lookup";
import ResizableCarousel from "@/components/ResizableCarousel";
import { QueryContext } from "@/context/QueryContext";
import BrokenPrice from "@/components/BrokenPrice";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountryNameForLocale } from "@/lib/utils";

interface Props {
  home: HomeType | null;
  isLoading?: boolean;
  types: { id: string; translation: string }[];
}

export default function ResizableCard({ home, isLoading, types }: Props) {
  const { defaultCurrency, defaultLanguage } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { isSmallScreen, user, session } = useContext(QueryContext);
  const [currentType, setCurrentType] = useState(
    types.length > 0 ? types[0].translation : home ? home.type[0] : "Unknown Type"
  );
  const [index, setIndex] = useState(0);

  const target = isSmallScreen ? "_self" : "_blank";

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  const iso = home && home.country && lookup.byIso(home.country);
  const countryName =
    iso && typeof iso !== "string"
      ? getCountryNameForLocale(iso.iso2, defaultLanguage || home.country || "")
      : home?.country;

  return !home || isLoading ? (
    <div className="flex flex-col h-full w-full space-y-2">
      <Skeleton className="rounded-none rounded-t-xl h-[200px] w-full" />
      <div className="flex flex-col justify-center items-center w-full gap-3 px-2 pb-3">
        <Skeleton className="h-5 sm:h-5 lg:h-6 w-32" />
        <Skeleton className="h-4 sm:h-4 lg:h-5 w-24" />
        <Skeleton className="h-4 sm:h-3 lg:h-4 w-24" />
        <Skeleton className="h-4 sm:h-3 lg:h-5 w-28" />
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-36 font-semibold" />
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col h-full w-full space-y-2 relative"
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      <ResizableCarousel home={home} />
      <Link href={`/homes/${home.id}`} target={target}>
        <div className="flex flex-col justify-center items-center w-full gap-2 px-2 relative">
          <div className="w-full flex flex-col justify-center items-center">
            <h2
              className={`w-full flex-grow max-w-full text-md md:text-lg lg:text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis text-center ${
                titleUnderlined ? "underline" : ""
              }`}
            >
              {types.length > 1 ? currentType : types[0]?.translation || home.type[0] || "Unknown Type"}
            </h2>
          </div>

          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.municipality}
          </div>
          {/* <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.region}
          </div> */}
          <div className="flex text-center gap-2 items-center text-sm sm:text-sm lg:text-md">
            {countryName}
            {home.country && (
              <FlagComponent country={lookup.byIso(home.country)?.iso2 as Country} countryName={home.country} />
            )}
          </div>
          <div className="mb-2">
            {session.status === "loading" ? (
              <Skeleton className="h-4 sm:h-5 lg:h-7 w-28 mb-2" />
            ) : (
              <BrokenPrice
                home={home}
                newCurrencySymbol={defaultCurrency.symbol}
                newCurrencyUsdPrice={defaultCurrency.usdPrice}
                reveal={user ? true : false}
                blurAmount="blur-sm"
                className="text-sm md:text-md lg:text-lg"
              />
            )}
          </div>
        </div>
      </Link>
      {types.length > 1 && (
        <Button
          className="absolute bottom-2 right-2"
          variant={"outline"}
          size={"icon"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const newIndex = (index + 1) % types.length;
            setIndex(newIndex);
            setCurrentType(types[newIndex].translation);
          }}
        >
          <ArrowUpDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
