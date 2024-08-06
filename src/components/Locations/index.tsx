"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Skeleton } from "@/components/ui/skeleton";

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

  const handleImageLoad = (imageUrl: string) => {
    console.log("loaded", imageUrl);
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = new Set(prevLoadingImages);
      newLoadingImages.delete(imageUrl);
      return newLoadingImages;
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {imageMap.map((city, index) => (
          <Card
            key={index}
            className="flex flex-col w-full shadow-lg shadow-card relative overflow-hidden"
            onMouseEnter={() => {
              const [place, country] = city.name.split(",");
              setHoveredImage(urlMap[city.name]);
              setKey(place);
            }}
          >
            {loadingImages.has(urlMap[city.name]) && <Skeleton className="absolute inset-0" />}
            <Image
              className="object-cover" //opacity-65 dark:opacity-60"
              src={urlMap[city.name]}
              alt="Location Image"
              sizes={"(max-width: 200px), (max-height: 200px)"}
              fill={true}
              priority={true}
              onLoad={() => handleImageLoad(urlMap[city.name])}
            />
            <div className="relative z-10">
              <CardHeader className="w-full p-2 px-2">
                <CardTitle className="flex justify-center">
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="md:h-9 md:px-4 md:py-2 md:text-sm w-full"
                    onMouseEnter={() => {
                      const [place, country] = city.name.split(",");
                      setHoveredImage(urlMap[city.name]);
                      setKey(place);
                    }}
                    onClick={() => {
                      setClickedLocation(true);
                      setQuery(city.name);
                    }}
                  >
                    {city.name}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center w-full h-full p-2 gap-y-1 pt-0">
                {city.neighborhoods.map((neighborhood) => (
                  <Button
                    key={neighborhood.name}
                    variant={"secondary"}
                    onMouseEnter={() => {
                      setHoveredImage(urlMap[`${neighborhood.name}, ${city.name}`]);
                      setKey(neighborhood.name);
                    }}
                    className="w-2/3 justify-center"
                    size={"sm"}
                    onClick={() => {
                      setClickedLocation(true);
                      setQuery(`${neighborhood.name}, ${city.name}`);
                    }}
                  >
                    {neighborhood.name}
                  </Button>
                ))}
              </CardContent>
            </div>
          </Card>
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
          <CardTitle className="relative z-1 flex flex-col pt-4 justify-start items-center h-full w-full font-medium text-4xl">
            {key}
          </CardTitle>
        </Card>
      </div>
    </div>
  );
}
