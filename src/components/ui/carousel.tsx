"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

export const CarouselDots = ({ className }: any) => {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [slidesCount, setSlidesCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setSelectedIndex(newIndex);
      setSlidesCount(api.scrollSnapList().length);
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (slidesCount === 0) return null;

  const renderDots = () => {
    return Array.from({ length: slidesCount }).map((_, index) => {
      const isSelected = index === selectedIndex;

      return (
        <button
          key={index}
          className={`mx-1 h-2 w-2 rounded-full transition-all ${isSelected ? "bg-primary" : "bg-white"} opacity-100`}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Slide ${index + 1}`}
        />
      );
    });
  };

  const dotSize = 16; // Size of each dot including margin
  const containerWidth = 5 * dotSize; // Width for 5 dots
  const dotContainerStyle = {
    transform: `translateX(calc(50% - ${selectedIndex * dotSize + dotSize / 2}px))`,
    transition: "transform 0.5s ease",
  };

  return (
    <div className={`overflow-hidden flex justify-center ${className}`}>
      <div className="flex w-[50%] justify-center overflow-hidden" style={{ width: containerWidth }}>
        <div className="flex" style={dotContainerStyle}>
          {renderDots()}
        </div>
      </div>
    </div>
  );
};

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
        <CarouselDots className="absolute w-full justify-center items-center bottom-4" />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { onCustomClick?: (canScrollPrev: boolean) => void }
>(({ className, variant = "outline", size = "icon", onCustomClick, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  const handleClick = () => {
    scrollPrev();
    if (onCustomClick) onCustomClick(canScrollPrev);
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full disabled:pointer-events-auto",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={handleClick}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { onCustomClick?: (canScrollNext: boolean) => void }
>(({ className, variant = "outline", size = "icon", onCustomClick, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  const handleClick = () => {
    scrollNext();
    if (onCustomClick) onCustomClick(canScrollNext);
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full disabled:pointer-events-auto",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={handleClick}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
