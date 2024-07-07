"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useContext } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps } from "@/lib/sellFlowData";
import { updateHome } from "@/app/sell/actions";

export default function ProgressBar() {
  const router = useRouter();
  const { nextStep, prevStep, stepPercentage } = useContext(SellContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleNext() {
    setIsLoading(true);
    await updateHome();
    router.push(nextStep);
    setIsLoading(false);
  }

  async function handlePrev() {
    setIsLoading(true);
    await updateHome();
    router.push(prevStep);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col justify-start gap-6 items-center w-full h-[100px]">
      <div className="flex justify-between items-center gap-1 w-full">
        {sellSteps.map((_, idx) => (
          <div key={idx} className="flex justify-center items-center w-full">
            <Progress value={stepPercentage[idx]} />
          </div>
        ))}
      </div>
      <div className="flex flex-row-reverse justify-between w-full px-8">
        {nextStep !== "" && (
          <div className="flex">
            isLoading ?
            <Button variant="default" size="lg" onClick={handleNext} disabled={isLoading}>
              {isLoading ? "Next" : "Saving..."}
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={isLoading}>
              {isLoading ? "Back" : "Saving..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
