"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useContext } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps } from "@/lib/sellFlowData";

export default function ProgressBar() {
  const router = useRouter();
  const { nextStep, prevStep, stepPercentage } = useContext(SellContext);

  // useEffect(() => {
  //   if (outerIndex !== 0 || innerIndex !== 0) {
  //     console.log("innerIndex", innerIndex, "outerIndex", outerIndex);
  //     if (innerIndex !== 0) {
  //       const currentProgress = (innerIndex / steps[outerIndex].length) * 100;
  //       console.log("currentProgress", currentProgress);
  //       setProgress(currentProgress);
  //     } else {
  //       console.log(innerIndex, outerIndex);
  //     }
  //   }
  //   if (outerIndex > steps[outerIndex].length) {
  //     console.log("running A");
  //     setProgress(0);
  //     setNextStep("/");
  //     setPrevStep(steps[outerIndex - 1][steps[outerIndex - 1].length - 1]);
  //   } else if (innerIndex === 0) {
  //     console.log("running B");
  //     console.log("we are goiong into a new progress bar!");
  //     setNextStep(steps[outerIndex][innerIndex]);
  //     setProgress(0);
  //     if (outerIndex !== 0 || innerIndex !== 0) {
  //       const prevStepLength = steps[outerIndex - 1].length - 2;
  //       console.log(prevStepLength);
  //       const newPrevStep = steps[outerIndex - 1][prevStepLength];
  //       console.log("newPrevStep", newPrevStep);
  //       setPrevStep(newPrevStep);
  //     }
  //   } else {
  //     console.log("running C");
  //     const newNextStep = steps[outerIndex][innerIndex];
  //     let newPrevStep = steps[outerIndex][innerIndex - 2];
  //     console.log("newNextStep", newNextStep);
  //     console.log("newPrevStep", newPrevStep);
  //     setNextStep(newNextStep);
  //     if (!newPrevStep) {
  //       if (outerIndex !== 0) {
  //         newPrevStep = steps[outerIndex - 1][steps[outerIndex - 1].length - 1];
  //       } else {
  //         newPrevStep = "/sell";
  //       }
  //     }
  //     console.log(newPrevStep);
  //     setPrevStep(newPrevStep);
  //   }
  //   router.prefetch(nextStep);
  //   router.prefetch(prevStep);
  // }, [innerIndex, outerIndex]);

  // useEffect(() => {
  //   const newProgressArray = [...progressArray];
  //   if (progress === 0 && outerIndex > 0) {
  //     newProgressArray[outerIndex - 1] = 100;
  //   } else {
  //     newProgressArray[outerIndex] = progress;
  //   }
  //   setProgressArray(newProgressArray);
  //   console.log("Current Progress", progress);
  // }, [progress]);

  // const handleNext = () => {
  //   const newInnerIndex = innerIndex + 1;
  //   let nextPage = nextStep;
  //   try {
  //     if (newInnerIndex <= steps[outerIndex].length - 1) {
  //       setInnerIndex(innerIndex + 1);
  //     } else if (outerIndex <= steps.length - 1) {
  //       setOuterIndex(outerIndex + 1);
  //       setInnerIndex(0);
  //     }
  //   } catch (error) {
  //     nextPage = "/";
  //   }
  //   router.push(nextPage);
  // };

  // useEffect(() => {
  //   console.log("nextStep", nextStep);
  //   console.log("prevStep", prevStep);
  // }, [prevStep, nextStep]);

  // const handlePrevious = () => {
  //   console.log("current inner index", innerIndex);
  //   console.log("current outer index", outerIndex);
  //   const newInnerIndex = innerIndex - 1;
  //   console.log("newInnerIndex", newInnerIndex);
  //   if (newInnerIndex > 0) {
  //     setInnerIndex(innerIndex - 1);
  //   } else if (outerIndex > 0) {
  //     setOuterIndex(outerIndex - 1);
  //     setInnerIndex(steps[outerIndex - 1].length - 1);
  //   } else {
  //     setInnerIndex(0);
  //     setOuterIndex(0);
  //   }
  //   router.push(prevStep);
  // };

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
            <Button variant="default" size="lg" onClick={() => router.push(nextStep)}>
              Next
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={() => router.push(prevStep)}>
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
