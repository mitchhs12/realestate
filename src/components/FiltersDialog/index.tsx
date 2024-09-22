"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
  Filter,
  House,
  Sparkles,
  DollarSign,
  DoorOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  SlidersVertical,
  Settings2,
} from "lucide-react";
import { Slider } from "@/components/ui/currencySlider";
import { QueryContext } from "@/context/QueryContext";
import Features from "@/components/Filters/Features";
import Categories from "@/components/Filters/Categories";
import Rooms from "@/components/Filters/Rooms";
import { LocaleContext } from "@/context/LocaleContext";
import { I18nProviderClient } from "@/locales/client";
import { CookingPot, Bath, Sofa, BedDouble } from "lucide-react";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export default function FiltersDialog() {
  const {
    headerValues,
    setConvertedPriceRange,
    convertedPriceRange,
    setPriceRange,
    priceRange,
    setSelectedTypes,
    selectedTypes,
    selectedFeatures,
    setSelectedFeatures,
    selectedRooms,
    setSelectedRooms,
    setIsFiltering,
    allSelectedFeatures,
    allSelectedTypes,
    handleAllFeatures,
    handleAllTypes,
    newFilters,
    initialMaxPrice,
    originalFilters,
    setNewFilters,
  } = useContext(QueryContext);

  const { defaultCurrency, defaultLanguage } = useContext(LocaleContext);
  const [isReady, setIsReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isRoomsOpen, setIsRoomsOpen] = useState(true);
  const { filters, categories, features, rooms, apply, reset, selectAll, deselectAll } = headerValues;
  const pathname = usePathname();

  const toggleFeatures = () => {
    isCategoriesOpen && setIsCategoriesOpen(false);
    isRoomsOpen && setIsRoomsOpen(false);
    setIsFeaturesOpen(!isFeaturesOpen);
  };
  const toggleCategories = () => {
    isFeaturesOpen && setIsFeaturesOpen(false);
    isRoomsOpen && setIsRoomsOpen(false);
    setIsCategoriesOpen(!isCategoriesOpen);
  };
  const toggleRooms = () => {
    isFeaturesOpen && setIsFeaturesOpen(false);
    isCategoriesOpen && setIsCategoriesOpen(false);
    setIsRoomsOpen(!isRoomsOpen);
  };

  useEffect(() => {
    if (selectedFeatures && selectedTypes) {
      setIsReady(true);
    }
  }, [selectedFeatures, selectedTypes]);

  return (
    <>
      <Button
        variant={"secondary"}
        className="h-12 pl-5 justify-center items-center text-md border-r-0 border rounded-l-full font-normal rounded-r-none shadow-sm shadow-secondary"
        disabled={!isReady}
        onClick={(e) => {
          e.preventDefault();
          setDialogOpen(true);
        }}
      >
        <div
          className={`flex items-center text-gray-600 dark:text-gray-400 ${originalFilters !== newFilters && "text-primary"}`}
        >
          <Settings2 className="items-center" width={20} height={20} strokeWidth={1.5} />
        </div>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-80 p-4 rounded-md">
          <DialogHeader>
            <DialogTitle>{filters}</DialogTitle>
            <DialogClose asChild />
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <DollarSign width={15} height={15} strokeWidth={1.25} />
              </div>
              {defaultCurrency ? (
                <Slider
                  value={priceRange}
                  onValueChange={(newValue) => setPriceRange(newValue)}
                  step={10000}
                  max={initialMaxPrice}
                  minValue={1}
                  maxValue={initialMaxPrice}
                  exponent={2}
                  onFormattedPricesChange={(newValue) => setConvertedPriceRange(newValue)}
                  newCurrencySymbol={defaultCurrency.symbol}
                  newCurrencyUsdPrice={defaultCurrency.usdPrice}
                />
              ) : (
                <Skeleton className="w-full h-full" />
              )}
              <div className="flex items-center justify-center">
                <DollarSign width={15} height={15} strokeWidth={1.25} />
                <DollarSign width={15} height={15} strokeWidth={1.25} />
                <DollarSign width={15} height={15} strokeWidth={1.25} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <House width={20} height={20} strokeWidth={1.25} />
                  {categories}{" "}
                  {selectedTypes.length > 0 && <span className="text-[#16A34A]">({selectedTypes.length})</span>}
                </div>
                <Button variant={"outline"} size={"icon"} onClick={toggleCategories}>
                  {isCategoriesOpen ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              {isCategoriesOpen && (
                <I18nProviderClient locale={defaultLanguage}>
                  <div className="flex flex-col items-center overflow-y-auto max-h-52">
                    <Button className="flex justify end" variant={"outline"} size={"sm"} onClick={handleAllTypes}>
                      {allSelectedTypes ? deselectAll : selectAll}
                    </Button>
                    <Categories selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
                  </div>
                </I18nProviderClient>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles width={20} height={20} strokeWidth={1.25} />
                  {features}{" "}
                  {selectedFeatures.length > 0 && <span className="text-[#16A34A]">({selectedFeatures.length})</span>}
                </div>
                <Button variant={"outline"} size={"icon"} onClick={toggleFeatures}>
                  {isFeaturesOpen ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              {isFeaturesOpen && (
                <I18nProviderClient locale={defaultLanguage}>
                  <div className="flex flex-col items-center overflow-y-auto max-h-52">
                    <Button variant={"outline"} size={"sm"} onClick={handleAllFeatures}>
                      {allSelectedFeatures ? deselectAll : selectAll}
                    </Button>
                    <Features selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} />
                  </div>
                </I18nProviderClient>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen width={20} height={20} strokeWidth={1.25} />
                  {rooms}
                  {(selectedRooms.bedrooms[0] !== 0 || selectedRooms.bedrooms[1] !== selectedRooms.maxRooms) && (
                    <BedDouble size={18} strokeWidth={1.25} color={"#16A34A"} />
                  )}
                  {(selectedRooms.bathrooms[0] !== 0 || selectedRooms.bathrooms[1] !== selectedRooms.maxRooms) && (
                    <Bath size={18} strokeWidth={1.25} color={"#16A34A"} />
                  )}
                  {(selectedRooms.livingrooms[0] !== 0 || selectedRooms.livingrooms[1] !== selectedRooms.maxRooms) && (
                    <Sofa size={18} strokeWidth={1.25} color={"#16A34A"} />
                  )}
                  {(selectedRooms.kitchens[0] !== 0 || selectedRooms.kitchens[1] !== selectedRooms.maxRooms) && (
                    <CookingPot size={18} strokeWidth={1.25} color={"#16A34A"} />
                  )}
                </div>
                <Button variant={"outline"} size={"icon"} onClick={toggleRooms}>
                  {isRoomsOpen ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              {isRoomsOpen && (
                <I18nProviderClient locale={defaultLanguage}>
                  <Rooms selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} />
                </I18nProviderClient>
              )}
            </div>

            <div className="flex items-center gap-4 justify-center">
              <Button
                variant={"default"}
                size={"sm"}
                type={"submit"}
                className="flex"
                disabled={
                  newFilters ===
                  JSON.stringify({
                    convertedPriceRange: convertedPriceRange,
                    types: selectedTypes,
                    features: selectedFeatures,
                    rooms: selectedRooms,
                  })
                }
                onClick={() => {
                  if (pathname !== "/") {
                    setIsFiltering(true);
                  } else {
                    setNewFilters(
                      JSON.stringify({
                        convertedPriceRange: convertedPriceRange,
                        types: selectedTypes,
                        features: selectedFeatures,
                        rooms: selectedRooms,
                      })
                    );
                  }
                  setDialogOpen(false);
                }}
              >
                <span>{apply}</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                type={"submit"}
                className="flex"
                disabled={originalFilters === newFilters}
                onClick={() => {
                  setPriceRange([1, initialMaxPrice]);
                  setSelectedFeatures([]);
                  setSelectedTypes([]);
                  setConvertedPriceRange([]);
                  setSelectedRooms({
                    bedrooms: [0, selectedRooms.maxRooms],
                    bathrooms: [0, selectedRooms.maxRooms],
                    livingrooms: [0, selectedRooms.maxRooms],
                    kitchens: [0, selectedRooms.maxRooms],
                    maxRooms: selectedRooms.maxRooms,
                  });
                  setNewFilters(originalFilters);
                  setIsFiltering(true);
                }}
              >
                <span>{reset}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
