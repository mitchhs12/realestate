"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Price({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome, setNewHome } =
    useContext(SellContext);
  const [price, setPrice] = useState<number | undefined>(currentHome?.price || 0);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(currentHome?.priceNegotiable || false);

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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setPrice(value);
    } else {
      setPrice(undefined);
    }
  };

  const handleNegotiableChange = (checked: boolean) => {
    setIsNegotiable(checked);
    if (currentHome) {
      setNewHome({ ...currentHome, priceNegotiable: checked });
    }
  };

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
        <div className="flex h-full w-full ">
          <div>
            <Input
              type="number"
              placeholder="Please enter your desired price..."
              value={price !== undefined ? price.toString() : ""}
              onChange={handlePriceChange}
              prefix="$"
            />
          </div>
          <div className="ml-4 flex items-center">
            <Label htmlFor="price-negotiable" className="mr-2">
              Price Negotiable?
            </Label>
            <Switch id="price-negotiable" checked={isNegotiable} onCheckedChange={handleNegotiableChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
