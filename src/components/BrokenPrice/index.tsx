import { HomeType } from "@/lib/validations";
import { formatBrokenPrice } from "@/lib/utils";
import { User } from "next-auth";
import { Skeleton } from "../ui/skeleton";

interface Props {
  home: HomeType;
  newCurrencySymbol: string;
  newCurrencyUsdPrice: number;
  user: User | undefined;
  blur?: boolean;
  blurAmount?: string;
  className?: string;
}

export default function BrokenPrice({
  home,
  newCurrencySymbol,
  newCurrencyUsdPrice,
  user,
  blur,
  blurAmount,
  className,
}: Props) {
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
              {!user ? (
                <Skeleton className="h-4 sm:h-5 lg:h-7 w-32" />
              ) : symbolFirst ? (
                <>
                  <span>{symbol}</span>
                  <span className={`${user || blur ? "" : `${blurAmount} blur-sm select-none`}`}>{number}</span>
                </>
              ) : (
                <>
                  <span className={`${user || blur ? "" : `${blurAmount} blur-sm select-none`}`}>{number}</span>
                  <span>{symbol}</span>
                </>
              )}
            </span>
          );
        })()}
    </>
  );
}
