"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HomeType, BoundsType } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import { useState } from "react";

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
            <div key={index} className="border rounded-lg">
              <Carousel>
                <CarouselContent>
                  {home.photos.map((photo: string, index) => (
                    <CarouselItem key={index}>
                      <div className="flex justify-center items-center w-full h-64">
                        <Image src={photo} alt={home.title!} width={400} height={400} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3" />
                <CarouselNext className="absolute right-3" />
              </Carousel>
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{home.title}</h2>
                <p className="text-gray-700 mb-4">{home.description}</p>
                <p className="text-lg font-bold">{home.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
