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
} from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { I18nProviderClient } from "@/locales/client";
import { Languages, CircleDollarSign } from "lucide-react";
import { SlidersHorizontal, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { QueryContext } from "@/context/QueryContext";
import Features from "@/components/Filters/Features";
import Categories from "@/components/Filters/Categories";
import { LocaleContext } from "@/context/LocaleContext";

interface Props {
  filters: string;
  locale: string;
}

export default function Filters({ filters, locale }: Props) {
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
    initialFilters,
    initialMaxPrice,
  } = useContext(QueryContext);
  const { defaultCurrency } = useContext(LocaleContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (selectedFeatures && selectedTypes) {
      setIsReady(true);
    }
  }, [selectedFeatures, selectedTypes]);

  // useEffect(() => {
  //   console.log("PRIIIIIIIIIIIIICIE", priceRange[1] * defaultCurrency.usdPrice);
  // }, [priceRange]);

  useEffect(() => {
    console.log("here", selectedFeatures);
  }, [selectedFeatures]);

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
              <Languages width={20} height={20} strokeWidth={1.25} />
              Categories
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 max-h-60">
                <I18nProviderClient locale={locale}>
                  <div className="overflow-y-auto">
                    <Categories selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
                  </div>
                </I18nProviderClient>
                <Button variant={"outline"} size={"default"} onClick={handleAllTypes}>
                  {allSelectedTypes ? "Deselect All" : "Select All"}
                </Button>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex justify-center items-center gap-2">
              <CircleDollarSign width={20} height={20} strokeWidth={1.25} />
              <span>Features</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 max-h-60">
                <I18nProviderClient locale={locale}>
                  <div className="overflow-y-auto">
                    <Features selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} />
                  </div>
                </I18nProviderClient>
                <Button variant={"outline"} size={"default"} onClick={handleAllFeatures}>
                  {allSelectedFeatures ? "Deselect All" : "Select All"}
                </Button>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Button
          variant={"default"}
          size={"default"}
          type={"submit"}
          className="flex w-full"
          disabled={
            initialFilters ===
            JSON.stringify({
              features: selectedFeatures,
              types: selectedTypes,
              convertedPriceRange: convertedPriceRange,
            })
          }
          onClick={() => setIsFiltering(true)}
        >
          <span>Apply Filters</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
