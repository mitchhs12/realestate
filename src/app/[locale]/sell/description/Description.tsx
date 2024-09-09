"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Textarea } from "@/components/ui/textarea";
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  warning: string;
  placeholder: string;
}

export default function Description({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  warning,
  placeholder,
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
  const [description, setDescription] = useState<string>(currentHome?.description ? currentHome?.description : "");

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
    if (description.length > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, []);

  useEffect(() => {
    if (currentHome && description.length > 0 && description.length < 3000) {
      setNextDisabled(false);
      setNewHome({ ...currentHome, description: description });
    } else {
      setNextDisabled(true);
    }
  }, [description]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
        </div>

        <div className="flex flex-col max-w-7xl w-full h-full px-12 justify-center mt-10">
          <Textarea
            value={description}
            placeholder={placeholder}
            className={`border-2 text-start ${description.length === 3000 && "border-red-500"}`}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={3000}
          />
          <div className="flex justify-center text-sm min-h-12">
            {description.length === 3000 && <span className="text-red-500">{warning}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
