"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { HomeType, BoundsType } from "@/lib/validations";
import { useState, useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import Card from "@/components/Card";

interface Props {
  homes: (HomeType | null)[];
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
    <div className="flex flex-col h-[90vh] md:h-full justify-start items-start w-full overflow-y-auto">
      <div className="w-full grid grid-cols-1 grid-rows-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 lg:grid-rows-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
        {homes ? (
          homes.map((home, index) => (
            <div key={index} className="flex p-6 justify-center items-start h-full w-full">
              <div
                className={`rounded-xl h-78 w-44 md:w-52 lg:w-52 xl:w-52 space-y-2 shadow-lg dark:shadow-card bg-card  ${
                  isSearchLoading && index >= 4 && "hidden sm:block"
                }
              ${isSearchLoading && index >= 9 && "sm:hidden lg:block"}
              ${isSearchLoading && index >= 6 && "lg:hidden xl:block"}
              ${isSearchLoading && index >= 9 && "xl:hidden 2xl:block"}`}
              >
                <Card home={home} isLoading={isSearchLoading} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center p-6">No Homes Found!</div>
        )}
      </div>
    </div>
  );
}
