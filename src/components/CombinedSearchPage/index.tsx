"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/Map";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType } from "@/lib/validations";

export default function CombinedSearchPage({ coordinates }: { coordinates: CoordinatesType }) {
  const { mapFocused, currentCoords, setCurrentCoords } = useContext(QueryContext);

  useEffect(() => {
    if (currentCoords) {
      setCurrentCoords(coordinates);
    }
  }, [coordinates]);

  return (
    <>
      <section className={`flex w-full h-1/2 ${!mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        <SearchResults coordinates={coordinates} />
      </section>
      <section className={`flex w-full h-1/2 ${mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        <MapComponent coordinates={coordinates} />
      </section>
      <FloatingButton />
    </>
  );
}
