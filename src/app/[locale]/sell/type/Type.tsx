"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import { typeIcons } from "@/components/Icons/typeIcons";
import { IconProps } from "@/components/Icons/typeIcons";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  options: { id: string; name: string; translation: string }[];
}

const IconWrapper: React.FC<{ Component: React.FC<IconProps>; color: string; width: number; height: number }> = ({
  Component,
  color,
  width,
  height,
}) => {
  return <Component color={color} width={width} height={height} />;
};

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
              {options.map((type, index) => {
                const IconComponent = typeIcons[type.id as keyof typeof typeIcons]; // Get the corresponding icon
                return (
                  <ToggleGroupItem
                    variant={"outline"}
                    key={index}
                    value={type.name}
                    className="flex h-[50px] md:h-[80px] xl:h-[120px] items-center justify-center border-2 text-sm md:text-lg"
                  >
                    <div className="flex gap-2 items-center justify-center text-bottom border-2">
                      {/* {IconComponent && <IconWrapper Component={IconComponent} color="white" width={10} height={10} />} */}
                      {type.translation}
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
