"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { types } from "@/lib/sellFlowData";

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

  console.log(selection);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selection.length && currentHome) {
      setNewHome({ ...currentHome, type: selection });
    }
  }, [selection]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Type</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Which best describes your place?</h3>
          </div>
        </div>
        <div className="grid w-full h-full px-8 justify-center items-center pt-8">
          <ToggleGroup
            type="multiple"
            value={selection}
            defaultValue={selection}
            onValueChange={(value) => {
              if (value) setSelection(value.map(capitalizeFirstLetter));
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8 xl:gap-8 items-center justify-center">
              {types.map((type, index) => (
                <ToggleGroupItem
                  key={index}
                  value={type}
                  className="h-[50px] md:h-[80px] xl:h-[120px] border-2 text-sm md:text-lg"
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </div>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
