"use client";

import { HomeType, BoundsType } from "@/lib/validations";
import { useState, useContext, useEffect, useRef } from "react";
import { QueryContext } from "@/context/QueryContext";
import ResizableCard from "../ResizableCard";

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
    <div className="flex flex-col h-full justify-start items-start w-full overflow-y-auto px-4 pb-4">
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
        {homes ? (
          homes.map((home, index) => (
            <div key={index} className="flex p-4 justify-center items-start h-full w-full">
              <div
                className={`flex justify-center rounded-xl h-full w-full space-y-2 shadow-lg dark:shadow-white/10 bg-zinc-100 dark:bg-zinc-900 ${
                  isSearchLoading && index >= 4 && "hidden sm:block"
                }
              ${isSearchLoading && index >= 9 && "sm:hidden lg:block"}
              ${isSearchLoading && index >= 6 && "lg:hidden xl:block"}
              ${isSearchLoading && index >= 9 && "xl:hidden 2xl:block"}`}
              >
                <ResizableCard home={home} isLoading={isSearchLoading} />
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
