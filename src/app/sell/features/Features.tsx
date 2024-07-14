"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { features } from "@/lib/sellFlowData";
interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Type({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, currentHome, setNewHome, setIsLoading } =
    useContext(SellContext);

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [selection, setSelection] = useState<string[]>(currentHome?.type || []);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("running this effect");
    if (currentHome) {
      console.log("updating new home :)");
      setNewHome({ ...currentHome, features: selection });
    }
  }, [selection]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Features</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Which of these does your property have?</h3>
          </div>
        </div>
        <div className="grid w-full h-full px-8 justify-center items-center py-8 overflow-auto">
          <ToggleGroup
            type="multiple"
            value={selection}
            defaultValue={selection}
            onValueChange={(value) => {
              if (value) setSelection(value.map(capitalizeFirstLetter));
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-8 xl:gap-8 items-center justify-center">
              {features.map((feature, index) => (
                <ToggleGroupItem
                  key={index}
                  value={feature}
                  className="h-[50px] md:h-[80px] xl:h-[120px] border-2 text-xs sm:text-sm md:text-lg"
                >
                  {feature}
                </ToggleGroupItem>
              ))}
            </div>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
