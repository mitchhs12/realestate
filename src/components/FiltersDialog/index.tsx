"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { SlidersHorizontal, House, Sparkles, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { QueryContext } from "@/context/QueryContext";
import Features from "@/components/Filters/Features";
import Categories from "@/components/Filters/Categories";
import { LocaleContext } from "@/context/LocaleContext";
import { I18nProviderClient } from "@/locales/client";
import { Separator } from "@/components/ui/separator";

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
    newFilters,
    initialMaxPrice,
    originalFilters,
    setNewFilters,
  } = useContext(QueryContext);

  const { defaultCurrency } = useContext(LocaleContext);
  const [isReady, setIsReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedFeatures && selectedTypes) {
      setIsReady(true);
    }
  }, [selectedFeatures, selectedTypes]);

  return (
    <>
      <Button variant={"outline"} size={"default"} disabled={!isReady} onClick={() => setDialogOpen(true)}>
        <div className="inline-flex items-center gap-2">
          <SlidersHorizontal width={16} height={16} strokeWidth={1.25} />
          <span className="hidden md:flex items-center">{filters}</span>
        </div>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-80 p-4 rounded-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogClose asChild />
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <DollarSign width={20} height={20} strokeWidth={1.25} />
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
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <House width={20} height={20} strokeWidth={1.25} />
                  Categories
                </div>
                <Button variant={"outline"} size={"sm"} onClick={handleAllTypes}>
                  {allSelectedTypes ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <I18nProviderClient locale={locale}>
                <div className="overflow-y-auto max-h-40">
                  <Categories selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} modal={true} />
                </div>
              </I18nProviderClient>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles width={20} height={20} strokeWidth={1.25} />
                  Features
                </div>
                <Button variant={"outline"} size={"sm"} onClick={handleAllFeatures}>
                  {allSelectedFeatures ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <I18nProviderClient locale={locale}>
                <div className="overflow-y-auto max-h-40">
                  <Features
                    selectedFeatures={selectedFeatures}
                    setSelectedFeatures={setSelectedFeatures}
                    modal={true}
                  />
                </div>
              </I18nProviderClient>
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
                    features: selectedFeatures,
                    types: selectedTypes,
                    convertedPriceRange: convertedPriceRange,
                  })
                }
                onClick={() => setIsFiltering(true)}
              >
                <span>Apply New Filters</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                type={"submit"}
                className="flex"
                disabled={originalFilters === newFilters}
                onClick={() => {
                  setNewFilters(
                    JSON.stringify({
                      features: [],
                      types: [],
                      convertedPriceRange: [],
                    })
                  );
                  setSelectedFeatures([]);
                  setSelectedTypes([]);
                  setConvertedPriceRange([]);
                  setIsFiltering(true);
                }}
              >
                <span>Reset Filters</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
