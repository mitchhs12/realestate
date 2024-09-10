import { formatBrokenPrice } from "@/lib/utils";

interface Props {
  incompleteListing?: string;
  priceUsd: number;
  newCurrencySymbol: string;
  newCurrencyUsdPrice: number;
  reveal: boolean;
  blurAmount?: string;
  className?: string;
}

export default function BrokenPrice({
  incompleteListing,
  priceUsd,
  newCurrencySymbol,
  newCurrencyUsdPrice,
  reveal,
  blurAmount,
  className,
}: Props) {
  if (!priceUsd) {
    return <span className={`flex items-center text-center font-semibold ${className}`}>{incompleteListing}</span>;
  }

  return (
    <>
      {priceUsd &&
        // Destructure the formatted price
        (() => {
          const { symbol, number, symbolFirst } = formatBrokenPrice(
            newCurrencySymbol,
            priceUsd * newCurrencyUsdPrice,
            0
          );

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
