import { HomeType } from "@/lib/validations";
import { formatBrokenPrice } from "@/lib/utils";
import { User } from "next-auth";
import { Skeleton } from "../ui/skeleton";

interface Props {
  incompleteListing?: string;
  home: HomeType;
  newCurrencySymbol: string;
  newCurrencyUsdPrice: number;
  reveal: boolean;
  blurAmount?: string;
  className?: string;
}

export default function BrokenPrice({
  incompleteListing,
  home,
  newCurrencySymbol,
  newCurrencyUsdPrice,
  reveal,
  blurAmount,
  className,
}: Props) {
  if (!home.priceUsd) {
    return <span className={`flex items-center text-center ${className} font-semibold mb-2`}>{incompleteListing}</span>;
  }

  return (
    <>
      {home.priceUsd &&
        // Destructure the formatted price
        (() => {
          const { symbol, number, symbolFirst } = formatBrokenPrice(
            newCurrencySymbol,
            home.priceUsd * newCurrencyUsdPrice,
            0
          );

          return (
            <span className={`flex items-center text-center ${className} font-semibold mb-2`}>
              {symbolFirst ? (
                <>
                  <span>{symbol}</span>
                  <span className={`${!reveal && `${blurAmount} select-none`}`}>{number}</span>
                </>
              ) : (
                <>
                  <span className={`${!reveal && `${blurAmount} select-none`}`}>{number}</span>
                  <span>{symbol}</span>
                </>
              )}
            </span>
          );
        })()}
    </>
  );
}
