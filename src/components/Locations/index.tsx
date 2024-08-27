"use client";

import Image from "next/image";
import { CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import ResizableCarousel from "@/components/ResizableCarousel";

interface CityImage {
  name: string;
  countryCode: string;
  neighborhoods: Neighborhood[];
}

interface Neighborhood {
  name: string;
}

const imageMap: CityImage[] = [
  {
    name: "Buenos Aires, Argentina",
    countryCode: "AR",
    neighborhoods: [
      {
        name: "Palermo",
      },
      {
        name: "Recoleta",
      },
      {
        name: "Belgrano",
      },
    ],
  },
  {
    name: "Mexico City, Mexico",
    countryCode: "MX",
    neighborhoods: [
      {
        name: "Polanco",
      },
      {
        name: "Condesa",
      },
      {
        name: "Roma Norte",
      },
    ],
  },
  {
    name: "Rio de Janeiro, Brazil",
    countryCode: "BR",
    neighborhoods: [
      {
        name: "Ipanema",
      },
      {
        name: "Leblon",
      },
      {
        name: "Barra da Tijuca",
      },
    ],
  },
  {
    name: "Medellín, Colombia",
    countryCode: "CO",
    neighborhoods: [
      {
        name: "El Poblado",
      },
      {
        name: "Laureles",
      },
    ],
  },
  {
    name: "Santiago, Chile",
    countryCode: "CL",
    neighborhoods: [
      {
        name: "Providencia",
      },
      {
        name: "Las Condes",
      },
      {
        name: "Vitacura",
      },
    ],
  },
  {
    name: "Quito, Ecuador",
    countryCode: "EC",
    neighborhoods: [
      {
        name: "La Floresta",
      },
      {
        name: "Cumbayá",
      },
      {
        name: "González Suárez",
      },
    ],
  },
  {
    name: "Lima, Peru",
    countryCode: "PE",
    neighborhoods: [
      {
        name: "Miraflores",
      },
      {
        name: "San Isidro",
      },
      {
        name: "Barranco",
      },
    ],
  },
  {
    name: "Montevideo, Uruguay",
    countryCode: "UY",
    neighborhoods: [
      {
        name: "Punta Carretas",
      },
      {
        name: "Pocitos",
      },
      {
        name: "Carrasco",
      },
    ],
  },
];

export default function Locations() {
  function generateUrl(placeName: string, countryName: string) {
    const baseUrl = "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home";
    const formattedPlace = placeName.toLowerCase().replace(/, /g, "/").replace(/ /g, "+").replace(/\./g, "");
    return `${baseUrl}/${countryName.toLowerCase().trim()}/${formattedPlace}.webp`;
  }

  const urlMap = imageMap.reduce(
    (acc, city) => {
      const [place, country] = city.name.split(",");
      acc[city.name] = generateUrl(place, country);

      city.neighborhoods.forEach((neighborhood) => {
        acc[`${neighborhood.name}, ${city.name}`] = generateUrl(neighborhood.name, country);
      });

      return acc;
    },
    {} as Record<string, string>
  );

  const [hoveredImage, setHoveredImage] = useState(urlMap["Buenos Aires, Argentina"]);
  const [hoveredImageSearch, setHoveredImageSearch] = useState("Buenos Aires, Argentina");
  const [underlinedImage, setUnderlinedImage] = useState("");
  const [key, setKey] = useState("Buenos Aires");
  const { setQuery, setClickedLocation } = useContext(QueryContext);
  const [loadingImages, setLoadingImages] = useState(new Set(Object.keys(urlMap)));
  const [currentIndexes, setCurrentIndexes] = useState(imageMap.map(() => 0));

  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = new Set(prevLoadingImages);
      newLoadingImages.delete(imageUrl);
      return newLoadingImages;
    });
  };

  const handleHover = (imageUrl: string, key: string, searchString: string) => {
    setHoveredImage(imageUrl);
    setHoveredImageSearch(searchString);
    setUnderlinedImage(searchString);
    setKey(key);
  };

  const handlePreviousClick = (canScrollPrev: boolean, cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[cityIndex] = Math.max(newIndexes[cityIndex] - 1, 0);

      const city = imageMap[cityIndex];
      const imageKey =
        newIndexes[cityIndex] === 0 ? city.name : `${city.neighborhoods[newIndexes[cityIndex] - 1].name}, ${city.name}`;
      handleHover(urlMap[imageKey], imageKey.split(",")[0], imageKey);

      return newIndexes;
    });
  };

  const handleNextClick = (canScrollNext: boolean, cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];
      newIndexes[cityIndex] = Math.min(newIndexes[cityIndex] + 1, city.neighborhoods.length);

      const imageKey =
        newIndexes[cityIndex] === 0 ? city.name : `${city.neighborhoods[newIndexes[cityIndex] - 1].name}, ${city.name}`;
      handleHover(urlMap[imageKey], imageKey.split(",")[0], imageKey);

      return newIndexes;
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="grid p-8 w-full grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {imageMap.map((city, cityIndex) => (
          <Carousel key={cityIndex} className="w-full h-full" onMouseLeave={() => setUnderlinedImage("")}>
            <CarouselContent>
              <CarouselItem
                key={city.name}
                className="flex justify-center items-center h-full w-full"
                onMouseOver={() => {
                  handleHover(urlMap[city.name], city.name.split(",")[0], city.name);
                }}
              >
                <div
                  className="relative flex justify-center items-center h-40 w-full"
                  onClick={() => {
                    setClickedLocation(true);
                    setQuery(city.name);
                  }}
                >
                  <Image
                    className="object-cover object-center rounded-lg"
                    src={urlMap[city.name]}
                    alt="City Image"
                    sizes={"(max-width: 200px), (max-height: 200px)"}
                    fill={true}
                    priority={true}
                    onLoad={() => handleImageLoad(urlMap[city.name])}
                  />
                  <div className="absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 rounded-t-lg">
                    <div className="flex flex-col justify-center items-center">
                      <p className={`flex items-center gap-x-2 ${underlinedImage === city.name && "underline"}`}>
                        {city.name.split(",")[0]}{" "}
                      </p>
                      <p
                        className={`flex items-center gap-x-2 font-medium text-sm ${
                          underlinedImage === city.name && "underline"
                        }`}
                      >
                        {city.name.split(",")[1]}{" "}
                        {<FlagComponent country={city.countryCode as Country} countryName={city.countryCode} />}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              {city.neighborhoods.map((neighborhood) => (
                <CarouselItem
                  key={neighborhood.name}
                  className="flex justify-center items-center h-full w-full"
                  onMouseOver={() => {
                    handleHover(
                      urlMap[`${neighborhood.name}, ${city.name}`],
                      neighborhood.name,
                      `${neighborhood.name}, ${city.name}`
                    );
                  }}
                >
                  <div
                    className="relative flex justify-center items-center h-40 w-full"
                    onClick={() => {
                      setClickedLocation(true);
                      setQuery(`${neighborhood.name}, ${city.name}`);
                    }}
                  >
                    <Image
                      className="object-cover object-center rounded-lg" //opacity-65 dark:opacity-60"
                      src={urlMap[`${neighborhood.name}, ${city.name}`]}
                      alt="Location Image"
                      sizes={"(max-width: 200px), (max-height: 200px)"}
                      fill={true}
                      priority={true}
                      onLoad={() => handleImageLoad(urlMap[`${neighborhood.name}, ${city.name}`])}
                    />

                    <div
                      className={`absolute top-0 left-0 right-0 bg-white/70 dark:bg-secondary/70 text-black dark:text-white text-center py-1 rounded-t-lg ${
                        underlinedImage === `${neighborhood.name}, ${city.name}` && "underline"
                      }`}
                    >
                      <p className="flex justify-center items-center gap-2">
                        {neighborhood.name}
                        {<FlagComponent country={city.countryCode as Country} countryName={city.countryCode} />}
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
                onCustomClick={(canScrollPrev: boolean) => handlePreviousClick(canScrollPrev, cityIndex)}
                onMouseOver={() => {
                  setUnderlinedImage(hoveredImageSearch);
                }}
              />
            }
            {
              <CarouselNext
                className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8"
                onCustomClick={(canScrollNext: boolean) => handleNextClick(canScrollNext, cityIndex)}
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
            setUnderlinedImage(key);
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
            priority={true}
            sizes={"(max-width: 500px), (max-height: 500px)"}
            onLoad={() => handleImageLoad(hoveredImage)}
          />
          <CardTitle
            className={`relative z-1 flex flex-col pt-2 pb-2 justify-start items-center font-normal text-4xl bg-white/70 dark:bg-secondary/70 text-black dark:text-white rounded-t-lg ${
              underlinedImage === key && "underline"
            }`}
          >
            {key}
          </CardTitle>
        </div>
      </div>
    </div>
  );
}
