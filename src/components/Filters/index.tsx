"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { I18nProviderClient } from "@/locales/client";
import {
  SlidersHorizontal,
  House,
  Sparkles,
  DollarSign,
  DoorOpen,
  BedDouble,
  Bath,
  Sofa,
  CookingPot,
} from "lucide-react";
import { Slider } from "@/components/ui/currencySlider";
import { QueryContext } from "@/context/QueryContext";
import Features from "@/components/Filters/Features";
import Categories from "@/components/Filters/Categories";
import { LocaleContext } from "@/context/LocaleContext";
import Rooms from "./Rooms";
import { features } from "process";

interface Props {
  filters: string;
  locale: string;
  categories: string;
  categoriesSub: string;
  features: string;
  featuresSub: string;
  rooms: string;
  roomsSub: string;
  apply: string;
  reset: string;
  selectAll: string;
  deselectAll: string;
}

export default function Filters({
  filters,
  locale,
  categories,
  categoriesSub,
  features,
  featuresSub,
  rooms,
  roomsSub,
  apply,
  reset,
  selectAll,
  deselectAll,
}: Props) {
  const {
    setConvertedPriceRange,
    convertedPriceRange,
    setPriceRange,
    priceRange,
    setSelectedTypes,
    selectedTypes,
    selectedFeatures,
    setSelectedFeatures,
    setIsFiltering,
    allSelectedFeatures,
    allSelectedTypes,
    handleAllFeatures,
    handleAllTypes,
    newFilters,
    initialMaxPrice,
    originalFilters,
    selectedRooms,
    setSelectedRooms,
  } = useContext(QueryContext);
  const { defaultCurrency } = useContext(LocaleContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (selectedFeatures && selectedTypes) {
      setIsReady(true);
    }
  }, [selectedFeatures, selectedTypes]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"default"} disabled={!isReady}>
          <div className="inline-flex items-center gap-2">
            <SlidersHorizontal width={16} height={16} strokeWidth={1.25} />
            <span className="hidden md:flex items-center">{filters}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" side="bottom" align="center">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2"
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <span className="flex items-center">
              <DollarSign width={20} height={20} strokeWidth={1.25} />
            </span>
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
            <div className="flex">
              <DollarSign width={20} height={20} strokeWidth={1.25} />
              <DollarSign width={20} height={20} strokeWidth={1.25} />
              <DollarSign width={20} height={20} strokeWidth={1.25} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <House width={20} height={20} strokeWidth={1.25} />
              {categories}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 max-h-80">
                <I18nProviderClient locale={locale}>
                  <DropdownMenuLabel className="flex items-center justify-center pb-3">
                    {categoriesSub} {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                  </DropdownMenuLabel>
                  <div className="overflow-y-auto">
                    <Categories selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
                  </div>
                </I18nProviderClient>
                <Button variant={"outline"} size={"default"} onClick={handleAllTypes}>
                  {allSelectedTypes ? deselectAll : selectAll}
                </Button>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex justify-center items-center gap-2">
              <Sparkles width={20} height={20} strokeWidth={1.25} />
              {features} {selectedFeatures.length > 0 && `(${selectedFeatures.length})`}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 max-h-80">
                <I18nProviderClient locale={locale}>
                  <DropdownMenuLabel className="flex justify-center items-center pb-3">{featuresSub}</DropdownMenuLabel>
                  <div className="overflow-y-auto">
                    <Features selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} />
                  </div>
                </I18nProviderClient>
                <Button variant={"outline"} size={"default"} onClick={handleAllFeatures}>
                  {allSelectedFeatures ? deselectAll : selectAll}
                </Button>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex justify-center items-center gap-2">
              <DoorOpen width={20} height={20} strokeWidth={1.25} />
              {rooms}
              {selectedRooms.bedrooms[0] !== 0 ||
                (selectedRooms.bedrooms[1] !== selectedRooms.maxRooms && <BedDouble size={18} strokeWidth={1} />)}
              {selectedRooms.bathrooms[0] !== 0 ||
                (selectedRooms.bathrooms[1] !== selectedRooms.maxRooms && <Bath size={18} strokeWidth={1} />)}
              {selectedRooms.livingrooms[0] !== 0 ||
                (selectedRooms.livingrooms[1] !== selectedRooms.maxRooms && <Sofa size={18} strokeWidth={1} />)}
              {selectedRooms.kitchens[0] !== 0 ||
                (selectedRooms.kitchens[1] !== selectedRooms.maxRooms && <CookingPot size={18} strokeWidth={1} />)}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 max-h-80 w-full">
                <I18nProviderClient locale={locale}>
                  <DropdownMenuLabel className="flex justify-center items-center pb-3 w-full">
                    {roomsSub}
                  </DropdownMenuLabel>
                  <div className="flex w-full h-full">
                    <Rooms selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} />
                  </div>
                </I18nProviderClient>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
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
            onClick={() => setIsFiltering(true)}
          >
            {apply}
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            type={"submit"}
            className="flex"
            disabled={originalFilters === newFilters}
            onClick={() => {
              setConvertedPriceRange([]);
              setSelectedTypes([]);
              setSelectedFeatures([]);
              setSelectedRooms({
                bedrooms: [0, selectedRooms.maxRooms],
                bathrooms: [0, selectedRooms.maxRooms],
                livingrooms: [0, selectedRooms.maxRooms],
                kitchens: [0, selectedRooms.maxRooms],
                maxRooms: selectedRooms.maxRooms,
              });
              setIsFiltering(true);
            }}
          >
            {reset}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
