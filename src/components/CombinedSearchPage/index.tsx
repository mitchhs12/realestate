"use client";

import SearchResults from "@/components/SearchResults";
import MapComponent from "@/components/MainMap";
import { getAllHomes, getSearchResults, getAllHomesFiltered } from "@/app/[locale]/search/actions";
import FloatingButton from "@/components/FloatingButton";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { CoordinatesType, BoundsType, HomeType } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { LocaleContext } from "@/context/LocaleContext";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  coordinates: CoordinatesType;
  label: string;
  initZoom: number | null;
  propertyText: string;
  propertiesText: string;
  resultsText: string;
  showMap: string;
  showList: string;
  typesObject: { id: string; translation: string }[];
  noHomesFound: string;
  loginToViewPrice: string;
}

export default function CombinedSearchPage({
  coordinates,
  label,
  initZoom,
  propertyText,
  propertiesText,
  resultsText,
  showMap,
  showList,
  typesObject,
  noHomesFound,
  loginToViewPrice,
}: Props) {
  const {
    mapFocused,
    setMapFocused,
    selectedTypes,
    selectedFeatures,
    selectedRooms,
    isFiltering,
    setIsFiltering,
    setNewFilters,
    convertedPriceRange,
  } = useContext(QueryContext);
  const { numerals, defaultCurrency } = useContext(LocaleContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<(HomeType | null)[]>(Array(12).fill(null));
  const [homesGeoJson, setHomesGeoJson] = useState<HomesGeoJson | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [snap, setSnap] = useState<number | string | null>(0.5);
  const [isOpen, setIsOpen] = useState(homes[0] !== null ? true : false);

  // INITIAL GET ALL HOMES ON FIRST RENDER
  useEffect(() => {
    getAllHomesFiltered(defaultCurrency, selectedTypes, selectedFeatures, convertedPriceRange).then((allHomes) => {
      setHomesGeoJson(allHomes);
    });
  }, []);

  // SEARCH COMPONENT
  useEffect(() => {
    if (bounds) {
      setIsSearchLoading(true);
      getSearchResults(
        "search",
        bounds,
        convertedPriceRange,
        selectedTypes,
        selectedFeatures,
        selectedRooms,
        defaultCurrency
      ).then((data) => {
        setHomes(data);
        setIsSearchLoading(false);
        setIsFiltering(false);
        setNewFilters(
          JSON.stringify({
            convertedPriceRange: convertedPriceRange,
            types: selectedTypes,
            features: selectedFeatures,
            rooms: selectedRooms,
          })
        );
      });
    }
  }, [isFiltering, bounds]);

  // GETS THE FILTERED HOMES FOR THE MAP
  useEffect(() => {
    if (isFiltering) {
      getAllHomesFiltered(defaultCurrency, selectedTypes, selectedFeatures, convertedPriceRange).then((fixedHomes) => {
        setHomesGeoJson(fixedHomes);
      });
    }
  }, [isFiltering]);

  useEffect(() => {
    if (homes[0] !== null && homes.length > 0 && window.innerWidth < 768) {
      setIsOpen(true);
    } else if (window.innerWidth >= 768) {
      setIsOpen(false);
      setMapFocused(true);
    }
  }, [homes]);

  return (
    <>
      <section className={`flex w-full h-full ${!mapFocused && "md:hidden"} lg:flex lg:w-1/2 lg:h-full`}>
        {homesGeoJson ? (
          <MapComponent
            coordinates={coordinates}
            existingBounds={bounds}
            setBounds={setBounds}
            homesGeoJson={homesGeoJson}
            isMapLoading={isMapLoading}
            setIsMapLoading={setIsMapLoading}
            initZoom={initZoom}
          />
        ) : (
          // <Skeleton className="w-full h-full" />
          <div className="flex w-full h-full items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
            Loading...
          </div>
        )}
      </section>
      <section
        className={`hidden md:flex flex-col w-full h-full ${
          mapFocused && "md:hidden"
        } lg:flex lg:w-1/2 lg:h-full bg-zinc-100 dark:bg-zinc-900`}
      >
        <h1 className="flex py-10 text-2xl justify-center items-center h-[32px] w-full">
          {isSearchLoading ? (
            <Skeleton className="rounded-lg w-80 h-8" />
          ) : (
            `${formatNumber(homes.length, numerals)} ${homes.length === 1 ? propertyText : propertiesText} `
          )}
        </h1>
        <SearchResults
          homes={homes}
          isSearchLoading={isSearchLoading}
          bounds={bounds}
          label={label}
          typesObject={typesObject}
          noHomesFound={noHomesFound}
          loginToViewPrice={loginToViewPrice}
        />
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
            <DrawerTitle className="w-full">{resultsText}</DrawerTitle>
            <DrawerDescription className="flex justify-center w-full">
              {isSearchLoading ? (
                <Skeleton className="w-48 h-5" />
              ) : (
                `${formatNumber(homes.length, numerals)} ${homes.length === 1 ? propertyText : propertiesText}`
              )}
            </DrawerDescription>
            <div className={`flex flex-col h-full w-full justify-center items-center gap-y-2 overflow-y-auto`}>
              <div className={`flex w-full h-full overflow-y-auto`}>
                <SearchResults
                  homes={homes}
                  isSearchLoading={isSearchLoading}
                  bounds={bounds}
                  label={label}
                  typesObject={typesObject}
                  noHomesFound={noHomesFound}
                  loginToViewPrice={loginToViewPrice}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <FloatingButton showMap={showMap} showList={showList} />
    </>
  );
}
