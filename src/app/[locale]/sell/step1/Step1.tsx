"use client";

import { User } from "next-auth";
import { useContext, useEffect } from "react";
import { SellContext } from "@/context/SellContext";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Step1({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setNextLoading, setPrevLoading } =
    useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);
  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20 md:gap-y-0 md:flex-row">
      <div className="flex flex-col md:flex-row mb-20 w-full h-full justify-center items-center text-center md:text-start">
        <div className="flex flex-col md:flex-row justify-center md:gap-10">
          <div className="flex items-center md:items-center justify-center md:justify-end md:pr-20 py-3">
            <h1 className="flex items-center text-3xl">Step 1.</h1>
          </div>
          <div className="flex flex-col px-8 md:px-0 mt-10 md:mt-0">
            <h3 className="text-xl font-semibold w-full">Tell us about your place</h3>
            <div>Location, size, and details.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
