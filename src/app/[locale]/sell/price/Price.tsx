"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { LocaleContext } from "@/context/LocaleContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { locales } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  negotiable: string;
  price_placeholder: string;
  noCurrencies: string;
  selectCurrency: string;
}

export default function Price({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  negotiable,
  price_placeholder,
  noCurrencies,
  selectCurrency,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setCurrentHome,
    setPrevLoading,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);
  const { defaultCurrency, currencies } = useContext(LocaleContext);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    console.log("current value", value);
  }, [value]);

  const [price, setPrice] = useState<number | null>(currentHome?.price || 0);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(currentHome?.priceNegotiable || false);
  const initialIntlConfig = currentHome?.currency
    ? locales.find((option) => option.currency === currentHome.currency)
    : locales.find((option) => option.currency === defaultCurrency.symbol);
  const [intlConfig, setIntlConfig] = useState<CurrencyInputProps["intlConfig"]>(initialIntlConfig);

  useEffect(() => {
    if (currentHome && price !== null && intlConfig && intlConfig.currency) {
      const currentCurrency = currencies.find((currency) => currency.symbol === intlConfig?.currency);

      if (currentCurrency && currentCurrency.usdPrice !== null) {
        const priceInUsd = price / currentCurrency.usdPrice;
        const roundedPriceInUsd = Math.round(priceInUsd * 100) / 100;

        setNextDisabled(false);
        setNewHome({
          ...currentHome,
          price: price, // Save price in USD
          currency: intlConfig.currency,
          priceUsd: roundedPriceInUsd,
          priceNegotiable: isNegotiable,
        });
      }
    } else {
      setNextDisabled(true);
    }
  }, [price, isNegotiable, intlConfig, currencies]);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
    if (price && price > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, []);

  const handlePriceChange = (value: string | undefined) => {
    const numericValue = value ? parseFloat(value) : null;

    if (numericValue !== null) {
      const decimals = intlConfig?.currency
        ? locales.find((option) => option.currency === intlConfig.currency)?.decimalsLimit
        : 2; // Default to 2 decimals if not specified

      const roundedValue = decimals !== undefined ? parseFloat(numericValue.toFixed(decimals)) : numericValue;
      setPrice(roundedValue);
    } else {
      setPrice(numericValue);
    }
  };

  const handleCurrencyChange = (localeString: string) => {
    const selectedIndex = locales.findIndex((locale) => locale.currency === localeString);
    const selectedConfig = locales[selectedIndex];

    setIntlConfig(selectedConfig);

    if (selectedConfig && selectedConfig.currency) {
      const selectedCurrency = currencies.find((currency) => currency.symbol === selectedConfig.currency);

      if (selectedCurrency && selectedCurrency.usdPrice !== null && price !== null) {
        const currentCurrency = currencies.find((currency) => currency.symbol === intlConfig?.currency);

        if (currentCurrency && currentCurrency.usdPrice !== null) {
          const priceInUsd = price / currentCurrency.usdPrice;
          let newPrice = priceInUsd * selectedCurrency.usdPrice;
          // Apply decimals limit
          const decimals = selectedConfig.decimalsLimit !== undefined ? selectedConfig.decimalsLimit : 2;
          newPrice = parseFloat(newPrice.toFixed(decimals));

          setPrice(newPrice);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
        </div>
        <div className="flex flex-col h-full w-full pt-20">
          <div className="flex flex-col justify-center items-center gap-y-8">
            <div className="flex w-[80vw] max-w-[400px] gap-x-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    <FlagComponent
                      country={intlConfig?.locale.split("-")[1].toUpperCase() as Country}
                      countryName={intlConfig?.locale.split("-")[1].toUpperCase() as string}
                    />
                    {intlConfig ? locales.find((locales) => locales === intlConfig)?.currency : selectCurrency}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex justify-center w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>{noCurrencies}</CommandEmpty>
                      <CommandGroup>
                        {locales.map((option) => (
                          <CommandItem
                            className="gap-2"
                            key={option.currency}
                            value={option.currency}
                            onSelect={(selection) => {
                              handleCurrencyChange(selection);
                              setOpen(false);
                            }}
                          >
                            <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
                              <FlagComponent
                                country={option.locale.split("-")[1].toUpperCase() as Country}
                                countryName={option.currency}
                              />
                            </span>
                            {option.currency}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                intlConfig?.currency === option.currency ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <CurrencyInput
                key={intlConfig?.currency} // Force re-render when currency changes
                placeholder={price_placeholder}
                intlConfig={intlConfig}
                decimalsLimit={
                  intlConfig ? locales.find((option) => option.currency === intlConfig.currency)?.decimalsLimit : 2
                }
                value={price !== null ? price.toString() : ""}
                onValueChange={handlePriceChange}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm shadow-secondary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>
            <div className="flex justify-center items-end gap-x-4">
              <Label htmlFor="price-negotiable">{negotiable}</Label>
              <Switch
                id="price-negotiable"
                checked={isNegotiable}
                onCheckedChange={() => {
                  setIsNegotiable(!isNegotiable);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
