"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect } from "react";
import { HomeType } from "@/lib/validations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CheckCircledIcon, CrossCircledIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";

interface Props {
  home: HomeType;
  user?: User;
}

export default function HomeText({ home, user }: Props) {
  const { setCurrentHome, setQuery, openLogInModal, revealPrice, setRevealPrice } = useContext(QueryContext);
  const { defaultCurrency, currencies } = useContext(LocaleContext);

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
    <div className="flex flex-col w-full h-full justify-center p-8">
      <div className="flex flex-row w-full h-full justify-between">
        <div className="flex flex-col justify-start text-start w-full sm:w-2/3 h-auto px-4">
          <div className="flex flex-col gap-y-8">
            <p className="text-2xl">{home.address}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
            <p>{home.description}</p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3 h-full">
          <Card>
            <CardHeader className={`flex gap-y-3`}>
              <CardTitle className={`text-2xl lg:text-3xl ${!revealPrice && "blur-md"}`}>
                {formatPrice(defaultCurrency.symbol, home.priceUsd, defaultCurrency.usdPrice)}
              </CardTitle>
              <CardDescription className={`${!revealPrice && "blur-sm"}`}>
                <p>Original listing price:</p>
                {originalCurrencyRate && home.currency
                  ? formatPrice(home.currency, home.price, originalCurrencyRate)
                  : "Contact us"}
                {home.currency}
              </CardDescription>
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => {
                    user ? setRevealPrice(!revealPrice) : openLogInModal();
                  }}
                  variant={"outline"}
                  className="flex px-4 justify-center text-center"
                >
                  <div className="flex gap-2 w-[150px] justify-center">
                    {revealPrice ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
                    <span className="text-xs">{`${revealPrice ? "Hide" : "Reveal"} the price!`}</span>
                  </div>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-start text-sm sm:text-lg">
                <strong className="text-xs md:text-sm lg:text-base">{"Price Negotiable?"}</strong>
                {priceNegotiable ? (
                  <CheckCircledIcon className="text-green-500 w-4 h-4 sm:w-6 sm:h-6" />
                ) : (
                  <CrossCircledIcon className="text-red-500 w-4 h-4 sm:w-6 sm:h-6" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
