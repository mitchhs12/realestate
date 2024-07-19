"use client";
import { User } from "next-auth";
import { useContext, useEffect } from "react";
import { SellContext } from "@/context/SellContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Review({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome } =
    useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

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
        <div className="flex flex-col md:flex-row justify-center py-8 px-8 gap-8">
          <Card className="w-full md:w-[600px] h-auto flex flex-col p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-col text-left gap-y-8">
                <p className="flex flex-col text-center">{address}</p>
                <div className="flex w-full justify-center items-center">
                  <div className="flex justify-center w-2/3">
                    <div className="flex flex-col w-1/2">
                      <p>
                        <strong>Type:</strong> {type}
                      </p>
                      <p>
                        <strong>Capacity:</strong> {capacity}
                      </p>
                      <p>
                        <strong>Area (sqm):</strong> {areaSqm}
                      </p>
                    </div>
                    <div className="flex flex-col w-1/2 items-end">
                      <p>
                        <strong>Bedrooms:</strong> {bedrooms}
                      </p>
                      <p>
                        <strong>Bathrooms:</strong> {bathrooms}
                      </p>
                      <p>
                        <strong>Living Rooms:</strong> {livingRooms}
                      </p>
                      <p>
                        <strong>Kitchens:</strong> {kitchens}
                      </p>
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
            <CardFooter className="flex flex-row justify-center items-center align-middle h-[90px] gap-x-4 border-2">
              <strong className="flex justify-center items-center align-middle">Price: {price}</strong>
              <span className="flex justify-center items-center align-middle">
                {priceNegotiable ? "Negotiable" : "Unnegotiable"}
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
