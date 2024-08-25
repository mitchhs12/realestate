import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType, languageToFlagMap, locales } from "@/lib/validations";
import { formatPrice, getFlagEmoji } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import Link from "next/link";
import lookup from "country-code-lookup";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";

interface Props {
  home: HomeType | null;
  isLoading?: boolean;
}

export default function Card({ home, isLoading }: Props) {
  const { defaultCurrency } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { isSmallScreen } = useContext(QueryContext);

  const target = isSmallScreen ? "_self" : "_blank";

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  return !home || isLoading ? (
    <div className="flex flex-col h-84 w-44 md:w-52 xl:w-48 2xl:w-52 space-y-2">
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
      className="flex flex-col h-84 w-44 md:w-52 xl:w-48 2xl:w-52 space-y-2"
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      <Carousel>
        <CarouselContent className="rounded-t-xl">
          {home.photos.map((photo: string, index) => (
            <div key={index}>
              <Link href={`/homes/${home.id}`} target={target}>
                <CarouselItem className="flex relative justify-center items-center rounded-t-xl">
                  <div className="relative flex justify-center items-center h-40 w-44 md:w-52 xl:w-48 2xl:w-52 rounded-t-xl">
                    <Image
                      src={photo}
                      className="object-cover object-center rounded-t-lg"
                      alt={home.title!}
                      fill={true}
                      sizes={"(max-width: 500px), (max-height: 500px)"}
                    />
                  </div>
                </CarouselItem>
              </Link>
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8" />
        <CarouselNext className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8" />
      </Carousel>
      <Link href={`/homes/${home.id}`}>
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
            {home.country && lookup.byIso(home.country)?.country}
            {home.country && (
              <FlagComponent country={lookup.byIso(home.country)?.iso2 as Country} countryName={home.country} />
            )}
          </div>
          <div className="flex text-center text-sm md:text-md lg:text-lg font-semibold mb-2">
            {formatPrice(defaultCurrency.symbol, home.priceUsd * defaultCurrency.usdPrice, 0)}
          </div>
        </div>
      </Link>
    </div>
  );
}
