"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/MainMap";
import { getAllHomes, getSearchResults } from "@/app/[locale]/search/actions";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType, BoundsType, HomeType } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";

interface Props {
  coordinates: CoordinatesType;
  label: string;
  initZoom: number | null;
}

export default function CombinedSearchPage({ coordinates, label, initZoom }: Props) {
  const { mapFocused, setMapFocused } = useContext(QueryContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<(HomeType | null)[]>(Array(12).fill(null));
  const [homesGeoJson, setHomesGeoJson] = useState<HomesGeoJson | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [snap, setSnap] = useState<number | string | null>(0.5);
  const [isOpen, setIsOpen] = useState(false);
  const [searchLabel, setSearchLabel] = useState(label);

  useEffect(() => {
    getAllHomes().then((allHomes) => {
      setHomesGeoJson(allHomes);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setMapFocused(true);
      } else if (homes.length > 0) {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (bounds) {
      setIsSearchLoading(true);
      getSearchResults("search", bounds).then((data) => {
        setHomes(data);
        setSearchLabel("map area");
        setIsSearchLoading(false);
      });
    }
  }, [bounds]);

  return (
    <>
      <section
        className={`hidden md:flex flex-col w-full h-full ${
          mapFocused && "md:hidden"
        } lg:flex lg:w-1/2 lg:h-full bg-zinc-100 dark:bg-zinc-900`}
      >
        <h1 className="flex pt-8 text-2xl justify-center w-full">
          {isSearchLoading ? (
            <Skeleton className="rounded-lg w-80 h-8" />
          ) : (
            `${homes.length} ${homes.length === 1 ? "property" : "properties"} in ${searchLabel}.`
          )}
        </h1>
        <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
      </section>
      <div className="flex md:hidden">
        <Drawer
          snapPoints={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          open={isOpen}
          modal={false}
          dismissible={false}
        >
          <DrawerContent className="flex flex-col justify-center text-center items-start w-full h-full outline-none gap-y-2 py-2 p-4">
            <DrawerTitle className="w-full">Results</DrawerTitle>
            <DrawerDescription className="flex justify-center w-full">
              {isSearchLoading ? (
                <Skeleton className="w-48 h-5" />
              ) : (
                `${homes.length} ${homes.length === 1 ? "property" : "properties"} in ${searchLabel}.`
              )}
            </DrawerDescription>
            <div className={`flex flex-col h-full w-full justify-center items-center gap-y-2 overflow-y-auto`}>
              <div className={`flex w-full h-full overflow-y-auto`}>
                <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <section className={`flex w-full h-full ${!mapFocused && "md:hidden"} lg:flex lg:w-1/2 lg:h-full`}>
        <MapComponent
          coordinates={coordinates}
          existingBounds={bounds}
          setBounds={setBounds}
          homesGeoJson={homesGeoJson}
          isMapLoading={isMapLoading}
          setIsMapLoading={setIsMapLoading}
          initZoom={initZoom}
        />
      </section>
      <FloatingButton />
    </>
  );
}
