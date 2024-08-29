"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CopyIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import lookup from "country-code-lookup";
import { formatNumber } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BrokenPrice from "@/components/BrokenPrice";
import { Check, Languages, Phone, PhoneCall, BedDouble, CookingPot, Bath, Sofa } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { handleCopy } from "@/lib/utils";
import { HomeContext } from "@/context/HomeContext";

interface Props {
  units: { m: string; ft: string };
  capacityText: { single: string; plural: string };
  capacityTitle: string;
  roomsTitle: string;
  featuresTitle: string;
  priceTitle: string;
  originalPrice: string;
  negotiable: string;
  sizeTitle: string;
  showPrice: string;
  hidePrice: string;
  contactTitle: string;
  contactNameText: string;
  contactEmailText: string;
  contactPhoneText: string;
  contactButton: string;
  bedroomsText: { single: string; plural: string };
  bathroomsText: { single: string; plural: string };
  livingroomsText: { single: string; plural: string };
  kitchensText: { single: string; plural: string };
  translateButton: string;
  showOriginalButton: string;
}

export default function HomeText({
  units,
  capacityText,
  capacityTitle,
  roomsTitle,
  featuresTitle,
  priceTitle,
  originalPrice,
  negotiable,
  sizeTitle,
  showPrice,
  hidePrice,
  contactTitle,
  contactNameText,
  contactEmailText,
  contactPhoneText,
  contactButton,
  bedroomsText,
  bathroomsText,
  livingroomsText,
  kitchensText,
  translateButton,
  showOriginalButton,
}: Props) {
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
  const {
    home,
    matchingTypes,
    matchingFeatures,
    translatedMunicipality,
    translationLoading,
    descriptionLoading,
    description,
    handleDescriptionConvert,
    originalDescription,
    countryName,
  } = useContext(HomeContext);

  const { defaultCurrency, currencies, numerals, defaultLanguage } = useContext(LocaleContext);
  const [feet, setFeet] = useState(false);
  const [sqSize, setSqSize] = useState(home.areaSqm);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;

  return (
    <div className="flex flex-col w-full h-full justify-center px-8 py-4">
      <div className="flex flex-row w-full h-full justify-between gap-8">
        <div className="flex flex-col justify-start text-start w-full sm:w-2/3 gap-6 h-auto">
          {translationLoading ? (
            <div className="flex justify-center sm:justify-start w-full">
              <Skeleton className="h-[6vh] sm:h-[6vh] md:h-[6.5vh] lg:h-[6.5vh] w-11/12" />
            </div>
          ) : (
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="flex gap-2 text-2xl md:text-3xl lg:text-3xl">
                {matchingTypes.map((type, index) => (
                  <span key={index}>
                    {index > 0 && <span className="text-gray-300">| </span>}
                    {type.translation}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start text-lg sm:text-xl md:text-2xl lg:text-2xl">
                <div>{translatedMunicipality ? translatedMunicipality : home.municipality}</div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300">| </span>
                  {countryName}
                  {home.country && (
                    <FlagComponent
                      country={lookup.byIso(home.country)?.iso2 as Country}
                      countryName={home.country}
                      height={"h-6"}
                      width={"w-9"}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="text-base">
                {translationLoading || descriptionLoading ? (
                  <Skeleton className="h-[9vh] sm:h-[9vh] md:h-[9vh] lg:h-[16vh] w-full" />
                ) : (
                  description
                )}
              </div>
              <div className={`${defaultLanguage === "en" ? "hidden" : "flex"} w-full h-full justify-start`}>
                <Button
                  disabled={descriptionLoading || translationLoading}
                  className="gap-2"
                  variant={"outline"}
                  onClick={handleDescriptionConvert}
                >
                  <Languages width={18} />
                  {originalDescription ? translateButton : showOriginalButton}
                </Button>
              </div>
            </div>

            <div>
              <div className="text-lg sm:text-xl">{capacityTitle}</div>
              <p className="flex items-center text-base sm:text-lg gap-1">
                <span>{formatNumber(home.capacity, numerals)}</span>
                {home.capacity === 0 ? capacityText.single : capacityText.plural}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl gap-2">{sizeTitle}</div>
              <div className="flex gap-4">
                <span className="flex gap-2 text-base md:text-lg items-center">
                  [ {units.m}
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
                  {units.ft} ]:
                </span>
                <span className="flex text-lg md:text-xl">
                  {formatNumber(sqSize, numerals)} {feet ? units.ft : units.m}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-3/4">
              <div className="flex flex-col w-full gap-3">
                <div className="text-lg sm:text-xl">{roomsTitle}</div>
                <div className="flex gap-3">
                  <BedDouble size={18} />
                  <span>{formatNumber(home.bedrooms, numerals)}</span>{" "}
                  <span>{home.bedrooms !== 1 ? bedroomsText.plural : bedroomsText.single}</span>
                </div>
                <div className="flex gap-3">
                  <Bath size={18} />
                  <span>{formatNumber(home.bathrooms, numerals)}</span>
                  <span>{home.bathrooms !== 1 ? bathroomsText.plural : bathroomsText.single}</span>
                </div>
                <div className="flex gap-3">
                  <Sofa size={18} />
                  <span>{formatNumber(home.livingrooms, numerals)}</span>
                  <span>{home.livingrooms !== 1 ? livingroomsText.plural : livingroomsText.single}</span>
                </div>
                <div className="flex gap-3">
                  <CookingPot size={18} />
                  <span>{formatNumber(home.kitchens, numerals)}</span>
                  <span>{home.kitchens !== 1 ? kitchensText.plural : kitchensText.single}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-lg sm:text-xl">{featuresTitle}</div>
              {matchingFeatures.map((feature, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} />
                    {feature.translation}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3 max-w-xs h-full items-end rounded-xl gap-10">
          <Card className="w-full max-w-xs shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm md:text-base lg:text-lg">{priceTitle}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {session.status === "loading" ? (
                <div className="flex justify-center w-full">
                  <Skeleton className="h-10 md:h-11 lg:h-12 w-8/12" />
                </div>
              ) : (
                <BrokenPrice
                  home={home}
                  newCurrencySymbol={defaultCurrency.symbol}
                  newCurrencyUsdPrice={defaultCurrency.usdPrice}
                  reveal={user ? true : false}
                  blurAmount={"blur-lg"}
                  className="text-primary justify-center text-2xl md:text-3xl lg:text-4xl"
                />
              )}
              <div className={`flex flex-col w-full`}>
                <span className={`text-sm md:text-base lg:text-lg`}>
                  {originalPrice} ({home.currency})
                </span>
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
                      blurAmount={"blur-md"}
                      className="text-primary justify-center text-base md:text-lg lg:text-xl"
                    />
                  )
                ) : (
                  "Contact us"
                )}
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="flex text-start font-medium text-xs md:text-sm lg:text-xl">{negotiable}</span>
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
                        revealPrice ? hidePrice : showPrice
                      }`}</span>
                    </div>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm md:text-base lg:text-lg">{contactTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col items-start">
                <span className="text-start text-xs md:text-sm">{contactNameText}</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="text-start">{home.contactName}</div>
                  <Button
                    onClick={() => home.contactName && handleCopy(home.contactName, "name", setCopiedField)}
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
                <span className="text-start text-xs md:text-sm">{contactEmailText}</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="justify-start truncate">{home.contactEmail}</div>
                  <Button
                    onClick={() => home.contactEmail && handleCopy(home.contactEmail, "email", setCopiedField)}
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
                <span className="text-start text-xs md:text-sm">{contactPhoneText}</span>
                <div
                  className={`${
                    !revealContact ? "blur-sm select-none" : "select-text"
                  } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="justify-start">{home.contactPhone}</div>
                  <Button
                    onClick={() => home.contactPhone && handleCopy(home.contactPhone, "phone", setCopiedField)}
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
                    {revealContact || isModalOpen ? <PhoneCall className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                    <span className="text-xs md:text-sm lg:text-base">{contactButton}</span>
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
