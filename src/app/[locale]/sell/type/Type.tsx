"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/lib/utils";
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  options: { id: string; translation: string }[];
}

export default function Type({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  options,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setCurrentHome,
    setSellFlowIndices,
    setStepPercentage,
    setNewHome,
    setNextLoading,
    setPrevLoading,
  } = useContext(SellContext);

  const [selection, setSelection] = useState<string[]>(currentHome?.type || []);

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
      setNewHome({ ...currentHome, type: selection });
    }
  }, [selection]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
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
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8 xl:gap-8 items-center justify-center">
              {options.map((type, index) => (
                <ToggleGroupItem
                  key={index}
                  value={type.id}
                  className="h-[50px] md:h-[80px] xl:h-[120px] border-2 text-sm md:text-lg"
                >
                  {type.translation}
                </ToggleGroupItem>
              ))}
            </div>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
