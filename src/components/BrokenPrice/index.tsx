import { formatBrokenPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  incompleteListing?: string;
  priceUsd: number;
  currency: { symbol: string; usdPrice: number } | null;
  reveal: boolean;
  blurAmount?: string;
  className?: string;
  originalPrice?: number;
  originalCurrency?: string;
}

export default function BrokenPrice({ incompleteListing, priceUsd, currency, reveal, blurAmount, className }: Props) {
  if (!priceUsd) {
    return <span className={`flex items-center text-center font-semibold ${className}`}>{incompleteListing}</span>;
  }

  if (!currency) {
    return (
      <span className={`flex items-center text-center pb-1`}>
        <Skeleton className={`h-4 sm:h-5 lg:h-6 w-36 font-semibold ${className}`} />
      </span>
    );
  }

  return (
    <>
      {priceUsd &&
        // Destructure the formatted price
        (() => {
          const { symbol, number, symbolFirst } = formatBrokenPrice(currency.symbol, priceUsd * currency.usdPrice, 0);

          return (
            <span className={`flex items-center text-center font-semibold ${className} `}>
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
