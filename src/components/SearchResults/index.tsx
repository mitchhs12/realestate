"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HomeType, BoundsType } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState, useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import { formatPrice } from "@/lib/utils";
import { CurrencyContext } from "@/context/CurrencyContext";
import { iso31661 } from "iso-3166";

interface Props {
  homes: HomeType[];
  isSearchLoading: boolean;
  label: string;
  bounds: BoundsType | null;
}

export default function SearchResults({ homes, isSearchLoading, label, bounds }: Props) {
  const { query } = useContext(QueryContext);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [boundsChanged, setBoundsChanged] = useState(false);
  const firstRender = useRef(true);
  const { defaultCurrency, currencyRate } = useContext(CurrencyContext);

  useEffect(() => {
    setCurrentQuery(label);
  }, [label]);

  useEffect(() => {
    if (bounds) {
      if (firstRender.current) {
        firstRender.current = false;
      } else {
        setBoundsChanged(true);
      }
    }
  }, [bounds]);

  return (
    <div className="flex flex-col w-full pt-2 px-4 gap-6">
      <h1>Search Results for {boundsChanged ? "Map Area" : label}</h1>
      {isSearchLoading ? (
        <div className="flex items-center justify-center text-lg lg:text-3xl">
          <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home, index) => (
            <div key={index} className="rounded-lg shadow-md">
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
              <div className="flex flex-col justify-center items-center w-full gap-2 px-2">
                <div
                  className={`w-full flex ${home.title && home.title.length > 20 ? "justify-start" : "justify-center"}`}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
