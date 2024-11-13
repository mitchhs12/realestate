import PricingTable from "@/components/PricingPageContent/PricingTable";
import { urbanist } from "@/app/[locale]/fonts";

interface Props {
  locale: string;
  billingObject: any;
  billingText: {
    "most-popular": string;
    subscribe: string;
    "current-plan": string;
    yearly: string;
    monthly: string;
    "billed-annually": string;
    "view-monthly-billing": string;
    "save-with-yearly": string;
    "six-months-free": string;
  };
}

export default function PricingPageContent({ locale, billingObject, billingText }: Props) {
  return (
    <section className="flex flex-col bg-gradient-to-b from-[#fbf4f8] to-[#fbfaf4]  dark:from-[#10020b] dark:to-[#100e02] justify-center items-center w-full h-full">
      <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
        <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
          <h3
            className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
          >
            LOWEST PRICES GUARANTEED
          </h3>
          <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
            Plans & pricing
          </h2>
        </div>
        <PricingTable
          starter={billingObject.starter}
          pro={billingObject.pro}
          premium={billingObject.premium}
          business={billingObject.business}
          mostPopularText={billingText["most-popular"]}
          subscribeText={billingText.subscribe}
          currentPlanText={billingText["current-plan"]}
          yearlyText={billingText.yearly}
          monthlyText={billingText.monthly}
          billedAnnually={billingText["billed-annually"]}
          monthlyBilling={billingText["view-monthly-billing"]}
          yearlyBilling={billingText["save-with-yearly"]}
          sixMonthsFree={billingText["six-months-free"]}
        />
      </div>
    </section>
  );
}
