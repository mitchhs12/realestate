"use client";

import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import CheckoutCard from "./CheckoutCard";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Checkout({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    currentHome,
    setNewHome,
  } = useContext(SellContext);

  const [selected, setSelected] = useState<string>(currentHome?.listingType ? currentHome?.listingType : "");

  console.log("selected", selected);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome) {
      setNewHome({
        ...currentHome,
        listingType: selected,
      });
    }
  }, [selected]);

  const freePerks: { title: string; description: string }[] = [
    {
      title: "Standard Listing",
      description: "Your property will be listed with basic visibility.",
    },
    {
      title: "Basic Support",
      description: "Get support within 24-48 hours.",
    },
    {
      title: "Limited Photos",
      description: "Upload up to 5 photos.",
    },
  ];

  const premiumPerks = [
    {
      title: "Featured Listing",
      description: "Your property will be highlighted and appear at the top of user searches.",
    },
    {
      title: "30 Photos",
      description: "Upload a maximum of 30 photos.",
    },
    {
      title: "Social Media Promotion",
      description: "Your listing will be promoted on our social media channels.",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center gap-y-12">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Checkout</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Select your listing type</h3>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center py-8 px-8 gap-8">
          <CheckoutCard
            perks={premiumPerks}
            title={"Premium"}
            description={"Premium perks"}
            button={"Free!"}
            buttonDisabled={false}
            originalPrice="$49.99"
            buttonFunction={() => setSelected("premium")}
            selected={selected}
          />
          <CheckoutCard
            perks={freePerks}
            title={"Standard"}
            description={"Standard perks"}
            button={"Free forever!"}
            buttonDisabled={false}
            buttonFunction={() => setSelected("standard")}
            selected={selected}
          />
        </div>
      </div>
    </div>
  );
}
