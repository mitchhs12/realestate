"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Price({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome, setNewHome } =
    useContext(SellContext);
  const [price, setPrice] = useState<number | undefined>(currentHome?.price);

  useEffect(() => {
    if (currentHome) {
      setNewHome({
        ...currentHome,
        listingFlowStep: sellFlatIndex,
      });
    }
  }, [price]);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Pricing</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Set your price</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
