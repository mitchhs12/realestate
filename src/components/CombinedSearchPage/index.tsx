"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/Map";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType } from "@/lib/validations";

export default function CombinedSearchPage({ coordinates }: { coordinates: CoordinatesType }) {
  const { mapFocused, setMapFocused } = useContext(QueryContext);

  return (
    <>
      <section
        className={`flex w-full h-1/2 ${
          !mapFocused ? "md:hidden" : "md:h-full"
        } lg:flex lg:w-1/2 lg:h-full border border-red-400 flex-grow`}
      >
        <SearchResults coordinates={coordinates} />
      </section>
      <section
        className={`flex w-full h-1/2 ${
          mapFocused ? "md:hidden" : "md:h-full"
        } lg:flex lg:w-1/2 lg:h-screen-minus-header border border-red-400 flex-grow`}
      >
        <MapComponent coordinates={coordinates} />
      </section>
      <FloatingButton />
    </>
  );
}
