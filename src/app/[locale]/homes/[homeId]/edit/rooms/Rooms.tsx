"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Separator } from "@/components/ui/separator";
import CounterComponent from "@/components/CounterComponent";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  bedrooms_text: string;
  bathrooms_text: string;
  livingrooms_text: string;
  kitchens_text: string;
}

export default function Rooms({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  bedrooms_text,
  bathrooms_text,
  livingrooms_text,
  kitchens_text,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setCurrentHome,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setNewHome,
  } = useContext(SellContext);
  const { numerals } = useContext(LocaleContext);

  const [bedrooms, setBedrooms] = useState(currentHome?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(currentHome?.bathrooms || 0);
  const [livingrooms, setLivingrooms] = useState(currentHome?.livingrooms || 0);
  const [kitchens, setKitchens] = useState(currentHome?.kitchens || 0);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome) {
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
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
          <div className="flex h-full w-full justify-center">
            <div className="flex flex-col h-full justify-center items-center w-[80vw] md:w-[60vw] xl:w-[40vw] text-lg md:text-xl xl:text-2xl">
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{bedrooms_text}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bedrooms} setState={setBedrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{bathrooms_text}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bathrooms} setState={setBathrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{livingrooms_text}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={livingrooms} setState={setLivingrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{kitchens_text}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={kitchens} setState={setKitchens} numerals={numerals} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
