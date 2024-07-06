"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, usePathname } from "next/navigation";

interface ProgressBarProps {
  steps: string[][];
}

export default function ProgressBar({ steps }: ProgressBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [outerIndex, setOuterIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [nextStep, setNextStep] = useState(steps[0][0]);
  const [progress, setProgress] = useState(30);

  // Initialize progress for each outer index
  const [progressArray, setProgressArray] = useState(() => Array(steps.length).fill(0));

  console.log("progress", progress);

  useEffect(() => {
    // Calculate progress for the current step group
    const currentProgress = ((innerIndex + 1) / steps[outerIndex].length) * 100;

    // Update the progress array for the current outer index
    setProgressArray((prevProgressArray) => {
      const newProgressArray = [...prevProgressArray];
      newProgressArray[outerIndex] = currentProgress;
      return newProgressArray;
    });

    // Calculate the next step
    const nextStep = steps[outerIndex][innerIndex];
    if (nextStep) {
      router.prefetch(nextStep);
    }
  }, [innerIndex, outerIndex]);

  const handleNext = () => {
    if (innerIndex < steps[outerIndex].length - 1) {
      setInnerIndex(innerIndex + 1);
      console.log("trying to push to", nextStep);
      router.push(nextStep);
    } else if (outerIndex < steps.length - 1) {
      setOuterIndex(outerIndex + 1);
      setInnerIndex(0);
      console.log("trying to push to", nextStep);
      router.push(nextStep);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-y-4 h-[100px]">
      <div className="flex gap-1 w-full items-center">
        {steps.map(() => {
          return (
            <div className="flex items-center w-full">
              <Progress value={progress} />
            </div>
          );
        })}
      </div>
      <div className="flex px-4 w-full">
        <Button className="flex justify-start" variant="outline" onClick={() => router.back()}>
          Back
        </Button>

        <Button className="flex justify-end" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
