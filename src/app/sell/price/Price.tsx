"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { cn } from "@/lib/utils";

const currencyOptions: ReadonlyArray<CurrencyInputProps["intlConfig"]> = [
  { locale: "en-US", currency: "USD" },
  { locale: "de-DE", currency: "EUR" },
  { locale: "en-GB", currency: "GBP" },
  { locale: "en-AU", currency: "AUD" },
  { locale: "ja-JP", currency: "JPY" },
  { locale: "fr-CH", currency: "CHF" },
  { locale: "en-IN", currency: "INR" },
  { locale: "es-CO", currency: "COP" },
  { locale: "es-MX", currency: "MXN" },
  { locale: "es-PE", currency: "PEN" },
  { locale: "en-CA", currency: "CAD" },
  { locale: "zh-CN", currency: "CNY" },
  { locale: "en-SG", currency: "SGD" },
  { locale: "ar-AE", currency: "AED" },
  { locale: "pt-BR", currency: "BRL" },
  { locale: "zh-HK", currency: "HKD" },
  { locale: "af-ZA", currency: "ZAR" },
  { locale: "ko-KR", currency: "KRW" },
  { locale: "en-NZ", currency: "NZD" },
  { locale: "tr-TR", currency: "TRY" },
  { locale: "th-TH", currency: "THB" },
  { locale: "id-ID", currency: "IDR" },
  { locale: "vi-VN", currency: "VND" },
  { locale: "es-CR", currency: "CRC" },
  { locale: "hr-HR", currency: "HRK" },
  { locale: "ka-GE", currency: "GEL" },
];

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Price({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome, setNewHome } =
    useContext(SellContext);
  const [price, setPrice] = useState<number | null>(currentHome?.price || 0);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(currentHome?.priceNegotiable || false);
  const [intlConfig, setIntlConfig] = useState<CurrencyInputProps["intlConfig"]>(currencyOptions[0]);

  useEffect(() => {
    if (currentHome && price !== null) {
      setNewHome({
        ...currentHome,
        price: price,
        priceNegotiable: isNegotiable,
      });
    }
  }, [price, isNegotiable]);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  const handlePriceChange = (value: string | undefined) => {
    const numericValue = value ? parseFloat(value) : null;
    setPrice(numericValue);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const config = currencyOptions[Number(event.target.value)];
    if (config) {
      setIntlConfig(config);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Pricing</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Set your price</h3>
          </div>
        </div>
        <div className="flex flex-col h-full w-full pt-20">
          <div className="flex flex-col justify-center items-center gap-y-8">
            <div className="flex w-[80vw] max-w-[400px] gap-x-2">
              <select
                className={cn(
                  "flex h-9 rounded-md border border-input px-3 py-1 text-base shadow-sm shadow-secondary transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
                onChange={handleCurrencyChange}
              >
                {currencyOptions.map((config, i) => (
                  <option key={`${config?.locale}${config?.currency}`} value={i}>
                    {config?.currency}
                  </option>
                ))}
              </select>
              <CurrencyInput
                key={intlConfig?.currency} // Force re-render when currency changes
                placeholder="Please enter your desired price..."
                intlConfig={intlConfig}
                decimalsLimit={2}
                value={price !== null ? price.toString() : ""}
                onValueChange={handlePriceChange}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm shadow-secondary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>
            <div className="flex justify-center items-end gap-x-4">
              <Label htmlFor="price-negotiable">Price Negotiable?</Label>
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
