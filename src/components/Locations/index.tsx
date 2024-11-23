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
    const baseUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home`;
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
  const [hoveredCarousel, setHoveredCarousel] = useState<string | null>(null); // Track which carousel is being hovered
  const [isoCode, setIsoCode] = useState("AR");

  const handleMouseLeave = () => {
    setHoveredCarousel(null);
    setUnderlinedImage("");
  };

  const handleMouseEnter = (cityId: string) => {
    setHoveredCarousel(cityId);
    setUnderlinedImage(cityId);
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = new Set(prevLoadingImages);
      newLoadingImages.delete(imageUrl);
      return newLoadingImages;
    });
  };

  const handleHover = (
    imageUrl: string,
    key: { id: string; translation: string },
    searchString: string,
    isoCode: string
  ) => {
    setHoveredImage(imageUrl);
    setHoveredImageSearch(searchString);
    setUnderlinedImage(searchString);
    setKey(key);
    setIsoCode(isoCode);
  };

  const handlePreviousClick = (canScrollPrev: boolean, cityIndex: number, isoCode: string) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];

      newIndexes[cityIndex] = Math.max(newIndexes[cityIndex] - 1, 0);

      const imageKey = newIndexes[cityIndex] === 0 ? city.city : city.neighborhoods[newIndexes[cityIndex] - 1];

      handleHover(urlMap[imageKey.id], imageKey, imageKey.id, isoCode);
      // setUnderlinedImage(imageKey.id);

      return newIndexes;
    });
  };

  const handleNextClick = (canScrollNext: boolean, cityIndex: number, isoCode: string) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];
      newIndexes[cityIndex] = Math.min(newIndexes[cityIndex] + 1, city.neighborhoods.length);

      const imageKey = newIndexes[cityIndex] === 0 ? city.city : city.neighborhoods[newIndexes[cityIndex] - 1];

      handleHover(urlMap[imageKey.id], imageKey, imageKey.id, isoCode);
      // setUnderlinedImage(imageKey.id);

      return newIndexes;
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="grid w-full grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 sm:gap-4 lg:gap-5 xl:gap-5">
        {Object.entries(countries).map(([isoCode, country], countryIndex) => (
          <Carousel
            key={countryIndex}
            className="w-full h-full shadow-xl dark:shadow-white/10 rounded-lg overflow-hidden"
            onMouseEnter={() => handleMouseEnter(country.city.id)} // Show arrows on hover
            onMouseLeave={handleMouseLeave}
          >
            <CarouselContent className="h-full w-full ml-0">
              <CarouselItem
                key={country.city.id}
                className="pl-0 h-full w-full"
                onMouseOver={() => {
                  handleHover(getUrl(country.folder, country.city.id), country.city, country.city.id, isoCode);
                }}
              >
                <div className="relative flex justify-center items-center h-40 w-full ">
                  <Image
                    className="object-cover object-center"
                    src={getUrl(country.folder, country.city.id)}
                    alt="City Image"
                    sizes={
                      "(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px, (max-width: 1024px) 1024px"
                    }
                    placeholder={"blur"}
                    blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                    fill={true}
                    onLoad={() => handleImageLoad(getUrl(country.folder, country.city.id))}
                  />
                  <div
                    className="absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 hover:cursor-pointer"
                    onClick={() => {
                      setClickedLocation(true);
                      setQuery(country.city.translation);
                    }}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <p className={`flex items-center gap-x-2 ${underlinedImage === country.city.id && "underline"}`}>
                        {country.city.translation}{" "}
                      </p>
                      <p
                        onClick={() => {
                          setClickedLocation(true);
                          setQuery(country.city.translation);
                        }}
                        className={`flex items-center gap-x-2 hover:cursor-pointer font-medium text-sm ${
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
                  className="h-full w-full pl-0"
                  onMouseOver={() => {
                    handleHover(getUrl(country.folder, neighborhood.id), neighborhood, neighborhood.id, isoCode);
                  }}
                >
                  <div className="relative flex justify-center items-center h-40 w-full">
                    <Image
                      className="object-cover object-center" //opacity-65 dark:opacity-60"
                      src={getUrl(country.folder, neighborhood.id)}
                      alt="Location Image"
                      sizes={"(max-width: 200px), (max-height: 200px)"}
                      fill={true}
                      placeholder={"blur"}
                      blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                      onLoad={() => handleImageLoad(getUrl(country.folder, neighborhood.id))}
                    />

                    <div
                      className={`absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 hover:cursor-pointer ${
                        underlinedImage === neighborhood.id && "underline"
                      }`}
                      onClick={() => {
                        setClickedLocation(true);
                        setQuery(neighborhood.translation);
                      }}
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
            {hoveredCarousel === country.city.id && (
              <CarouselPrevious
                className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8"
                onCustomClick={(canScrollPrev: boolean) => {
                  handlePreviousClick(canScrollPrev, countryIndex, isoCode);
                }}
                onMouseOver={() => {
                  setUnderlinedImage(hoveredImageSearch);
                }}
              />
            )}
            {hoveredCarousel === country.city.id && (
              <CarouselNext
                className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8"
                onCustomClick={(canScrollNext: boolean) => {
                  handleNextClick(canScrollNext, countryIndex, isoCode);
                }}
                onMouseOver={() => {
                  setUnderlinedImage(hoveredImageSearch);
                }}
              />
            )}
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
          className="hidden sm:relative sm:block col-span-2 row-span-2 row-start-1 row-end-3 sm:col-start-2 sm:col-end-4 sm:row-start-1 sm:row-end-3 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 xl:col-start-5 xl:col-end-7 xl:row-start-1 xl:row-end-3 hover:cursor-pointer shadow-xl dark:shadow-white/10"
        >
          {loadingImages.has(hoveredImage) && <Skeleton className="absolute inset-0" />}
          <Image
            src={hoveredImage}
            alt="Location Image"
            fill={true}
            className="object-cover rounded-lg absolute inset-0 z-0" // opacity-65 dark:opacity-60"
            placeholder={"blur"}
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
            sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
            onLoad={() => handleImageLoad(hoveredImage)}
          />
          <CardTitle
            className={`relative z-1 flex py-2 gap-4 justify-center items-center text-4xl font-normal bg-white/70 dark:bg-secondary/70 text-black dark:text-white rounded-t-lg ${
              underlinedImage === key.id && "underline"
            }`}
          >
            {key.translation}{" "}
            <FlagComponent width={"w-[45px]"} height={"h-[30px]"} country={isoCode as Country} countryName={isoCode} />
          </CardTitle>
        </div>
      </div>
    </div>
  );
}
