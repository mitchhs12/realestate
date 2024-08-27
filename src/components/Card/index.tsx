"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType } from "@/lib/validations";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import Link from "next/link";
import lookup from "country-code-lookup";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import BrokenPrice from "@/components/BrokenPrice";

interface Props {
  home: HomeType | null;
  isLoading?: boolean;
}

export default function Card({ home, isLoading }: Props) {
  const { defaultCurrency } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { isSmallScreen, session, user } = useContext(QueryContext);

  const target = isSmallScreen ? "_self" : "_blank";

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  return !home || isLoading ? (
    <div className="flex flex-col h-84 w-44 md:w-52 xl:w-48 2xl:w-52 space-y-2">
      <Skeleton className="rounded-none rounded-t-lg h-40 w-full" />
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
      className="flex flex-col h-84 w-44 md:w-52 xl:w-48 2xl:w-52"
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      <Carousel>
        <CarouselContent className="rounded-t-lg">
          {home.photos.map((photo: string, index) => (
            <div key={index}>
              <Link href={`/homes/${home.id}`} target={target}>
                <CarouselItem className="flex relative justify-center items-center rounded-t-lg">
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
        <div className="flex flex-col justify-center items-center w-full gap-2 px-2 bg-background pt-2">
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
          <div>
            {session.status === "loading" ? (
              <Skeleton className="h-4 sm:h-5 lg:h-7 w-28 mb-2" />
            ) : (
              <BrokenPrice
                home={home}
                newCurrencySymbol={defaultCurrency.symbol}
                newCurrencyUsdPrice={defaultCurrency.usdPrice}
                reveal={user ? true : false}
                blurAmount={"blur-sm"}
                className="text-sm md:text-md lg:text-lg"
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
