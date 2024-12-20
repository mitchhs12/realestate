"use client";

import { HomeType, BoundsType } from "@/lib/validations";
import { useState, useEffect, useRef } from "react";
import ResizableCard from "../../ResizableCard";
import { findMatching } from "@/lib/utils";
import PaginationComponent from "../../PaginationComponent";

interface Props {
  homes: (HomeType | null)[];
  visibleHomes: (HomeType | null)[];
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
  visibleHomes,
  isSearchLoading,
  label,
  bounds,
  typesObject,
  noHomesFound,
  loginToViewPrice,
  premiumText,
}: Props) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (bounds) {
      if (firstRender.current) {
        firstRender.current = false;
      }
    }
  }, [bounds]);

  return (
    <>
      <div className="flex flex-col justify-between items-start w-full px-4">
        {homes && homes.length > 0 ? (
          <div className="w-full grid gap-8 px-4 p-8 pt-0 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {visibleHomes.map((home, index) => {
              const matchingTypes = findMatching(typesObject, home, "type");

              return (
                <div key={index} className="flex justify-center items-start w-full pt-4">
                  <div
                    className={`flex justify-center rounded-xl w-full space-y-2${
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
    </>
  );
}
