"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Title({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    currentHome,
    setNewHome,
  } = useContext(SellContext);
  const [title, setTitle] = useState<string>(currentHome?.title ? currentHome?.title : "");

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && title.length > 0 && title.length < 32) {
      setNewHome({ ...currentHome, title: title });
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
            <h1 className="flex items-center text-3xl">Title</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">What should we call your property?</h3>
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
              {title.length === 32 && <span className="text-red-500">Please choose a smaller title.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
