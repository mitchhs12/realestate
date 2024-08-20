"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title_text: string;
  subtitle: string;
  warning: string;
}

export default function Title({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title_text,
  subtitle,
  warning,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setCurrentHome,
    setPrevLoading,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);
  const [title, setTitle] = useState<string>(currentHome?.title ? currentHome?.title : "");

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
    if (title.length > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, []);

  useEffect(() => {
    if (currentHome && title.length > 0 && title.length < 32) {
      setNextDisabled(false);
      setNewHome({ ...currentHome, title: title });
    } else {
      setNextDisabled(true);
    }
  }, [title]);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (newValue.length <= 32) {
      setTitle(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title_text}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
          <div className="flex flex-col px-8 justify-center w-full h-full">
            <div className="flex h-1/4 justify-center items-end">
              <Input
                type="text"
                value={title}
                placeholder="Enter your property title..."
                className={`w-full sm:w-[70%] md:w-[60%] lg:w-[50%] text-center resize-y overflow-y-auto ${
                  title.length === 32 && "border-red-500"
                }`}
                onChange={handleChange}
              />
            </div>
            <div className="flex h-3/4 justify-center text-sm">
              {title.length === 32 && <span className="text-red-500">{warning}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
