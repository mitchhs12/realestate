"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeatured, getNew } from "@/app/actions";
import { useState, useEffect, useContext } from "react";
import { HomeType } from "@/lib/validations";
import { iso31661 } from "iso-3166";
import Image from "next/image";
import { currencyOptions } from "@/lib/validations";
import { CurrencyContext } from "@/context/CurrencyContext";

interface Props {
  type: string;
}

const getDefaultHomesArray = () => {
  // Get the number of columns based on screen size
  if (window.matchMedia("(min-width: 1280px)").matches) {
    // Extra large screens: 6 columns
    return new Array(6).fill(null);
  } else if (window.matchMedia("(min-width: 1024px)").matches) {
    // Large screens: 4 columns
    return new Array(4).fill(null);
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    // Medium screens: 3 columns
    return new Array(3).fill(null);
  } else {
    // Small screens: 2 columns
    return new Array(4).fill(null);
  }
};

export default function Listings({ type }: Props) {
  const [homes, setHomes] = useState<(HomeType | null)[]>([]);
  const { defaultCurrency, currencies } = useContext(CurrencyContext);
  const currencyRate = currencies.find((currency) => currency.symbol === defaultCurrency)?.usdPrice || 1;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHomes(getDefaultHomesArray());
    }
  }, []);

  const formatPrice = (currency: string, value: number): string => {
    const option = currencyOptions.find((option) => option.currency === currency);
    const locale = option?.locale || "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let data;
        if (type === "featured") {
          data = await getFeatured();
        } else {
          // type === 'new'
          data = await getNew();
        }
        // Update the homes state with the fetched data
        setHomes(data.map((home: HomeType, index: number) => home || null));
      } catch (error) {
        console.error(`Error fetching ${type} properties:`, error);
      }
    };

    fetchProperties();
  }, [type]);

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-2 grid-rows-2 sm:grid-rows-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {homes.map((home, index) => (
          <div
            key={index}
            className={`flex flex-col rounded-xl h-full w-44 md:w-52 lg:w-52 xl:w-52 space-y-2 shadow-lg dark:shadow-card bg-card`}
          >
            {!home ? (
              <>
                <Skeleton className="rounded-xl h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              <>
                <Carousel>
                  <CarouselContent>
                    {home.photos.map((photo: string, index) => (
                      <CarouselItem key={index} className="flex justify-center items-center">
                        <div className="relative flex justify-center items-center h-40 w-44 md:h-40 md:w-52 lg:h-40 lg:w-52 xl:h-40 xl:w-52">
                          <Image
                            src={photo}
                            className="rounded-t-xl object-cover object-center"
                            alt={home.title!}
                            fill={true}
                            sizes={"(max-width: 500px), (max-height: 500px)"}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8" />
                  <CarouselNext className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8" />
                </Carousel>
                <div className="flex flex-col justify-center items-center w-full h-full gap-2 px-2">
                  <div
                    className={`w-full flex ${
                      home.title && home.title.length > 20 ? "justify-start" : "justify-center"
                    }`}
                  >
                    <h2
                      className={`text-sm md:text-md lg:text-lg xl:text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis`}
                    >
                      {home.title}
                    </h2>
                  </div>

                  <div className="flex text-center text-xs sm:text-sm lg:text-md">{home.municipality}</div>
                  <div className="flex text-center text-xs sm:text-sm lg:text-md">{home.region}</div>
                  <div className="flex text-center text-sm sm:text-sm lg:text-md">
                    {iso31661.find((country) => country.alpha3 === home.country)?.name}
                  </div>
                  <div className="flex text-center text-sm md:text-md lg:text-lg font-semibold mb-2">
                    {formatPrice(defaultCurrency, home.priceUsd * currencyRate)}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
