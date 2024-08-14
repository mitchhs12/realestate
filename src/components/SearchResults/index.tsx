"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { HomeType, BoundsType } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState, useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import Card from "@/components/Card";

interface Props {
  homes: HomeType[];
  isSearchLoading: boolean;
  label: string;
  bounds: BoundsType | null;
}

export default function SearchResults({ homes, label, bounds }: Props) {
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
    <div className="flex flex-col h-[80vh] md:h-full justify-start items-start w-full overflow-y-auto">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {homes.map((home, index) => (
          <div key={index} className="flex justify-center items-center p-6">
            <div className="rounded-xl h-full w-44 md:w-52 lg:w-52 xl:w-52 space-y-2 shadow-lg dark:shadow-card bg-card">
              <Card home={home} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
