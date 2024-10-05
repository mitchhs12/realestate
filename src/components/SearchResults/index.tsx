"use client";

import { HomeType, BoundsType } from "@/lib/validations";
import { useState, useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import ResizableCard from "../ResizableCard";
import { findMatching } from "@/lib/utils";

interface Props {
  homes: (HomeType | null)[];
  isSearchLoading: boolean;
  label: string;
  bounds: BoundsType | null;
  typesObject: { id: string; name: string; translation: string }[];
  noHomesFound: string;
  loginToViewPrice: string;
  premiumText: string;
}

export default function SearchResults({
  homes,
  isSearchLoading,
  label,
  bounds,
  typesObject,
  noHomesFound,
  loginToViewPrice,
  premiumText,
}: Props) {
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
    <div className="flex flex-col h-full justify-start items-start w-full overflow-y-auto px-4">
      {homes && homes.length > 0 ? (
        <div className="w-full grid gap-8 px-4 p-8 pt-0 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
          {homes.map((home, index) => {
            const matchingTypes = findMatching(typesObject, home, "type");

            return (
              <div key={index} className="flex justify-center items-start h-full w-full pt-4">
                <div
                  className={`flex justify-center rounded-xl h-full w-full space-y-2 shadow-lg dark:shadow-white/10 bg-zinc-100 dark:bg-zinc-900 ${
                    isSearchLoading && index >= 4 && "hidden sm:block"
                  } ${isSearchLoading && index >= 9 && "sm:hidden lg:block"} ${
                    isSearchLoading && index >= 6 && "lg:hidden xl:block"
                  } ${isSearchLoading && index >= 9 && "xl:hidden 2xl:block"}`}
                >
                  <ResizableCard
                    home={home}
                    isLoading={isSearchLoading}
                    types={matchingTypes}
                    loginToViewPrice={loginToViewPrice}
                    premiumText={premiumText}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center w-full items-center p-6">{noHomesFound}</div>
      )}
    </div>
  );
}
