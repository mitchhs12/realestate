"use client";

import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import CheckoutCard from "./CheckoutCard";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";

interface Tier {
  title: string;
  subtitle: string;
  price: number | string;
  anchor?: number;
  perks: {
    title: string;
    subtitle: string;
  }[];
}

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  premium: Tier;
  standard: Tier;
}

export default function Checkout({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  premium,
  standard,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setCurrentHome,
    setNewHome,
  } = useContext(SellContext);

  const [selected, setSelected] = useState<string>(currentHome?.listingType ? currentHome?.listingType : "");
  const { defaultCurrency } = useContext(LocaleContext);

  useEffect(() => {
    setCurrentHome(currentHome);
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

  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center gap-y-12">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
        </div>
        {defaultCurrency && (
          <div className={`flex flex-col md:flex-row justify-center py-8 px-8 gap-8 `}>
            <CheckoutCard
              id={"premium"}
              perks={premium.perks}
              title={premium.title}
              description={premium.subtitle}
              button={premium.price}
              buttonDisabled={false}
              originalPrice={premium.anchor}
              buttonFunction={() => setSelected("premium")}
              selected={selected}
              defaultCurrency={defaultCurrency}
            />
            <CheckoutCard
              id={"standard"}
              perks={standard.perks}
              title={standard.title}
              description={standard.subtitle}
              button={standard.price}
              buttonDisabled={false}
              buttonFunction={() => setSelected("standard")}
              selected={selected}
              defaultCurrency={defaultCurrency}
            />
          </div>
        )}
      </div>
    </div>
  );
}
