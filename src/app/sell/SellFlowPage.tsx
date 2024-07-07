"use client";

import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { UpdateNameValues, updateNameSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useEffect, useContext } from "react";
import { SellContext } from "@/context/SellContext";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}
export default function SellFlowPage({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage } = useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
  }, []);

  const form = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name || "" },
  });

  return (
    <div className="flex flex-col h-full justify-start md:justify-center items-center gap-y-20 md:gap-y-0 md:flex-row w-full">
      <div className="flex flex-col md:flex-row w-full h-full justify-start items-center">
        <div className="flex w-1/2 items-center md:items-center justify-center py-3 text-center text-nowrap">
          <h1 className="flex items-center text-3xl">Sell your home</h1>
        </div>
        <div className="flex h-full justify-center items-center flex-col md:items-start gap-8 md:gap-20 w-1/2 md:mr-8 text-wrap">
          <div className="flex flex-col gap-y-20 justify-center">
            <div className="flex flex-col w-[40vw] items-start">
              <h3 className="text-xl font-semibold"> 1. Tell us about your place</h3>
              <div> Location, size, and details.</div>
            </div>
            <Separator />
            <div className="flex flex-col w-[40vw] items-start">
              <h3 className="text-xl font-semibold">2. Make it stand out</h3>
              <div> Upload 5 or more photos, a title, and a description.</div>
            </div>
            <Separator />
            <div className="flex flex-col w-[40vw] items-start">
              <h3 className="text-xl font-semibold">3. Finish up and publish</h3>
              <div> Choose a price, then publish.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
