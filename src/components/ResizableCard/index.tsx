import { Skeleton } from "@/components/ui/skeleton";
import { HomeType } from "@/lib/validations";
import { formatPrice, getFlagEmoji } from "@/lib/utils";
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

interface Props {
  home: HomeType | null;
  isLoading?: boolean;
}

export default function ResizableCard({ home, isLoading }: Props) {
  const { defaultCurrency } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { isSmallScreen, user, session } = useContext(QueryContext);

  const target = isSmallScreen ? "_self" : "_blank";

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  return !home || isLoading ? (
    <div className="flex flex-col h-full w-full space-y-2">
      <Skeleton className="rounded-none rounded-t-xl h-40 w-full" />
      <div className="flex flex-col justify-center items-center w-full gap-3 px-2 pb-3">
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-32" />
        <Skeleton className="h-4 sm:h-4 lg:h-4 w-24" />
        <Skeleton className="h-3 sm:h-3 lg:h-4 w-24" />
        <Skeleton className="h-3 sm:h-3 lg:h-4 w-28" />
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-36 font-semibold" />
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col h-full w-full space-y-2"
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      <ResizableCarousel home={home} />
      <Link href={`/homes/${home.id}`} target={target}>
        <div className="flex flex-col justify-center items-center w-full gap-2 px-2">
          <div className={`w-full flex ${home.title && home.title.length > 20 ? "justify-start" : "justify-center"}`}>
            <h2
              className={`text-sm md:text-md lg:text-lg xl:text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis ${
                titleUnderlined && "underline"
              }`}
              lang={lang}
            >
              {home.title}
            </h2>
          </div>

          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.municipality}
          </div>
          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.region}
          </div>
          <div className="flex text-center gap-2 items-center text-sm sm:text-sm lg:text-md">
            {home.country && lookup.byIso(home.country)?.country}{" "}
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
    </div>
  );
}
