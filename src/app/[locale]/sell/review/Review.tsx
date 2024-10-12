"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ReloadIcon, CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import { LocaleContext } from "@/context/LocaleContext";
import { formatNumber } from "@/lib/utils";
import { BedDouble, CookingPot, Bath, Sofa } from "lucide-react";
import { typeIcons } from "@/components/Icons/typeIcons";
import { featureIcons } from "@/components/Icons/featureIcons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title_text: string;
  subtitle_text: string;
  bedrooms_text: string;
  bathrooms_text: string;
  livingRooms_text: string;
  kitchens_text: string;
  listing_text: string;
  type_text: string;
  capacity_text: string;
  area_text: string;
  m_text: string;
  ft_text: string;
  features_text: string;
  contactName_text: string;
  contactEmail_text: string;
  contactPhone_text: string;
  price_text: string;
  negotiable_text: string;
  matchingFeatures: { id: string; translation: string }[];
  matchingTypes: { id: string; translation: string }[];
  matchingListingType: { id: string; translation: string } | undefined;
  change_to_feet: string;
  change_to_metres: string;
}

export default function Review({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title_text,
  subtitle_text,
  bedrooms_text,
  bathrooms_text,
  livingRooms_text,
  kitchens_text,
  listing_text,
  type_text,
  capacity_text,
  area_text,
  m_text,
  ft_text,
  features_text,
  contactName_text,
  contactEmail_text,
  contactPhone_text,
  price_text,
  negotiable_text,
  matchingFeatures,
  matchingTypes,
  matchingListingType,
  change_to_feet,
  change_to_metres,
}: Props) {
  const {
    setNewHome,
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setCurrentHome,
    setNextLoading,
    setPrevLoading,
  } = useContext(SellContext);

  useEffect(() => {
    setCurrentHome(currentHome);
    setNewHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  const title = currentHome?.title || "";
  const description = currentHome?.description || "";
  const address = currentHome?.address || "";
  const bedrooms = currentHome?.bedrooms || 0;
  const bathrooms = currentHome?.bathrooms || 0;
  const livingRooms = currentHome?.livingrooms || 0;
  const kitchens = currentHome?.kitchens || 0;
  const capacity = currentHome?.capacity || 0;
  const areaSqm = currentHome?.areaSqm || 0;
  const photos = currentHome?.photos || [];
  const price = currentHome?.price || 0;
  const currency = currentHome?.currency || "";
  const priceNegotiable = currentHome?.priceNegotiable;
  const contactName = currentHome?.contactName || "";
  const contactEmail = currentHome?.contactEmail || "";
  const contactPhone = currentHome?.contactPhone || "";

  const [feet, setFeet] = useState(false);
  const [loadingStates, setLoadingStates] = useState(photos.map(() => true));
  const [sqSize, setSqSize] = useState(areaSqm);
  const { numerals } = useContext(LocaleContext);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    const ftConversion = 10.76391042;
    setSqSize(!feet ? areaSqm : Math.round(areaSqm * ftConversion));
  }, [feet]);

  const handleImageLoad = (index: number) => {
    setLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-auto max-w-7xl justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title_text}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle_text}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full h-full md:flex-row justify-center py-8 px-6 gap-8 lg:p-4">
          <Card className="w-full h-auto flex flex-col p-2 xs:p-4 sm:p-8 gap-4">
            <CardHeader className="gap-8">
              <CardTitle className="text-md md:text-2xl font-bold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <div className="flex flex-col justify-center text-left gap-y-8 h-full w-full">
                <p className="flex flex-col text-center">{address}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 justify-center items-center">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative flex items-center justify-center border w-full h-[133px] md:h-[166px] xl:h-[200px] shadow-md rounded-xl"
                    >
                      <Image
                        src={photo}
                        alt={`Uploaded ${index}`}
                        fill={true}
                        className="object-cover object-center rounded-xl"
                        onLoad={() => handleImageLoad(index)}
                      />
                      {loadingStates[index] && (
                        <div className="absolute flex items-center justify-center inset-0 bg-black bg-opacity-50 rounded">
                          <ReloadIcon className="animate-spin w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 flex items-center justify-center">
                        <Badge variant="secondary">{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col text-center justify-center items-center w-full h-full rounded-2xl">
                  <div className="flex flex-col w-full h-full max-w-8xl text-center gap-8">
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col w-full justify-center items-center overflow-auto text-sm md:text-md lg:text-lg gap-y-4">
                        <div className="flex flex-col w-full">
                          <div className="flex justify-center w-full text-lg py-4">
                            <strong>{listing_text}</strong>
                            <span className="ml-2">{matchingListingType?.translation}</span>
                          </div>
                          <Separator />
                        </div>
                        <div className="grid grid-rows-4 grid-cols-1 xs:grid-rows-2 xs:grid-cols-2 lg:grid-cols-4 lg:grid-rows-1 justify-between w-full gap-3 py-4">
                          <div className="flex xs:justify-start xs:items-start lg:justify-center lg:items-center">
                            <div className="flex justify-between lg:justify-center items-center gap-3 text-center lg:w-full w-[180px]">
                              <div className="flex gap-3 items-center">
                                <BedDouble className="w-6 h-6" />
                                <strong>{bedrooms_text}</strong>
                              </div>
                              <span>{formatNumber(bedrooms, numerals)}</span>
                            </div>
                          </div>
                          <div className="flex xs:justify-end xs:items-end lg:justify-center lg:items-center">
                            <div className="flex flex-row justify-between lg:justify-center items-center gap-3 text-center lg:w-full w-[180px]">
                              <div className="flex gap-3 items-center">
                                <Bath className="w-6 h-6" />
                                <strong className="justify-start">{bathrooms_text}</strong>
                              </div>
                              <span>{formatNumber(bathrooms, numerals)}</span>
                            </div>
                          </div>
                          <div className="flex xs:justify-start xs:items-start lg:justify-center lg:items-center">
                            <div className="flex flex-row justify-between lg:justify-center items-center gap-3 text-center lg:w-full w-[180px]">
                              <div className="flex gap-3 items-center">
                                <Sofa className="w-6 h-6" />
                                <strong>{livingRooms_text}</strong>
                              </div>
                              <span>{formatNumber(livingRooms, numerals)}</span>
                            </div>
                          </div>
                          <div className="flex xs:justify-end xs:items-end lg:justify-center lg:items-center">
                            <div className="flex flex-row justify-between lg:justify-center items-center gap-3 text-center lg:w-full w-[180px]">
                              <div className="flex gap-3 items-center">
                                <CookingPot className="w-6 h-6" />
                                <strong>{kitchens_text}</strong>
                              </div>
                              <span>{formatNumber(kitchens, numerals)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col xs:flex-row w-full text-end text-sm md:text-md lg:text-lg gap-y-4">
                          <div className="flex justify-start w-full xs:w-1/2">
                            <strong>{capacity_text}</strong>
                            <span className="ml-2">{formatNumber(capacity, numerals)}</span>
                          </div>
                          <div className="flex flex-col w-full xs:w-1/2">
                            <div className="flex items-center xs:justify-end w-full">
                              <strong className="flex justify-start">{area_text}</strong>
                              <span className="flex items-center ml-2">
                                {formatNumber(sqSize, numerals)} {!feet ? m_text : ft_text}
                              </span>
                            </div>
                            <div className="flex items-center xs:justify-end">
                              <Button
                                variant={"outline"}
                                onClick={() => {
                                  setFeet(!feet);
                                }}
                              >
                                {!feet ? change_to_metres : change_to_feet}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-8">
                        <div className="flex flex-col xs:flex-row text-sm md:text-md lg:text-lg justify-between">
                          <div className="flex flex-col text-left">
                            <p>
                              <strong>{type_text}</strong>
                            </p>
                            <ul className="list-disc list-inside">
                              {matchingTypes.map((type, index) => {
                                const TypeIcon = typeIcons[type.id as keyof typeof typeIcons]; // Get the corresponding icon
                                return (
                                  <li key={index} className="flex w-full items-center gap-3 mb-4">
                                    {TypeIcon && (
                                      <div className="flex justify-center items-center">
                                        <TypeIcon color={theme === "dark" ? "white" : "black"} width={32} height={32} />
                                      </div>
                                    )}
                                    {type.translation}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          <div className="flex flex-col text-left">
                            <p>
                              <strong>{features_text}</strong>
                            </p>
                            <ul className="list-disc list-inside">
                              {matchingFeatures.map((feature, index) => {
                                const FeatureIcon = featureIcons[feature.id as keyof typeof featureIcons]; // Get the corresponding icon
                                return (
                                  <li key={index} className="flex w-full items-center gap-3 mb-4">
                                    {FeatureIcon && (
                                      <div className="flex justify-center items-center">
                                        <FeatureIcon
                                          color={theme === "dark" ? "white" : "black"}
                                          width={32}
                                          height={32}
                                        />
                                      </div>
                                    )}
                                    {feature.translation}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full justify-between items-center md:items-start gap-4 pb-4">
                      <strong className="flex justify-center items-center gap-x-4 text-md sm:text-xl overflow-auto">
                        {price_text}
                        <p>{formatPrice(currency, price, 0)}</p>
                        <p>{currency}</p>
                      </strong>
                      <div>
                        <p className="flex items-center gap-2 text-start text-sm sm:text-lg">
                          <strong>{negotiable_text}</strong>
                          {priceNegotiable ? (
                            <CheckCircledIcon className="text-green-500 w-4 h-4 sm:w-6 sm:h-6" />
                          ) : (
                            <CrossCircledIcon className="text-red-500 w-4 h-4 sm:w-6 sm:h-6" />
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col text-center xs:text-start gap-2 text-md lg:text-lg">
                      <div className="flex flex-col xs:gap-3 xs:flex-row">
                        <strong className="xs:text-end xs:w-1/2">{contactName_text}</strong>{" "}
                        <span className="xs:w-1/2">{contactName}</span>
                      </div>
                      <div className="flex flex-col xs:gap-3 xs:flex-row">
                        <strong className="xs:text-end xs:w-1/2">{contactEmail_text}</strong>{" "}
                        <span className="xs:w-1/2">{contactEmail}</span>
                      </div>
                      <div className="flex flex-col xs:gap-3 xs:flex-row">
                        <strong className="xs:text-end xs:w-1/2">{contactPhone_text}</strong>{" "}
                        <span className="xs:w-1/2">{contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
