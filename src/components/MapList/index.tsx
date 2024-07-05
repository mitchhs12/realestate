"use client";

import SearchResults from "@/components/SearchResults";
import Map from "@/components/Map";
import FloatingButton from "@/components/FloatingButton";
import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";

export default function MapList() {
  const { mapFocused, setMapFocused } = useContext(QueryContext);

  return (
    <>
      <section
        className={`flex w-full h-1/2 ${
          !mapFocused ? "md:hidden" : "md:h-full"
        } lg:flex lg:w-1/2 lg:h-full border border-red-400`}
      >
        <SearchResults />
      </section>
      <section
        className={`flex w-full h-1/2 ${
          mapFocused ? "md:hidden" : "md:h-full"
        } lg:flex lg:w-1/2 lg:h-screen-minus-header border border-red-400`}
      >
        <Map />
      </section>
      <FloatingButton />
    </>
  );
}
