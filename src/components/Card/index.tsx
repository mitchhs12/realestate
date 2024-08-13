import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType } from "@/lib/validations";
import { iso31661 } from "iso-3166";
import { formatPrice } from "@/lib/utils";
import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";

interface Props {
  home: HomeType | null;
}

export default function Card({ home }: Props) {
  const { defaultCurrency, currencyRate } = useContext(CurrencyContext);

  return !home ? (
    <>
      <Skeleton className="rounded-t-xl h-40 w-44 md:w-52" />
      <div className="flex flex-col justify-center items-center w-full gap-3 px-2 pb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-36 font-semibold" />
      </div>
    </>
  ) : (
    <>
      <Carousel>
        <CarouselContent>
          {home.photos.map((photo: string, index) => (
            <CarouselItem key={index} className="flex justify-center items-center">
              <div className="relative flex justify-center items-center h-40 w-44 md:w-52">
                <Image
                  src={photo}
                  className="rounded-t-xl object-cover object-center"
                  alt={home.title!}
                  fill={true}
                  sizes={"(max-width: 500px), (max-height: 500px)"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8" />
        <CarouselNext className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8" />
      </Carousel>
      <div className="flex flex-col justify-center items-center w-full h-full gap-2 px-2">
        <div className={`w-full flex ${home.title && home.title.length > 20 ? "justify-start" : "justify-center"}`}>
          <h2
            className={`text-sm md:text-md lg:text-lg xl:text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis`}
          >
            {home.title}
          </h2>
        </div>

        <div className="flex text-center text-xs sm:text-sm lg:text-md">{home.municipality}</div>
        <div className="flex text-center text-xs sm:text-sm lg:text-md">{home.region}</div>
        <div className="flex text-center text-sm sm:text-sm lg:text-md">
          {iso31661.find((country) => country.alpha3 === home.country)?.name}
        </div>
        <div className="flex text-center text-sm md:text-md lg:text-lg font-semibold mb-2">
          {formatPrice(defaultCurrency, home.priceUsd * currencyRate)}
        </div>
      </div>
    </>
  );
}
