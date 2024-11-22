"use client";

import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import CheckoutCard from "./CheckoutCard";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";
import Stripe from "@/app/[locale]/stripe";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  paidText: string;
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
  paidText,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setCurrentHome,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);

  const [selected, setSelected] = useState<string>(currentHome?.listingType ? currentHome?.listingType : "");
  const { defaultCurrency } = useContext(LocaleContext);
  const [isOpen, setIsOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && currentHome.listingType) {
      setNextDisabled(false);
    }
  }, [currentHome]);

  useEffect(() => {
    if (currentHome) {
      setNewHome({
        ...currentHome,
        listingType: selected,
      });
    }
  }, [selected]);

  return (
    <>
      <div className="flex flex-col h-full w-full gap-y-20">
        <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
          <div className="flex flex-col pb-4">
            <div className="flex items-center justify-center py-3">
              <h1 className="flex items-center text-3xl">{title}</h1>
            </div>
            <div className="flex flex-col px-8 mt-5">
              <h3 className="text-lg w-full">{subtitle}</h3>
            </div>
          </div>
          {defaultCurrency && (
            <div className={`flex flex-col md:flex-row justify-start w-full md:w-auto pb-6 gap-8 overflow-auto`}>
              <CheckoutCard
                id={"premium"}
                perks={premium.perks}
                title={premium.title}
                description={premium.subtitle}
                button={hasPaid ? paidText : premium.price}
                buttonDisabled={true} // currently disabled because changed how purchasing works
                originalPrice={premium.anchor}
                buttonFunction={() => setIsOpen(true)}
                selected={selected}
                defaultCurrency={defaultCurrency}
              />
              <CheckoutCard
                id={"standard"}
                perks={standard.perks}
                title={standard.title}
                description={standard.subtitle}
                button={standard.price}
                buttonDisabled={hasPaid ? true : false}
                buttonFunction={() => setSelected("standard")}
                selected={selected}
                defaultCurrency={defaultCurrency}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-0 bg-none w-80 md:w-full" close={false}>
          {/* {defaultCurrency && currentHome && (
            <Stripe
              amount={defaultCurrency.usdPrice * (premium.price as number)}
              defaultCurrency={defaultCurrency}
              accountId={user?.id}
            />
          )} */}
        </DialogContent>
      </Dialog>
    </>
  );
}
