"use client";

import Image from "next/image";
import { CardTitle } from "@/components/ui/card";
import { useContext, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { getCountryNameForLocale } from "@/lib/utils";
import { CountryProps } from "@/lib/validations";

interface CityImage {
  name: string;
  countryCode: string;
  neighborhoods: Neighborhood[];
}

interface Neighborhood {
  name: string;
}

export default function Locations({ countries }: { countries: CountryProps }) {
  function getUrl(folder: string, place: string) {
    const baseUrl = "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home";
    return `${baseUrl}/${folder}/${place}.webp`;
  }

  const urlMap = Object.fromEntries(
    Object.entries(countries).flatMap(([countryKey, country]) => [
      [`${country.city.id}`, getUrl(country.folder, country.city.id)],
      ...country.neighborhoods.map((neighborhood) => [`${neighborhood.id}`, getUrl(country.folder, neighborhood.id)]),
    ])
  );

  const imageMap = Object.values(countries).map((country) => ({
    city: { id: country.city.id, translation: country.city.translation },
    neighborhoods: country.neighborhoods,
  }));

  const [hoveredImage, setHoveredImage] = useState(getUrl(countries.AR.folder, countries.AR.city.id));
  const [hoveredImageSearch, setHoveredImageSearch] = useState("Buenos Aires, Argentina");
  const [underlinedImage, setUnderlinedImage] = useState("");
  const [key, setKey] = useState<{ id: string; translation: string }>(countries.AR.city);
  const { setQuery, setClickedLocation } = useContext(QueryContext);
  const { defaultLanguage } = useContext(LocaleContext);
  const [loadingImages, setLoadingImages] = useState(new Set(Object.keys(urlMap)));
  const [currentIndexes, setCurrentIndexes] = useState(Object.keys(countries).map(() => 0));

  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = new Set(prevLoadingImages);
      newLoadingImages.delete(imageUrl);
      return newLoadingImages;
    });
  };

  const handleHover = (imageUrl: string, key: { id: string; translation: string }, searchString: string) => {
    setHoveredImage(imageUrl);
    setHoveredImageSearch(searchString);
    setUnderlinedImage(searchString);
    setKey(key);
  };

  const handlePreviousClick = (canScrollPrev: boolean, cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];

      newIndexes[cityIndex] = Math.max(newIndexes[cityIndex] - 1, 0);

      const imageKey = newIndexes[cityIndex] === 0 ? city.city : city.neighborhoods[newIndexes[cityIndex] - 1];
      handleHover(urlMap[imageKey.id], imageKey, imageKey.id);

      return newIndexes;
    });
  };

  const handleNextClick = (canScrollNext: boolean, cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];
      newIndexes[cityIndex] = Math.min(newIndexes[cityIndex] + 1, city.neighborhoods.length);

      const imageKey = newIndexes[cityIndex] === 0 ? city.city : city.neighborhoods[newIndexes[cityIndex] - 1];

      handleHover(urlMap[imageKey.id], imageKey, imageKey.id);

      return newIndexes;
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="grid p-8 w-full grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {Object.entries(countries).map(([isoCode, country], countryIndex) => (
          <Carousel
            key={countryIndex}
            className="w-full h-full hover:cursor-pointer"
            onMouseLeave={() => setUnderlinedImage("")}
          >
            <CarouselContent>
              <CarouselItem
                key={country.city.id}
                className="flex justify-center items-center h-full w-full"
                onMouseOver={() => {
                  handleHover(getUrl(country.folder, country.city.id), country.city, country.city.id);
                }}
              >
                <div
                  className="relative flex justify-center items-center h-40 w-full"
                  onClick={() => {
                    setClickedLocation(true);
                    setQuery(country.city.translation);
                  }}
                >
                  <Image
                    className="object-cover object-center rounded-lg"
                    src={getUrl(country.folder, country.city.id)}
                    alt="City Image"
                    sizes={
                      "(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px, (max-width: 1024px) 1024px"
                    }
                    fill={true}
                    onLoad={() => handleImageLoad(getUrl(country.folder, country.city.id))}
                  />
                  <div className="absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 rounded-t-lg">
                    <div className="flex flex-col justify-center items-center">
                      <p className={`flex items-center gap-x-2 ${underlinedImage === country.city.id && "underline"}`}>
                        {country.city.translation}{" "}
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
              </CarouselItem>
              {country.neighborhoods.map((neighborhood) => (
                <CarouselItem
                  key={neighborhood.id}
                  className="flex justify-center items-center h-full w-full"
                  onMouseOver={() => {
                    handleHover(getUrl(country.folder, neighborhood.id), neighborhood, neighborhood.id);
                  }}
                >
                  <div
                    className="relative flex justify-center items-center h-40 w-full"
                    onClick={() => {
                      setClickedLocation(true);
                      setQuery(neighborhood.translation);
                    }}
                  >
                    <Image
                      className="object-cover object-center rounded-lg" //opacity-65 dark:opacity-60"
                      src={getUrl(country.folder, neighborhood.id)}
                      alt="Location Image"
                      sizes={"(max-width: 200px), (max-height: 200px)"}
                      fill={true}
                      onLoad={() => handleImageLoad(getUrl(country.folder, neighborhood.id))}
                    />

                    <div
                      className={`absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 rounded-t-lg ${
                        underlinedImage === neighborhood.id && "underline"
                      }`}
                    >
                      <p className="flex justify-center items-center gap-2">
                        {neighborhood.translation}
                        {<FlagComponent country={isoCode as Country} countryName={isoCode} />}
                      </p>
                    </div>
                    {/* <div className="absolute bottom-2 right-2 text-black dark:text-white">
                        {<FlagComponent country={city.countryCode as Country} countryName={city.countryCode} />}
                      </div> */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {
              <CarouselPrevious
                className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8"
                onCustomClick={(canScrollPrev: boolean) => {
                  console.log(canScrollPrev, countryIndex);
                  handlePreviousClick(canScrollPrev, countryIndex);
                }}
                onMouseOver={() => {
                  setUnderlinedImage(hoveredImageSearch);
                }}
              />
            }
            {
              <CarouselNext
                className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8"
                onCustomClick={(canScrollNext: boolean) => {
                  console.log(canScrollNext, countryIndex);
                  handleNextClick(canScrollNext, countryIndex);
                }}
                onMouseOver={() => {
                  setUnderlinedImage(hoveredImageSearch);
                }}
              />
            }
          </Carousel>
        ))}
        <div
          onClick={() => {
            setClickedLocation(true);
            setQuery(hoveredImageSearch);
          }}
          onMouseOver={() => {
            setUnderlinedImage(key.id);
          }}
          onMouseLeave={() => setUnderlinedImage("")}
          className="hidden sm:relative sm:block col-span-2 row-span-2 row-start-1 row-end-3 sm:col-start-2 sm:col-end-4 sm:row-start-1 sm:row-end-3 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 xl:col-start-5 xl:col-end-7 xl:row-start-1 xl:row-end-3 hover:cursor-pointer"
        >
          {loadingImages.has(hoveredImage) && <Skeleton className="absolute inset-0" />}
          <Image
            src={hoveredImage}
            alt="Location Image"
            fill={true}
            className="object-cover rounded-lg absolute inset-0 z-0" // opacity-65 dark:opacity-60"
            sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
            onLoad={() => handleImageLoad(hoveredImage)}
          />
          <CardTitle
            className={`relative z-1 flex flex-col pt-2 pb-2 justify-start items-center font-normal text-4xl bg-white/70 dark:bg-secondary/70 text-black dark:text-white rounded-t-lg ${
              underlinedImage === key.id && "underline"
            }`}
          >
            {key.translation}
          </CardTitle>
        </div>
      </div>
    </div>
  );
}
