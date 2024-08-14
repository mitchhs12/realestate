"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/MainMap";
import { getAllHomes, getSearchResults } from "@/app/search/actions";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType, BoundsType, HomeType } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
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
  const { mapFocused, currentCoords, setCurrentCoords } = useContext(QueryContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<HomeType[]>([]);
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
      setIsOpen(false);
    }
  }, [homes]);

  return (
    <>
      <section
        className={`hidden md:flex w-full h-1/2 ${!mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}
      >
        <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
      </section>
      <div className="flex md:hidden">
        <Drawer
          snapPoints={[0.2, 0.6, 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          open={isOpen}
          modal={false}
          onClose={() => setIsOpen(false)}
        >
          <DrawerOverlay className="fixed inset-0 bg-black/5" style={{ zIndex: 50 }} />
          <DrawerContent style={{ zIndex: 50 }}>
            <div
              className={`flex flex-col justify-center items-center max-w-2xl mx-auto pt-4 gap-y-2 ${
                snap === 1 ? "overflow-y-auto" : "overflow-hidden"
              }`}
            >
              <DrawerTitle>Results</DrawerTitle>
              <DrawerDescription>
                {homes.length} properties in {bounds ? "Map Area" : label}
              </DrawerDescription>
              <SearchResults homes={homes} isSearchLoading={isSearchLoading} bounds={bounds} label={label} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <section className={`flex w-full h-full ${mapFocused ? "md:hidden" : "md:h-full"} lg:flex lg:w-1/2 lg:h-full`}>
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
