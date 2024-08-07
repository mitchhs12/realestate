"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface CityImage {
  name: string;
  neighborhoods: Neighborhood[];
}

interface Neighborhood {
  name: string;
}

const imageMap: CityImage[] = [
  {
    name: "Buenos Aires, Argentina",
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
    return `${baseUrl}/${countryName.toLowerCase().trim()}/${formattedPlace}.avif`;
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
  const [key, setKey] = useState("Buenos Aires");
  const { setQuery, setClickedLocation } = useContext(QueryContext);
  const [loadingImages, setLoadingImages] = useState(new Set(Object.keys(urlMap)));
  const [currentIndexes, setCurrentIndexes] = useState(imageMap.map(() => 0));

  const handleImageLoad = (imageUrl: string) => {
    console.log("loaded", imageUrl);
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = new Set(prevLoadingImages);
      newLoadingImages.delete(imageUrl);
      return newLoadingImages;
    });
  };

  const handleHover = (imageUrl: string, key: string) => {
    setHoveredImage(imageUrl);
    setKey(key);
  };

  const handlePreviousClick = (cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[cityIndex] = Math.max(newIndexes[cityIndex] - 1, 0);

      const city = imageMap[cityIndex];
      const imageKey =
        newIndexes[cityIndex] === 0 ? city.name : `${city.neighborhoods[newIndexes[cityIndex] - 1].name}, ${city.name}`;
      handleHover(urlMap[imageKey], imageKey.split(",")[0]);

      return newIndexes;
    });
  };

  const handleNextClick = (cityIndex: number) => {
    setCurrentIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const city = imageMap[cityIndex];
      newIndexes[cityIndex] = Math.min(newIndexes[cityIndex] + 1, city.neighborhoods.length);

      const imageKey =
        newIndexes[cityIndex] === 0 ? city.name : `${city.neighborhoods[newIndexes[cityIndex] - 1].name}, ${city.name}`;
      handleHover(urlMap[imageKey], imageKey.split(",")[0]);

      return newIndexes;
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {imageMap.map((city, cityIndex) => (
          <div className="flex flex-col rounded-xl h-full w-44 md:w-52 lg:w-52 xl:w-52 space-y-2 shadow-lg dark:shadow-card bg-card">
            <Carousel>
              <CarouselContent>
                <CarouselItem
                  key={city.name}
                  className="flex justify-center items-center"
                  onMouseEnter={() => handleHover(urlMap[city.name], city.name.split(",")[0])}
                >
                  <div className="relative flex justify-center items-center h-40 w-44 md:h-40 md:w-52 lg:h-40 lg:w-52 xl:h-40 xl:w-52">
                    <Image
                      className="object-cover object-center rounded-xl"
                      src={urlMap[city.name]}
                      alt="City Image"
                      sizes={"(max-width: 200px), (max-height: 200px)"}
                      fill={true}
                      priority={true}
                      onLoad={() => handleImageLoad(urlMap[city.name])}
                    />
                    <div className="absolute top-0 left-0 right-0 bg-white dark:bg-secondary bg-opacity-70 text-black dark:text-white text-center py-1 rounded-t-xl">
                      <p className="">{city.name.split(",")[0]}</p>
                      <p className="text-sm md:text-sm">{city.name.split(",")[1]}</p>
                    </div>
                  </div>
                </CarouselItem>
                {city.neighborhoods.map((neighborhood) => (
                  <CarouselItem
                    key={neighborhood.name}
                    className="flex justify-center items-center"
                    onMouseEnter={() => handleHover(urlMap[`${neighborhood.name}, ${city.name}`], neighborhood.name)}
                  >
                    <div className="relative flex justify-center items-center h-40 w-44 md:h-40 md:w-52 lg:h-40 lg:w-52 xl:h-40 xl:w-52">
                      <Image
                        className="object-cover object-center rounded-xl" //opacity-65 dark:opacity-60"
                        src={urlMap[`${neighborhood.name}, ${city.name}`]}
                        alt="Location Image"
                        sizes={"(max-width: 200px), (max-height: 200px)"}
                        fill={true}
                        priority={true}
                        onLoad={() => handleImageLoad(urlMap[`${neighborhood.name}, ${city.name}`])}
                      />

                      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-secondary bg-opacity-70 text-black dark:text-white text-center py-1 rounded-t-xl">
                        {neighborhood.name}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="hidden md:flex absolute left-4 size-4 md:size-6 lg:size-8"
                onCustomClick={() => handlePreviousClick(cityIndex)}
              />
              <CarouselNext
                className="hidden md:flex absolute right-4 size-4 md:size-6 lg:size-8"
                onCustomClick={() => handleNextClick(cityIndex)}
              />
            </Carousel>
          </div>
        ))}
        <Card className="hidden sm:relative sm:block col-span-2 row-span-2 row-start-1 row-end-3 sm:col-start-2 sm:col-end-4 sm:row-start-1 sm:row-end-3 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 xl:col-start-5 xl:col-end-7 xl:row-start-1 xl:row-end-3 border">
          {loadingImages.has(hoveredImage) && <Skeleton className="absolute inset-0" />}
          <Image
            src={hoveredImage}
            alt="Location Image"
            fill={true}
            className="object-cover rounded-xl absolute inset-0 z-0" // opacity-65 dark:opacity-60"
            priority={true}
            sizes={"(max-width: 500px), (max-height: 500px)"}
            onLoad={() => handleImageLoad(hoveredImage)}
          />
          <CardTitle className="relative z-1 flex flex-col pt-2 pb-2 justify-start items-center font-normal text-4xl bg-white dark:bg-secondary bg-opacity-70 text-black dark:text-white">
            {key}
          </CardTitle>
        </Card>
      </div>
    </div>
  );
}
