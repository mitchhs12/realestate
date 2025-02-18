"use client";

import Image from "next/image";
import { CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useRef, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { getCountryNameForLocale } from "@/lib/utils";
import { CountryProps } from "@/lib/validations";

interface Neighborhood {
  name: string;
}

export default function Locations({ countries }: { countries: CountryProps }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function getUrl(folder: string, place: string) {
    const baseUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home`;
    return `${baseUrl}/${folder}/${place}.webp`;
  }

  const [underlinedImage, setUnderlinedImage] = useState("");
  const { setQuery, setClickedLocation } = useContext(QueryContext);
  const { defaultLanguage } = useContext(LocaleContext);

  return (
    <div className="scroll-container">
      <div className="scroll-content">
        {/* Original and duplicate content */}
        {Array(2)
          .fill(Object.entries(countries))
          .flat()
          .map(([isoCode, country], index) => (
            <div
              onClick={() => {
                setClickedLocation(true);
                setQuery(country.city.translation);
              }}
              className="flex flex-col justify-center items-center w-full hover:cursor-pointer"
              key={`scroll-${isoCode}-${index}`}
            >
              <div className="relative flex justify-center items-center h-32 w-32 md:h-48 md:w-48 xl:h-64 xl:w-64 rounded-lg overflow-hidden">
                <Image
                  className="object-cover object-center"
                  src={getUrl(country.folder, country.city.id)}
                  alt="City Image"
                  sizes="(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px, (max-width: 1024px) 1024px"
                  placeholder={"blur"}
                  blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                  fill={true}
                  loading={"lazy"}
                />
              </div>
              <div className="text-black dark:text-white text-center py-2">
                <div className="flex flex-col items-center">
                  <p
                    className={`flex items-center text-sm sm:text-md gap-x-2 ${underlinedImage === country.city.id && "underline"}`}
                  >
                    {country.city.translation}
                  </p>
                  <p
                    className={`flex items-center gap-x-2 font-medium text-sm ${
                      underlinedImage === country.city.id && "underline"
                    }`}
                  >
                    {getCountryNameForLocale(isoCode, defaultLanguage)}
                    {<FlagComponent country={isoCode as Country} countryName={isoCode} />}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
