"use client";

import SearchResults from "@/components/CombinedSearchPage/SearchResults";
import MapComponent from "@/components/CombinedSearchPage/MainMap";
import { getSearchResults, getAllHomesFiltered } from "@/app/[locale]/search/actions";
import FloatingButton from "@/components/CombinedSearchPage/FloatingButtons";
import FloatingDrawerButton from "@/components/CombinedSearchPage/FloatingButtons/FloatingDrawerButton";
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
  typesObject: { id: string; name: string; translation: string }[];
  noHomesFound: string;
  loginToViewPrice: string;
  propertiesMapText: string;
  otherCategories: string;
  loadingText: string;
  premiumText: string;
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
  propertiesMapText,
  otherCategories,
  loadingText,
  premiumText,
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
    headerValues,
  } = useContext(QueryContext);
  const { numerals, defaultCurrency } = useContext(LocaleContext);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [homes, setHomes] = useState<(HomeType | null)[]>(Array(12).fill(null));
  const [homesGeoJson, setHomesGeoJson] = useState<HomesGeoJson | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [snap, setSnap] = useState<number | string | null>(0.5);
  const [isOpen, setIsOpen] = useState(homes[0] !== null ? true : false);
  const [maxDrawerHeight, setMaxDrawerHeight] = useState(0);

  // INITIAL GET ALL HOMES ON FIRST RENDER
  useEffect(() => {
    if (defaultCurrency) {
      getAllHomesFiltered(defaultCurrency, selectedTypes, selectedFeatures, convertedPriceRange).then((allHomes) => {
        setHomesGeoJson(allHomes);
      });
    }
  }, []);

  // SEARCH COMPONENT
  useEffect(() => {
    if (bounds && defaultCurrency) {
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
    if (isFiltering && defaultCurrency) {
      getAllHomesFiltered(defaultCurrency, selectedTypes, selectedFeatures, convertedPriceRange).then((fixedHomes) => {
        setHomesGeoJson(fixedHomes);
      });
    }
  }, [isFiltering]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMaxDrawerHeight(window.innerHeight - 86);
    } else if (window.innerWidth >= 768) {
      setIsOpen(false);
      setMapFocused(true);
    }
    setIsSearchLoading(false);
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
            typesObject={typesObject}
            loginToViewPrice={loginToViewPrice}
            propertiesText={propertiesMapText}
            otherCategories={otherCategories}
          />
        ) : (
          // <Skeleton className="w-full h-full" />
          <div className="flex w-full h-full items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
            {loadingText}
          </div>
        )}
      </section>
      <section
        className={`hidden md:flex flex-col w-full h-full ${
          mapFocused && "md:hidden"
        } lg:flex lg:w-1/2 lg:h-full bg-zinc-100 dark:bg-zinc-900 items-center pt-6`}
      >
        <h1 className="flex py-10 text-xl xl:text-2xl justify-center items-center h-[32px] w-full">
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
          premiumText={premiumText}
        />
      </section>
      <div className="flex md:hidden">
        <Drawer
          snapPoints={[`${maxDrawerHeight}`]}
          activeSnapPoint={snap}
          handleOnly={true}
          open={isOpen}
          modal={false}
          onClose={() => {
            setIsOpen(false);
          }}
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
              <div className={`flex flex-col w-full h-full pb-12`}>
                <SearchResults
                  homes={homes}
                  isSearchLoading={isSearchLoading}
                  bounds={bounds}
                  label={label}
                  typesObject={typesObject}
                  noHomesFound={noHomesFound}
                  loginToViewPrice={loginToViewPrice}
                  premiumText={premiumText}
                />
              </div>
            </div>
          </DrawerContent>
          <FloatingDrawerButton
            isLoading={!isSearchLoading && !isMapLoading ? false : true}
            loadingText={loadingText}
            showMap={showMap}
            showList={showList}
            drawerOpen={isOpen}
            setDrawerOpen={setIsOpen}
          />
        </Drawer>
      </div>

      <FloatingButton showMap={showMap} showList={showList} />
    </>
  );
}
