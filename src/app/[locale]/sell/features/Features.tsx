"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HomeType } from "@/lib/validations";
import { featureIcons } from "@/components/Icons/featureIcons";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  options: { id: string; name: string; translation: string }[];
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
    setSellFlowIndices,
    setStepPercentage,
    setNewHome,
    setCurrentHome,
    setNextLoading,
    setPrevLoading,
    setNextDisabled,
  } = useContext(SellContext);

  const [selection, setSelection] = useState<string[]>(currentHome?.features ? currentHome?.features : []);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    if (selection.length === 0) {
      setNextDisabled(true);
    }
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && selection.length > 0) {
      setNextDisabled(false);
      setNewHome({ ...currentHome, features: selection });
    } else if (selection.length === 0) {
      setNextDisabled(true);
    }
  }, [selection]);

  const handleValueChange = (value: string[]) => {
    if (value.includes("None")) {
      setSelection(["None"]);
    } else {
      setSelection(value.filter((v) => v !== "None"));
    }
  };

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
        <div className="w-full h-full justify-center items-center py-8 px-4 sm:px-8 overflow-auto">
          <ToggleGroup type="multiple" value={selection} defaultValue={selection} onValueChange={handleValueChange}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:gap-8 items-center justify-center">
              {options.map((feature, index) => {
                const IconComponent = featureIcons[feature.id as keyof typeof featureIcons]; // Get the corresponding icon
                return (
                  <ToggleGroupItem
                    variant={"outline"}
                    key={index}
                    value={feature.name}
                    className="flex px-2 gap-3 justify-center items-center h-[50px] md:h-[80px] xl:h-[120px] text-xs md:text-sm lg:text-md"
                  >
                    <div className="flex lg:w-1/2 justify-start lg:justify-center lg:items-center items-start">
                      {IconComponent && (
                        <div className="flex justify-center items-center">
                          <IconComponent color="gray" width={40} height={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex w-1/2 h-full">
                      <div className="flex w-full h-full items-center justify-start text-start">
                        {feature.translation}
                      </div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </div>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
