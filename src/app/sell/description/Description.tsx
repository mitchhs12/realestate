"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Description({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    currentHome,
    setNewHome,
    setNextLoading,
    setPrevLoading,
  } = useContext(SellContext);
  const [description, setDescription] = useState<string>(currentHome?.description ? currentHome?.description : "");

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && description.length > 0 && description.length < 500) {
      setNewHome({ ...currentHome, description: description });
    }
  }, [description]);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (newValue.length <= 500) {
      setDescription(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Description</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Describe your property (30+ words required)</h3>
          </div>
        </div>

        <div className="flex flex-col px-8 justify-center w-full h-full mt-10">
          <div className="flex h-full justify-center items-end">
            <Textarea
              value={description}
              placeholder="Provide a brief overview of your property..."
              className={`w-full sm:w-[70%] md:w-[60%] lg:w-[50%] h-full text-center ${
                description.length === 500 && "border-red-500"
              }`}
              onChange={handleChange}
            />
          </div>
          <div className="flex h-full justify-center text-sm">
            {description.length === 500 && <span className="text-red-500">Please write a shorter description.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
