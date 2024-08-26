"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useState } from "react";
import { HomeType } from "@/lib/validations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CheckCircledIcon, CrossCircledIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import lookup from "country-code-lookup";
import { formatNumber } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BrokenPrice from "@/components/BrokenPrice";

interface Props {
  home: HomeType;
  user?: User;
}

export default function HomeText({ home, user }: Props) {
  const { setCurrentHome, setQuery, openLogInModal, revealPrice, setRevealPrice, isModalOpen } =
    useContext(QueryContext);
  const { defaultCurrency, currencies, numerals } = useContext(LocaleContext);
  const [feet, setFeet] = useState(false);
  const [sqSize, setSqSize] = useState(home.areaSqm);

  console.log(defaultCurrency);

  useEffect(() => {
    const ftConversion = 10.76391042;
    setSqSize(!feet ? areaSqm : Math.round(areaSqm * ftConversion));
  }, [feet]);

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
    <div className="flex flex-col w-full h-full justify-center px-8 py-4">
      <div className="flex flex-row w-full h-full justify-between gap-4 md:gap-8">
        <div className="flex flex-col justify-start text-start w-full sm:w-2/3 gap-8 h-auto">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col justify-start gap-y-3 pb-8">
              <div className="flex flex-wrap gap-2 text-2xl">
                <div className="flex flex-col gap-3">
                  {home.type.map((type, index) => {
                    return <span key={index}>{type}</span>;
                  })}
                </div>
                in
                <span>{home.municipality},</span>
                <span className="flex items-center text-2xl gap-3">
                  {home.country && lookup.byIso(home.country)?.country}
                  {home.country && (
                    <FlagComponent
                      country={lookup.byIso(home.country)?.iso2 as Country}
                      countryName={home.country}
                      height={"h-6"}
                      width={"w-9"}
                    />
                  )}
                </span>
              </div>
            </div>
            <div>{home.description}</div>
          </div>
          <p className="text-base sm:text-lg">
            <span className="text-lg sm:text-xl">{formatNumber(home.capacity, numerals)}</span> people can comfortably
            live here.
          </p>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-base sm:text-lg">
              Size of this property:{" "}
              <span className="flex text-base sm:text-lg">
                {formatNumber(sqSize, numerals)} {feet ? "ft" : "m"}²
              </span>
            </div>
            <div className="flex gap-2 text-base md:text-lg items-center">
              Units:{" "}
              <span className="flex items-center gap-2">
                {"m²"}
                <Switch
                  checked={feet}
                  className="flex"
                  onCheckedChange={() => {
                    if (feet) {
                      setFeet(true);
                    } else {
                      setFeet(false);
                    }
                    setFeet(!feet);
                  }}
                />
                {"ft²"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-12 w-full sm:w-3/4">
            <div className="flex flex-col w-full gap-4">
              <div className="text-xl">Rooms:</div>
              <div className="flex flex-row justify-between">
                <span>Bedrooms:</span>
                <span>{formatNumber(home.bedrooms, numerals)}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Bathrooms:</span>
                <span>{formatNumber(home.bathrooms, numerals)}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Living Rooms:</span>
                <span>{formatNumber(home.livingrooms, numerals)}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Kitchens:</span>
                <span>{formatNumber(home.kitchens, numerals)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xl">Features:</div>
              {home.features.map((feature, index) => {
                return <div key={index}>{feature}</div>;
              })}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3 h-full shadow-2xl">
          <Card className="bg-primary border-2 border-green-700">
            <CardHeader className={`flex gap-y-6 lg:gap-y-8 lg:py-10 px-3 lg:px-6`}>
              <CardTitle className={`flex flex-col items-center`}>
                <div className="flex text-base md:text-lg lg:text-xl font-light text-white dark:text-black">Price</div>
                <BrokenPrice
                  home={home}
                  newCurrencySymbol={defaultCurrency.symbol}
                  newCurrencyUsdPrice={defaultCurrency.usdPrice}
                  user={user}
                  blur={revealPrice}
                  blurAmount={"blur-sm md:blur-md"}
                  className="text-xl md:text-2xl lg:text-4xl text-white dark:text-black"
                />
              </CardTitle>
              <CardDescription className={`flex flex-col w-full text-white dark:text-black`}>
                <span className={`text-sm md:text-base lg:text-lg`}>Original Price ({home.currency})</span>
                {originalCurrencyRate && home.currency ? (
                  <BrokenPrice
                    home={home}
                    newCurrencySymbol={home.currency}
                    newCurrencyUsdPrice={originalCurrencyRate}
                    user={user}
                    blur={revealPrice}
                    blurAmount={"blur-sm md:blur-md"}
                    className="justify-center text-base md:text-lg lg:text-xl text-white dark:text-black"
                  />
                ) : (
                  "Contact us"
                )}
              </CardDescription>
              {!user && (
                <div className="flex items-center justify-center">
                  <Button
                    onClick={() => {
                      user ? setRevealPrice(!revealPrice) : openLogInModal();
                    }}
                    variant={"outline"}
                    className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                  >
                    <div className="flex gap-3 justify-center text-lg items-center">
                      {revealPrice || isModalOpen ? (
                        <EyeOpenIcon className="w-4 md:w-6 h-4 md:h-6" />
                      ) : (
                        <EyeClosedIcon className="w-4 md:w-6 h-4 md:h-6" />
                      )}
                      <span className="text-xs md:text-sm lg:text-base">{`${
                        revealPrice ? "Hide" : "Reveal"
                      } the price!`}</span>
                    </div>
                  </Button>
                </div>
              )}
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="flex text-start font-medium text-sm md:text-base lg:text-xl text-white dark:text-black">
                    Price Negotiable?
                  </span>
                  <span className="flex text-center w-auto h-auto">
                    {home.priceNegotiable ? (
                      <span className="flex w-auto h-auto">
                        <CheckCircledIcon className="rounded-full text-white dark:text-black w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </span>
                    ) : (
                      <span className="flex w-auto h-auto">
                        <CrossCircledIcon className="text-red-500 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
