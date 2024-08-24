"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useState } from "react";
import { HomeType } from "@/lib/validations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CheckCircledIcon, CrossCircledIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface Props {
  home: HomeType;
}

export default function HomeText({ home }: Props) {
  const { setCurrentHome, setQuery } = useContext(QueryContext);
  const { defaultCurrency, currencies } = useContext(LocaleContext);
  const [revealPrice, setRevealPrice] = useState(false);

  useEffect(() => {
    if (home && home.address) {
      setCurrentHome(home);
      setQuery(home.address);
    }
  }, [home]);

  const title = home.title;
  const description = home.description;
  const price = home.price;
  const address = home.address;
  const minicipality = home.municipality;
  const subRegion = home.subRegion;
  const region = home.region;
  const country = home.country;
  const type = home.type;
  const features = home.features;
  const bedrooms = home.bedrooms;
  const bathrooms = home.bathrooms;
  const livingrooms = home.livingrooms;
  const kitchens = home.kitchens;
  const capacity = home.capacity;
  const photos = home.photos;
  const currency = home.currency;
  const language = home.language;
  const priceUsd = home.priceUsd;
  const priceNegotiable = home.priceNegotiable;
  const contactName = home.contactName;
  const contactEmail = home.contactEmail;
  const contactPhone = home.contactPhone;
  const listingType = home.listingType;
  const areaSqm = home.areaSqm;

  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <div className="flex flex-row w-full h-full justify-between">
        <div className="flex flex-col w-2/3 h-auto">{home.description}</div>
        <div className="flex flex-col w-1/3 h-full">
          <Card>
            <CardHeader className={`flex gap-y-3`}>
              <CardTitle className={`text-xl ${!revealPrice && "blur-sm"}`}>
                {formatPrice(defaultCurrency.symbol, home.priceUsd, defaultCurrency.usdPrice)}{" "}
              </CardTitle>
              <CardDescription className={`${!revealPrice && "blur-sm"}`}>
                Original listing price:
                <div>
                  {originalCurrencyRate && home.currency
                    ? formatPrice(home.currency, home.price, originalCurrencyRate)
                    : "Contact us"}{" "}
                  {home.currency}
                </div>
              </CardDescription>
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => {
                    setRevealPrice(!revealPrice);
                  }}
                  variant={"secondary"}
                >
                  <div className="flex gap-2">
                    {revealPrice ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
                    <span className="text-xs">{`${revealPrice ? "Hide" : "Reveal"} the price!`}</span>
                  </div>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="flex items-center gap-2 text-start text-sm sm:text-lg">
                <strong>{"Price Negotiable?"}</strong>
                {priceNegotiable ? (
                  <CheckCircledIcon className="text-green-500 w-4 h-4 sm:w-6 sm:h-6" />
                ) : (
                  <CrossCircledIcon className="text-red-500 w-4 h-4 sm:w-6 sm:h-6" />
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
