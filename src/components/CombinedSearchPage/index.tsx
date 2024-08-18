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
import {
  Drawer,
  DrawerPortal,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
  DrawerOverlay,
} from "@/components/ui/drawer";

interface Props {
  coordinates: CoordinatesType;
  label: string;
}

export default function CombinedSearchPage({ coordinates, label }: Props) {
  const { mapFocused, setMapFocused, currentCoords, setCurrentCoords } = useContext(QueryContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<(HomeType | null)[]>(Array(12).fill(null));
  const [homesGeoJson, setHomesGeoJson] = useState<HomesGeoJson | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [snap, setSnap] = useState<number | string | null>(0.2);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllHomes().then((allHomes) => {
      setHomesGeoJson(allHomes);
    });
  }, []);

  useEffect(() => {
    if (currentCoords) {
      setCurrentCoords(coordinates);
    }
  }, [coordinates]);

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
        setIsSearchLoading(false);
      });
    }
  }, [bounds]);

  useEffect(() => {
    if (isOpen) {
      console.log("drawer open!");
    } else {
      console.log("drawer closed!");
    }
  }, [isOpen]);

  useEffect(() => {
    if (homes.length > 0 && window.innerWidth < 768) {
      console.log("drawer opening!");
      setIsOpen(true);
    } else {
      console.log("drawer closing!");
      // setIsOpen(false);
    }
  }, [homes]);

  useEffect(() => {
    console.log("mapFocused", mapFocused);
  }, [mapFocused]);

  return (
    <>
      <section className={`hidden md:flex w-full h-full ${mapFocused && "md:hidden"} lg:flex lg:w-1/2 lg:h-full`}>
        <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
      </section>
      <div className="flex md:hidden">
        <Drawer
          snapPoints={[0.2, 0.5, 0.8]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          open={isOpen}
          modal={false}
          onClose={() => setIsOpen(false)}
        >
          <DrawerContent className="outline-none">
            <div
              className={`flex flex-col justify-center items-center max-w-xl mx-auto pt-4 min-w-72 md:px-0 gap-y-2 ${
                snap === 1 ? "overflow-y-auto" : "overflow-hidden"
              }`}
            >
              <DrawerTitle>Results</DrawerTitle>
              <DrawerDescription>
                {isSearchLoading ? (
                  <Skeleton className="w-48 h-5" />
                ) : (
                  `${homes.length} properties in ${bounds ? "Map Area" : label}`
                )}
              </DrawerDescription>

              <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
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
        />
      </section>
      <FloatingButton />
    </>
  );
}
