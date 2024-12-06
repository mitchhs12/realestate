"use client";

import SearchResults from "@/components/CombinedSearchPage/SearchResults";
import MapComponent from "@/components/CombinedSearchPage/MainMap";
import { getSearchResults, getAllHomesFiltered } from "@/app/[locale]/search/actions";
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
import PaginationComponent from "../PaginationComponent";

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
  const [isOpen, setIsOpen] = useState(homes[0] !== null ? true : false);

  const ITEMS_PER_PAGE = 12;
  const [visibleHomes, setVisibleHomes] = useState(homes.slice((1 - 1) * ITEMS_PER_PAGE, 1 * ITEMS_PER_PAGE));

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
    if (window.innerWidth >= 1024) {
      setIsOpen(false);
    }
    setIsSearchLoading(false);
  }, [homes]);

  return (
    <div className="flex w-full">
      <section className={`flex w-full lg:w-1/2 sticky top-[152px] h-screen-minus-header-double-svh`}>
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
      <section className={`hidden lg:flex flex-col w-1/2 bg-zinc-100 dark:bg-zinc-900 gap-4`}>
        <h1 className="sticky top-[152px] text-center z-[30] bg-zinc-100 dark:bg-zinc-900 shadow-lg py-4 text-xl xl:text-2xl justify-center items-center w-full">
          {isSearchLoading ? (
            <Skeleton className="rounded-lg w-96 h-8 mx-auto" />
          ) : (
            `${formatNumber(homes.length, numerals)} ${homes.length === 1 ? propertyText : propertiesText} `
          )}
        </h1>
        <div className="flex flex-col">
          <SearchResults
            homes={homes}
            visibleHomes={visibleHomes}
            isSearchLoading={isSearchLoading}
            bounds={bounds}
            label={label}
            typesObject={typesObject}
            noHomesFound={noHomesFound}
            loginToViewPrice={loginToViewPrice}
            premiumText={premiumText}
          />
          <div className="py-2">
            <PaginationComponent homes={homes} ITEMS_PER_PAGE={ITEMS_PER_PAGE} setVisibleHomes={setVisibleHomes} />
          </div>
        </div>
      </section>
      {/* DRAWER */}
      <div className="lg:hidden">
        <Drawer
          handleOnly={true}
          open={isOpen}
          modal={false}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <DrawerContent className="max-h-[calc(100vh-152px)] text-center overflow-hidden gap-y-2 pt-4">
            <DrawerTitle>{resultsText}</DrawerTitle>
            <DrawerDescription className="flex justify-center w-full">
              {isSearchLoading ? (
                <Skeleton className="w-48 h-5" />
              ) : (
                `${formatNumber(homes.length, numerals)} ${homes.length === 1 ? propertyText : propertiesText}`
              )}
            </DrawerDescription>
            <div className="relative overflow-y-auto flex-1">
              <SearchResults
                homes={homes}
                visibleHomes={visibleHomes}
                isSearchLoading={isSearchLoading}
                bounds={bounds}
                label={label}
                typesObject={typesObject}
                noHomesFound={noHomesFound}
                loginToViewPrice={loginToViewPrice}
                premiumText={premiumText}
              />
              <div className="py-6">
                <PaginationComponent homes={homes} ITEMS_PER_PAGE={ITEMS_PER_PAGE} setVisibleHomes={setVisibleHomes} />
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
    </div>
  );
}
