"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { ReloadIcon, CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { capitalizeFirstLetter } from "@/lib/utils";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Review({ sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome } =
    useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  const [feet, setFeet] = useState(false);

  const title = currentHome?.title || "";
  const description = currentHome?.description || "";
  const address = currentHome?.address || "";
  const type = currentHome?.type || "";
  const features = currentHome?.features || [];
  const bedrooms = currentHome?.bedrooms || 0;
  const bathrooms = currentHome?.bathrooms || 0;
  const livingRooms = currentHome?.livingrooms || 0;
  const kitchens = currentHome?.kitchens || 0;
  const capacity = currentHome?.capacity || 0;
  const areaSqm = currentHome?.areaSqm || 0;
  const photos = currentHome?.photos || [];
  const price = currentHome?.price || 0;
  const priceNegotiable = currentHome?.priceNegotiable;
  const contactName = currentHome?.contactName || "";
  const contactEmail = currentHome?.contactEmail || "";
  const contactPhone = currentHome?.contactPhone || "";
  const listingType = currentHome?.listingType || "";

  const [loadingStates, setLoadingStates] = useState(photos.map(() => true));
  const [sqSize, setSqSize] = useState(areaSqm);

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
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Review</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Review your property details</h3>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center py-8 px-6 gap-8">
          <Card className="w-full h-auto flex flex-col xs:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-col text-left gap-y-8">
                <p className="flex flex-col text-center">{address}</p>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 justify-center items-center">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative flex items-center justify-center h-[100px]">
                      <Image
                        src={photo}
                        alt={`Uploaded ${index}`}
                        fill={true}
                        className="object-cover"
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
                <Separator />

                <div className="flex w-full justify-center items-center">
                  <div className="flex justify-center w-full gap-12">
                    <div className="flex flex-col w-1/2 justify-center items-center overflow-auto">
                      <div className="flex justify-between w-full">
                        <strong>Bedrooms: </strong>
                        <span>{bedrooms}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong className="justify-start">Bathrooms:</strong> <span>{bathrooms}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong>Living rooms:</strong> <span>{livingRooms}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong>Kitchens:</strong> <span>{kitchens}</span>
                      </div>
                    </div>
                    <div className="flex w-1/3"></div>
                    <div className="flex flex-col w-1/2">
                      <div className="flex justify-between w-full">
                        <strong>Listing: </strong>
                        <span>{capitalizeFirstLetter(listingType)}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong>Type: </strong>
                        <span>{type}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong>Capacity: </strong>
                        <span>{capacity}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <strong>
                          Area{" "}
                          <button
                            className="hover:bg-accent hover:text-accent-foreground underline"
                            onClick={() => {
                              setFeet(!feet);
                            }}
                          >
                            {!feet ? "(sqm)" : "(sqft)"}
                          </button>
                          :{" "}
                        </strong>
                        <span>{sqSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-2/3 text-left">
                  <p>
                    <strong>Features:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col">
                  <p>
                    <strong>Contact Name:</strong> {contactName}
                  </p>
                  <p>
                    <strong>Contact Email:</strong> {contactEmail}
                  </p>
                  <p>
                    <strong>Contact Phone:</strong> {contactPhone}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex items-center justify-center w-full h-[90px] text-lg">
                <div className="flex w-1/2 justify-center items-center">Price: {price}</div>
                <div className="flex w-1/2 justify-center items-center gap-x-2">
                  {priceNegotiable ? "Non-negotiable" : "Negotiable"}
                  {priceNegotiable ? <CrossCircledIcon /> : <CheckCircledIcon />}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
