import { HomeType } from "@/lib/validations";
import { formatBrokenPrice } from "@/lib/utils";
import { User } from "next-auth";

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
              {symbolFirst ? (
                <>
                  <span>{symbol}</span>
                  <span className={`${user || blur ? "" : `${blurAmount} blur-sm`}`}>{number}</span>
                </>
              ) : (
                <>
                  <span className={`${user || blur ? "" : `${blurAmount} blur-sm`}`}>{number}</span>
                  <span>{symbol}</span>
                </>
              )}
            </span>
          );
        })()}
    </>
  );
}
