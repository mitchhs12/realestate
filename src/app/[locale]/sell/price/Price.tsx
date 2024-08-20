"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { LocaleContext } from "@/context/LocaleContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { locales } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { getFlagEmoji } from "@/lib/utils";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  negotiable: string;
  price_placeholder: string;
}

export default function Price({
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  negotiable,
  price_placeholder,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    currentHome,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);
  const { defaultCurrency, currencies } = useContext(LocaleContext);

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

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedConfig = locales[Number(event.target.value)];
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
              <select
                className={cn(
                  "flex h-9 rounded-md border border-input px-3 py-1 text-base shadow-sm shadow-secondary transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
                value={locales.findIndex(
                  (option) => option.currency === (intlConfig ? intlConfig.currency : defaultCurrency)
                )}
                onChange={handleCurrencyChange}
              >
                {locales.map((option, index) => (
                  <option key={index} value={index}>
                    {option.currency} {getFlagEmoji(option.locale.split("-")[1])}
                  </option>
                ))}
              </select>
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
