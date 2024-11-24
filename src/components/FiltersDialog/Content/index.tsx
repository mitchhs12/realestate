"use client";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  VisuallyHidden,
} from "@/components/ui/dialog";
import { House, Sparkles, DollarSign, DoorOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/currencySlider";
import { QueryContext } from "@/context/QueryContext";
import Features from "@/components/Filters/Features";
import Categories from "@/components/Filters/Categories";
import Rooms from "@/components/Filters/Rooms";
import { LocaleContext } from "@/context/LocaleContext";
import { I18nProviderClient } from "@/locales/client";
import { CookingPot, Bath, Sofa, BedDouble } from "lucide-react";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  isSmallMap: boolean;
  placeholder: string;
  placeholderShort: string;
  text: string;
}

export default function FiltersDialog({ isSmallMap, placeholder, placeholderShort, text }: Props) {
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
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const { categories, features, rooms, apply, reset, selectAll, deselectAll, search, filters } = headerValues;
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

  return (
    <>
      <DialogContent className="flex flex-col h-[85%] w-[85%] p-4 rounded-md">
        <DialogHeader>
          <DialogTitle>{search}</DialogTitle>
          <DialogDescription>{filters}</DialogDescription>
          <DialogClose asChild />
        </DialogHeader>
        <div className="flex flex-col h-full overflow-y-auto gap-4 justify-between">
          <div className="flex flex-col h-full p-1 overflow-y-auto gap-5 justify-start">
            <SearchBox
              rawBox={true}
              isSmallMap={isSmallMap}
              placeholder={placeholder}
              placeholderShort={placeholderShort}
              text={text}
            />
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
                  newCurrencySymbol={defaultCurrency?.symbol}
                  newCurrencyUsdPrice={defaultCurrency?.usdPrice}
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
            <div className="flex flex-col gap-4 p-1 overflow-y-auto justify-start">
              <div className={`flex flex-col gap-2 ${isCategoriesOpen && "overflow-y-auto"}`}>
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
                  <div className="flex flex-col p-1 overflow-y-auto">
                    <I18nProviderClient locale={defaultLanguage}>
                      <Button className="flex text-sm w-full" variant={"outline"} onClick={handleAllTypes}>
                        {allSelectedTypes ? deselectAll : selectAll}
                      </Button>
                      <div className="flex flex-col overflow-y-auto">
                        <Categories selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
                      </div>
                    </I18nProviderClient>
                  </div>
                )}
              </div>

              <div className={`flex flex-col gap-2 ${isFeaturesOpen && "overflow-y-auto"}`}>
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
                  <div className="flex flex-col p-1 overflow-y-auto">
                    <I18nProviderClient locale={defaultLanguage}>
                      <Button className="flex text-sm w-full" variant={"outline"} onClick={handleAllFeatures}>
                        {allSelectedFeatures ? deselectAll : selectAll}
                      </Button>
                      <div className="flex flex-col overflow-y-auto">
                        <Features selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} />
                      </div>
                    </I18nProviderClient>
                  </div>
                )}
              </div>

              <div className={`flex flex-col gap-2 ${isRoomsOpen && "overflow-y-auto"}`}>
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
                    {(selectedRooms.livingrooms[0] !== 0 ||
                      selectedRooms.livingrooms[1] !== selectedRooms.maxRooms) && (
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
                  <div className="flex flex-col p-1 overflow-y-auto">
                    <I18nProviderClient locale={defaultLanguage}>
                      <div className="flex flex-col overflow-y-auto">
                        <Rooms selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} />
                      </div>
                    </I18nProviderClient>
                  </div>
                )}
              </div>
            </div>
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
                if (pathname !== "/" && pathname !== `/${defaultLanguage}`) {
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
    </>
  );
}
