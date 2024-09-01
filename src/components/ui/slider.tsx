"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    minValue: number;
    maxValue: number;
    onValuesChange?: (values: number[]) => void; // Callback for the values
  }
>(({ className, value, onValueChange, minValue, maxValue, onValuesChange, ...props }, ref) => {
  const [tooltipVisible, setTooltipVisible] = React.useState<number | null>(null);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={value} // Use the value directly
      onValueChange={(newValue) => {
        onValueChange?.(newValue);
        onValuesChange?.(newValue); // Update the parent component with new values
      }}
      min={minValue}
      max={maxValue}
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
                className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onPointerDown={() => setTooltipVisible(index)}
                onPointerMove={() => setTooltipVisible(index)}
                onPointerLeave={() => setTooltipVisible(null)} // Close tooltip on thumb release
                onPointerUp={() => setTooltipVisible(null)}
              />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <span className={`flex items-center text-center ${className} font-semibold mb-2`}>{val}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
