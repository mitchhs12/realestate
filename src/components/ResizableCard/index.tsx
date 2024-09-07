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
import { Button } from "@/components/ui/button";
import { getCountryNameForLocale } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useTheme } from "next-themes";
import { Eye, EyeOff } from "lucide-react";
import { changeHomeVisibility } from "@/app/[locale]/my-properties/actions";

interface TypeObject {
  id: string;
  name: string;
  translation: string;
}

interface Props {
  home: HomeType | null;
  finishSelling?: string;
  incompleteListing?: string;
  isLoading?: boolean;
  types: TypeObject[];
  loginToViewPrice?: string;
  userId?: string;
}

export default function ResizableCard({
  home,
  finishSelling,
  incompleteListing,
  isLoading,
  types,
  loginToViewPrice,
}: Props) {
  const { defaultCurrency, defaultLanguage } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { isSmallScreen, user, session } = useContext(QueryContext);
  const [currentType, setCurrentType] = useState<TypeObject | null>(types[0]);
  const [index, setIndex] = useState(0);
  const { resolvedTheme: theme } = useTheme();

  const target = isSmallScreen ? "_self" : "_blank";

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  useEffect(() => {
    if (types.length > 0) {
      setCurrentType(types[0]);
    } else {
      setCurrentType(null);
    }
  }, [types]);

  const iso = home && home.country && lookup.byIso(home.country);
  const countryName =
    iso && typeof iso !== "string"
      ? getCountryNameForLocale(iso.iso2, defaultLanguage || home.country || "")
      : home?.country;

  const IconComponent = currentType ? typeIcons[currentType?.id as keyof typeof typeIcons] : null; // Get the corresponding icon

  return !home || isLoading ? (
    <div className="flex flex-col h-full w-full space-y-2">
      <Skeleton className="rounded-none rounded-t-xl h-[200px] w-full" />
      <div className="flex flex-col justify-center items-center w-full gap-3 px-2 pb-3">
        <Skeleton className="h-5 sm:h-5 lg:h-6 w-32" />
        <Skeleton className="h-4 sm:h-4 lg:h-5 w-24" />
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
      <ResizableCarousel home={home} hovering={titleUnderlined} />
      <Link href={home.isComplete ? `/homes/${home.id}` : "/sell"} target={target}>
        <div className="flex flex-col justify-center items-center w-full gap-2 px-2 relative">
          <div className="flex items-center justify-center gap-2 w-full">
            {/* {IconComponent && (
              <Button
                variant={types.length > 1 ? "outline" : "ghost"}
                disabled={types.length > 1 ? false : true}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newIndex = (index + 1) % types.length;
                  setIndex(newIndex);
                  setCurrentType(types[newIndex]);
                }}
                size={"icon"}
                className="flex"
              >
                <IconComponent color={theme === "dark" ? "white" : "black"} width={40} height={40} />
              </Button>
            )} */}
            <h2
              className={`text-md md:text-lg lg:text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis text-center ${
                titleUnderlined ? "underline" : ""
              }`}
            >
              {home.isComplete
                ? types.length > 1
                  ? currentType?.translation
                  : types.length > 0 && types[0].translation
                : finishSelling}
            </h2>
          </div>

          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.municipality ? home.municipality : "-"}
          </div>
          {/* <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.region}
          </div> */}
          <div className="flex text-center gap-2 items-center text-sm sm:text-sm lg:text-md">
            {home.country ? countryName : "-"}
            {home.country && (
              <FlagComponent country={lookup.byIso(home.country)?.iso2 as Country} countryName={home.country} />
            )}
          </div>
          <div className="mb-2">
            {session.status === "loading" ? (
              <Skeleton className="h-4 sm:h-5 lg:h-7 w-28 mb-2" />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <BrokenPrice
                      incompleteListing={incompleteListing}
                      home={home}
                      newCurrencySymbol={defaultCurrency.symbol}
                      newCurrencyUsdPrice={defaultCurrency.usdPrice}
                      reveal={user ? true : false}
                      blurAmount="blur-sm"
                      className="text-sm md:text-md lg:text-lg"
                    />
                  </TooltipTrigger>
                  {!user && (
                    <TooltipContent>
                      <p>{loginToViewPrice}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </Link>

      {IconComponent && (
        <Button
          variant={types.length > 1 ? "outline" : "ghost"}
          disabled={types.length > 1 ? false : true}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const newIndex = (index + 1) % types.length;
            setIndex(newIndex);
            setCurrentType(types[newIndex]);
          }}
          size={"icon"}
          className="absolute bottom-2 left-2"
        >
          <IconComponent color={theme === "dark" ? "white" : "black"} width={40} height={40} />
        </Button>
      )}
      {home.isComplete && user?.id === home.ownerId && (
        <Button
          variant={home.isActive ? "default" : "destructive"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            changeHomeVisibility(home.id, home.isActive);
          }}
          size={"icon"}
          className="absolute bottom-2 right-2"
        >
          {home.isActive ? <Eye /> : <EyeOff />}
        </Button>
      )}
      {/* <div className="absolute items-center justify-center bottom-2 left-2"></div> */}
    </div>
  );
}
