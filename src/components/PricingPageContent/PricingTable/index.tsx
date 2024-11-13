"use client";

import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import Stripe from "@/app/[locale]/Stripe";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PriceCard from "@/components/PricingPageContent/PricingTable/Card";
import { Button } from "@/components/ui/button";
import { QueryContext } from "@/context/QueryContext";

interface Tier {
  title: string;
  price: number;
  yearlyPrice: number;
  totalYearlyPrice: number;
  anchor?: number;
  blurb?: string;
  perks: {
    title: string;
    subtitle: string;
  }[];
}

interface Props {
  starter: Tier;
  pro: Tier;
  premium: Tier;
  business: Tier;
  mostPopularText: string;
  subscribeText: string;
  currentPlanText: string;
  yearlyText: string;
  monthlyText: string;
  billedAnnually: string;
  monthlyBilling: string;
  yearlyBilling: string;
  sixMonthsFree: string;
}

export default function PricingTable({
  starter,
  pro,
  premium,
  business,
  mostPopularText,
  subscribeText,
  currentPlanText,
  yearlyText,
  monthlyText,
  billedAnnually,
  monthlyBilling,
  yearlyBilling,
  sixMonthsFree,
}: Props) {
  const { defaultCurrency, user } = useContext(LocaleContext);
  const { openSignUpModal } = useContext(QueryContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [yearly, setYearly] = useState(true);

  useEffect(() => {
    if (user?.subscription) {
      if (user.subscription === "starter") {
        setCurrentPlan("starter");
      } else if (user.subscription === "pro") {
        setCurrentPlan("pro");
      } else if (user.subscription === "premium") {
        setCurrentPlan("premium");
      } else if (user.subscription === "business") {
        setCurrentPlan("business");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user?.subscription && selected) {
      if (!user?.id) {
        openSignUpModal();
      } else {
        setIsOpen(true);
      }
    } else if (user?.subscription && selected) {
      if (selected !== user.subscription) {
        setIsOpen(true);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (!isOpen) {
      if (user?.subscription) {
        setSelected(user?.subscription);
      } else {
        setSelected("");
      }
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col w-full h-full justify-start items-center text-center gap-12">
          <div className="flex items-center gap-3">
            <Button
              variant={"default"}
              disabled={!yearly}
              onClick={() => {
                setYearly(false);
              }}
            >
              {monthlyText}
            </Button>
            <Button variant={"default"} disabled={yearly} className="gap-2" onClick={() => setYearly(true)}>
              {yearlyText}
            </Button>
          </div>
          {defaultCurrency && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-start w-full gap-8 sm:gap-8 lg:gap-5`}
            >
              <PriceCard
                id={"starter"}
                perks={starter.perks}
                title={starter.title}
                button={yearly ? starter.yearlyPrice : starter.price}
                annualPrice={starter.totalYearlyPrice}
                buttonDisabled={currentPlan === "starter" ? true : false}
                originalPrice={starter.anchor}
                buttonFunction={() => setSelected("starter")}
                selected={selected}
                defaultCurrency={defaultCurrency}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={subscribeText}
                currentPlan={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
              />
              <PriceCard
                id={"pro"}
                perks={pro.perks}
                title={pro.title}
                button={yearly ? pro.yearlyPrice : pro.price}
                annualPrice={pro.totalYearlyPrice}
                buttonDisabled={currentPlan === "pro" ? true : false}
                buttonFunction={() => setSelected("pro")}
                selected={selected}
                defaultCurrency={defaultCurrency}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={subscribeText}
                currentPlan={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
                blurb={pro.blurb}
              />
              <div className="relative flex flex-col justify-center items-center">
                <div className="absolute -top-2 shadow-lg transform -translate-x-1/2 bg-[#0C7A33] text-white text-sm px-4 rounded-full animate-bounce w-[150px]">
                  {mostPopularText}
                </div>
                <PriceCard
                  id={"premium"}
                  perks={premium.perks}
                  title={premium.title}
                  button={yearly ? premium.yearlyPrice : premium.price}
                  annualPrice={premium.totalYearlyPrice}
                  buttonDisabled={currentPlan === "premium" ? true : false}
                  buttonFunction={() => setSelected("premium")}
                  selected={selected}
                  defaultCurrency={defaultCurrency}
                  yearly={yearly}
                  setYearly={setYearly}
                  subscribe={subscribeText}
                  currentPlan={currentPlanText}
                  billedAnnually={billedAnnually}
                  monthlyBilling={monthlyBilling}
                  yearlyBilling={yearlyBilling}
                  sixMonthsFree={sixMonthsFree}
                  blurb={premium.blurb}
                />
              </div>
              <PriceCard
                id={"business"}
                perks={business.perks}
                title={business.title}
                button={yearly ? business.yearlyPrice : business.price}
                annualPrice={business.totalYearlyPrice}
                buttonDisabled={currentPlan === "business" ? true : false}
                buttonFunction={() => setSelected("business")}
                selected={selected}
                defaultCurrency={defaultCurrency}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={subscribeText}
                currentPlan={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
                blurb={business.blurb}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-0 bg-none w-80 md:w-full" close={false}>
          {defaultCurrency && user && (
            <Stripe
              defaultCurrency={defaultCurrency}
              planId={selected}
              interval={yearly ? "year" : "month"}
              accountId={user.id as string}
              accountEmail={user.email ? user.email : null}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
