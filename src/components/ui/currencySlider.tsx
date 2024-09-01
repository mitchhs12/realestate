"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatBrokenPrice } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    newCurrencySymbol: string;
    newCurrencyUsdPrice: number;
    minValue: number;
    maxValue: number;
    exponent: number; // Add an exponent prop for controlling the curve
    onFormattedPricesChange?: (formattedPrices: number[]) => void; // Callback for formatted prices
  }
>(
  (
    {
      className,
      value,
      onValueChange,
      newCurrencySymbol,
      newCurrencyUsdPrice,
      minValue = 1,
      maxValue = 100000000,
      exponent = 2,
      onFormattedPricesChange,
      ...props
    },
    ref
  ) => {
    const [tooltipVisible, setTooltipVisible] = React.useState<number | null>(null);

    // Exponential scaling function
    const linearToExponential = (linearValue: number) => {
      const normalizedValue = (linearValue - minValue) / (maxValue - minValue);
      return Math.round(minValue + Math.pow(normalizedValue, exponent) * (maxValue - minValue));
    };

    const exponentialToLinear = (exponentialValue: number) => {
      const normalizedValue = (exponentialValue - minValue) / (maxValue - minValue);
      return Math.round(minValue + Math.pow(normalizedValue, 1 / exponent) * (maxValue - minValue));
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        value={(value ?? []).map(exponentialToLinear)} // Convert exponential back to linear for display
        onValueChange={(newValue) => {
          const exponentialValue = newValue.map(linearToExponential);
          const formattedPrices = exponentialValue.map((val) => {
            return Math.round(linearToExponential(val) * newCurrencyUsdPrice);
          });
          onFormattedPricesChange?.(formattedPrices); // Pass formatted prices to parent
          onValueChange?.(exponentialValue);
          setTooltipVisible(tooltipVisible);
        }}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {value?.map((val, index) => (
          <TooltipProvider key={index} delayDuration={0}>
            <Tooltip open={tooltipVisible === index}>
              <TooltipTrigger asChild>
                <SliderPrimitive.Thumb
                  className="block h-4 w-4 cursor-pointer rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  onPointerDown={() => setTooltipVisible(index)}
                  onPointerMove={() => setTooltipVisible(index)}
                  onPointerLeave={() => setTooltipVisible(null)} // Close tooltip on thumb release
                  onPointerUp={() => setTooltipVisible(null)}
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {val &&
                  // Destructure the formatted price
                  (() => {
                    const { symbol, number, symbolFirst } = formatBrokenPrice(
                      newCurrencySymbol,
                      linearToExponential(val) * newCurrencyUsdPrice,
                      0
                    );

                    return (
                      <span className={`flex items-center text-center ${className} font-semibold mb-2`}>
                        {symbolFirst ? (
                          <>
                            <span>{symbol}</span>
                            <span>{number}</span>
                          </>
                        ) : (
                          <>
                            <span>{number}</span>
                            <span>{symbol}</span>
                          </>
                        )}
                      </span>
                    );
                  })()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
