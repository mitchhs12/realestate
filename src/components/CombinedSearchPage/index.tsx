"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/MainMap";
import { getAllHomes, getSearchResults } from "@/app/search/actions";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType, BoundsType, HomeType } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
interface Props {
  coordinates: CoordinatesType;
  label: string;
}

export default function CombinedSearchPage({ coordinates, label }: Props) {
  const { mapFocused, currentCoords, setCurrentCoords } = useContext(QueryContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<HomeType[]>([]);
  const [homesGeoJson, setHomesGeoJson] = useState<HomesGeoJson | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    getAllHomes().then((allHomes) => {
      setHomesGeoJson(allHomes);
      setIsSearchLoading(false);
      console.log("allHomes", allHomes);
    });
  }, []);

  useEffect(() => {
    if (currentCoords) {
      setCurrentCoords(coordinates);
    }
  }, [coordinates]);

  useEffect(() => {
    if (bounds) {
      getSearchResults("search", bounds).then((data) => {
        setHomes(data);
        setIsSearchLoading(false);
      });
    }
  }, [bounds]);

  return (
    <>
      <section className={`flex w-full h-1/2 ${!mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
      </section>
      <section className={`flex w-full h-1/2 ${mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        <MapComponent
          coordinates={coordinates}
          setBounds={setBounds}
          homesGeoJson={homesGeoJson}
          setIsSearchLoading={setIsSearchLoading}
          isMapLoading={isMapLoading}
          setIsMapLoading={setIsMapLoading}
        />
      </section>
      <FloatingButton />
    </>
  );
}
