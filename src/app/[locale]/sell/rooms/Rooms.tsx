"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import CounterComponent from "@/components/CounterComponent";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Rooms({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    currentHome,
    setNewHome,
  } = useContext(SellContext);

  const [bedrooms, setBedrooms] = useState(currentHome?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(currentHome?.bathrooms || 0);
  const [livingrooms, setLivingrooms] = useState(currentHome?.livingrooms || 0);
  const [kitchens, setKitchens] = useState(currentHome?.kitchens || 0);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && (bedrooms > 0 || bathrooms > 0 || livingrooms > 0 || kitchens > 0)) {
      setNewHome({
        ...currentHome,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        livingrooms: livingrooms,
        kitchens: kitchens,
      });
    }
  }, [bedrooms, bathrooms, livingrooms, kitchens]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Rooms</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">How many does your property have?</h3>
          </div>
          <div className="flex h-full w-full justify-center">
            <div className="flex flex-col h-full justify-center items-center w-[80vw] md:w-[60vw] xl:w-[40vw] text-lg md:text-xl xl:text-2xl">
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">Bedrooms</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bedrooms} setState={setBedrooms} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">Bathrooms</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bathrooms} setState={setBathrooms} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">Living rooms</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={livingrooms} setState={setLivingrooms} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">Kitchens</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={kitchens} setState={setKitchens} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
