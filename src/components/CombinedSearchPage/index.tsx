"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/MainMap";
import { getAllHomes, getSearchResults } from "@/app/search/actions";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType, BoundsType, HomeType } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function CombinedSearchPage({ coordinates }: { coordinates: CoordinatesType }) {
  const { mapFocused, currentCoords, setCurrentCoords } = useContext(QueryContext);
  const [bounds, setBounds] = useState<BoundsType>({
    south: 0,
    west: 0,
    north: 0,
    east: 0,
  });
  const [homes, setHomes] = useState<HomeType[]>([]);
  const [allHomes, setAllHomes] = useState<HomeType[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    getAllHomes().then((allHomes) => {
      setAllHomes(allHomes);
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
    if (bounds.south && bounds.west && bounds.north && bounds.east) {
      getSearchResults("search", bounds).then((data) => {
        setHomes(data);
        setIsSearchLoading(false);
      });
    }
  }, [bounds]);

  return (
    <>
      <section className={`flex w-full h-1/2 ${!mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        {isSearchLoading ? (
          <div className="flex items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
          </div>
        ) : (
          <SearchResults homes={homes} />
        )}
      </section>
      <section className={`flex w-full h-1/2 ${mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
        <MapComponent
          coordinates={coordinates}
          setBounds={setBounds}
          allHomes={allHomes}
          setIsSearchLoading={setIsSearchLoading}
          isMapLoading={isMapLoading}
          setIsMapLoading={setIsMapLoading}
        />
      </section>
      <FloatingButton />
    </>
  );
}
