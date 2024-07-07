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

export default function Features({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage } = useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Features</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Select your property features</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
