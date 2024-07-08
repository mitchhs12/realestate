"use client";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps, stepsFlattened, stepLengths } from "@/lib/sellFlowData";
import { updateHome } from "@/app/sell/actions";

export default function ProgressBar() {
  const router = useRouter();
  const { nextStep, prevStep, stepPercentage, currentHome, canSubmit } = useContext(SellContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleNext() {
    setIsLoading(true);
    if (prevStep === "" && currentHome) {
      // we are on the first page of the sell flow
      const step = currentHome.listingFlowStep;
      router.push(
        stepsFlattened[
          step <= stepLengths[0] - 1 ? step : step <= stepLengths[0] - 1 + stepLengths[1] - 1 ? step - 1 : step - 2
        ]
      );
    } else {
      await updateHome(currentHome);
      router.push(nextStep);
    }
    setIsLoading(false);
  }

  async function handlePrev() {
    setIsLoading(true);
    await updateHome(currentHome);
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
            <Button variant="default" size="lg" onClick={handleNext} disabled={isLoading || !canSubmit}>
              {!isLoading ? "Next" : "Saving..."}
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={isLoading}>
              {!isLoading ? "Back" : "Saving..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
