"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useState } from "react";
import { HomeType } from "@/lib/validations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CopyIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import lookup from "country-code-lookup";
import { formatNumber } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BrokenPrice from "@/components/BrokenPrice";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Props {
  home: HomeType;
}

export default function HomeText({ home }: Props) {
  const {
    setCurrentHome,
    setQuery,
    openLogInModal,
    revealPrice,
    setRevealPrice,
    revealContact,
    setRevealContact,
    isModalOpen,
    session,
    user,
  } = useContext(QueryContext);
  const { defaultCurrency, currencies, numerals } = useContext(LocaleContext);
  const [feet, setFeet] = useState(false);
  const [sqSize, setSqSize] = useState(home.areaSqm);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const ftConversion = 10.76391042;
    setSqSize(!feet ? home.areaSqm : Math.round(home.areaSqm * ftConversion));
  }, [feet]);

  useEffect(() => {
    if (home && home.address) {
      setCurrentHome(home);
      setQuery(home.address);
    }
  }, [home]);

  const handleCopy = (text: any, field: any) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000); // Reset the copied state after 2 seconds
  };

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
      <div className="flex flex-row w-full h-full justify-between gap-8">
        <div className="flex flex-col justify-start text-start w-full sm:w-2/3 gap-6 h-auto">
          <div className="flex flex-wrap gap-2 text-2xl sm:text-3xl">
            <div className="flex flex-col gap-3">
              {home.type.map((type, index) => {
                return <span key={index}>{type}</span>;
              })}
            </div>
            in
            <span>{home.municipality},</span>
            <span className="flex items-center gap-3">
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
          <Separator />
          <div className="flex flex-col gap-8">
            <div className="text-base">{home.description}</div>

            <div>
              <div className="text-lg sm:text-xl">Capacity:</div>
              <p className="text-base sm:text-lg">
                <span className="text-lg sm:text-xl">{formatNumber(home.capacity, numerals)}</span> people can
                comfortably live here.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl gap-2">Property size</div>
              <div className="flex gap-4">
                <span className="flex gap-2 text-base md:text-lg items-center">
                  [ {"m²"}
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
                  {"ft²"} ]:
                </span>
                <span className="flex text-lg md:text-xl">
                  {formatNumber(sqSize, numerals)} {feet ? "ft" : "m"}²
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-3/4">
              <div className="flex flex-col w-full gap-3">
                <div className="text-lg sm:text-xl">Rooms:</div>
                <div className="flex gap-3">
                  <span>{formatNumber(home.bedrooms, numerals)}</span>{" "}
                  <span>{home.bedrooms !== 1 ? "Bedrooms" : "Bedroom"}</span>
                </div>
                <div className="flex gap-3">
                  <span>{formatNumber(home.bathrooms, numerals)}</span>
                  <span>{home.bathrooms !== 1 ? "Bathrooms" : "Bathroom"}</span>
                </div>
                <div className="flex gap-3">
                  <span>{formatNumber(home.livingrooms, numerals)}</span>
                  <span>{home.livingrooms !== 1 ? "Living Rooms" : "Living Room"}</span>
                </div>
                <div className="flex gap-3">
                  <span>{formatNumber(home.kitchens, numerals)}</span>
                  <span>{home.kitchens !== 1 ? "Kitchens" : "Kitchen"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-lg sm:text-xl">Features:</div>
              {home.features.map((feature, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} />
                    {feature}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3 max-w-xs h-full items-end rounded-xl gap-10">
          <Card className="w-full max-w-xs shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm md:text-base lg:text-lg">Pricing</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {session.status === "loading" ? (
                <div className="flex justify-center w-full">
                  <Skeleton className="h-9 md:h-10 lg:h-12 w-8/12" />
                </div>
              ) : (
                <BrokenPrice
                  home={home}
                  newCurrencySymbol={defaultCurrency.symbol}
                  newCurrencyUsdPrice={defaultCurrency.usdPrice}
                  reveal={user ? true : false}
                  blurAmount={"blur-md"}
                  className="text-primary justify-center text-2xl md:text-3xl lg:text-4xl"
                />
              )}
              <div className={`flex flex-col w-full`}>
                <span className={`text-sm md:text-base lg:text-lg`}>Original Price ({home.currency})</span>
                {originalCurrencyRate && home.currency ? (
                  session.status === "loading" ? (
                    <div className="flex justify-center w-full">
                      <Skeleton className="items-center h-8 md:h-9 lg:h-9 w-7/12" />
                    </div>
                  ) : (
                    <BrokenPrice
                      home={home}
                      newCurrencySymbol={home.currency}
                      newCurrencyUsdPrice={originalCurrencyRate}
                      reveal={user ? true : false}
                      blurAmount={"blur-sm md:blur-md"}
                      className="text-primary justify-center text-base md:text-lg lg:text-xl"
                    />
                  )
                ) : (
                  "Contact us"
                )}
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="flex text-start font-medium text-xs md:text-sm lg:text-xl">Price Negotiable?</span>
                  <span className="flex text-center w-auto h-auto">
                    {home.priceNegotiable ? (
                      <span className="flex w-auto h-auto">
                        <CheckCircledIcon className="rounded-full text-primary w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </span>
                    ) : (
                      <span className="flex w-auto h-auto">
                        <CrossCircledIcon className="text-red-500 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </span>
                    )}
                  </span>
                </div>
              </div>
              {session.status === ("unauthenticated" || "loading") && (
                <div className="flex items-center justify-center mt-4">
                  <Button
                    onClick={() => {
                      user ? setRevealPrice(!revealPrice) : openLogInModal();
                    }}
                    variant={"default"}
                    className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                  >
                    <div className="flex gap-3 justify-center text-lg items-center">
                      {revealPrice || isModalOpen ? (
                        <EyeOpenIcon className="w-5 h-5" />
                      ) : (
                        <EyeClosedIcon className="w-5 h-5" />
                      )}
                      <span className="text-xs md:text-sm lg:text-base">{`${
                        revealPrice ? "Hide" : "Show"
                      } the Price!`}</span>
                    </div>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm md:text-base lg:text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col items-start">
                <span className="text-start text-xs md:text-sm">Name:</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="text-start">{home.contactName}</div>
                  <Button
                    onClick={() => handleCopy(home.contactName, "name")}
                    variant="outline"
                    size="icon"
                    className="flex text-xs gap-2 p-2"
                    disabled={!revealContact}
                  >
                    {copiedField === "name" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-start text-xs md:text-sm">Email:</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="justify-start truncate">{home.contactEmail}</div>
                  <Button
                    onClick={() => handleCopy(home.contactEmail, "email")}
                    variant="outline"
                    size="icon"
                    className="flex text-xs gap-2 p-2"
                    disabled={!revealContact}
                  >
                    {copiedField === "email" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-start text-xs md:text-sm">Phone:</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="justify-start">{home.contactPhone}</div>
                  <Button
                    onClick={() => handleCopy(home.contactPhone, "phone")}
                    variant="outline"
                    className="flex text-xs gap-2 p-2"
                    size="icon"
                    disabled={!revealContact}
                  >
                    {copiedField === "phone" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center mt-4">
                <Button
                  onClick={() => {
                    user ? setRevealContact(!revealContact) : openLogInModal();
                  }}
                  variant="default"
                  className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                >
                  <div className="flex gap-3 justify-center text-lg items-center">
                    {revealContact ? (
                      <EyeOpenIcon className="w-4 md:w-6 h-4 md:h-6" />
                    ) : (
                      <EyeClosedIcon className="w-4 md:w-6 h-4 md:h-6" />
                    )}
                    <span className="text-xs md:text-sm lg:text-base">
                      {revealContact ? "Hide" : "Show"} Contact Info!
                    </span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
