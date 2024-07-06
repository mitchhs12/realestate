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
  const [progress, setProgress] = useState(0);

  // Initialize progress for each outer index
  const [progressArray, setProgressArray] = useState(() => Array(steps.length).fill(0));

  useEffect(() => {
    try {
      if (outerIndex !== 0 || innerIndex !== 0) {
        setProgress((innerIndex / steps[outerIndex].length) * 100);
      }
      const nextStep = steps[outerIndex][innerIndex];
      setNextStep(nextStep);
    } catch (error) {
      setProgress(0);
      setNextStep("/");
    }
    router.prefetch(nextStep);
  }, [innerIndex, outerIndex]);

  useEffect(() => {
    const newProgressArray = [...progressArray];
    if (progress === 0 && outerIndex > 0) {
      newProgressArray[outerIndex - 1] = 100;
    } else {
      newProgressArray[outerIndex] = progress;
    }
    setProgressArray(newProgressArray);
  }, [progress]);

  const handleNext = () => {
    const newInnerIndex = innerIndex + 1;
    let nextPage = nextStep;
    try {
      if (newInnerIndex <= steps[outerIndex].length - 1) {
        setInnerIndex(innerIndex + 1);
      } else if (outerIndex <= steps.length - 1) {
        setOuterIndex(outerIndex + 1);
        setInnerIndex(0);
      }
    } catch (error) {
      // we're done
      nextPage = "/";
    }
    router.push(nextPage);
  };

  return (
    <div className="flex flex-col justify-start gap-6 items-center w-full h-[100px]">
      <div className="flex justify-between items-center gap-1 w-full">
        {steps.map((_, idx) => (
          <div key={idx} className="flex justify-center items-center w-full">
            <Progress value={progressArray[idx]} />
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full px-8">
        <div className="flex justify-start">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            Back
          </Button>
        </div>
        <div className="flex justify-end">
          <Button variant="default" size="lg" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
