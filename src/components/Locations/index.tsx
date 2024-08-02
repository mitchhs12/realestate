"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CityImages {
  image: string;
  [key: string]: string;
}

const imageMap: { [city: string]: CityImages } = {
  "Buenos Aires, Argentina": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina/argentina.avif",
    Palermo: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina/palermo.avif",
    Recoleta: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina/recoleta.avif",
    Belgrano: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina/belgrano.avif",
  },
  // "Mendoza, Argentina": {
  //   image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.avif",
  //   "Chacras de Coria": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.avif",
  //   "City Center": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.avif",
  // },
  "Mexico City, Mexico": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/mexico/mexico.avif",
    Polanco: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/mexico/polanco.avif",
    Condesa: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/mexico/condesa.avif",
    "Roma Norte": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/mexico/roma+norte.avif",
  },
  // "São Paulo, Brazil": {
  //   image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  //   Jardins: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  //   "Vila Madalena": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  //   Moema: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  // },
  "Rio de Janeiro, Brazil": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil/brazil.avif",
    Ipanema: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil/ipanema.avif",
    Leblon: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil/leblon.avif",
    "Barra da Tijuca": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil/barra+da+tijuca.avif",
  },
  // "Florianópolis, Brazil": {
  //   image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  //   "Jurerê Internacional": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  //   "Lagoa da Conceição": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.avif",
  // },
  "Medellín, Colombia": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia/colombia.avif",
    "El Poblado": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia/el+poblado.avif",
    Laureles: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia/laureles.avif",
  },
  "Santiago, Chile": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.avif",
    Providencia: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.avif",
    "Las Condes": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.avif",
    Vitacura: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.avif",
  },
  "Quito, Ecuador": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.avif",
    "La Floresta": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.avif",
    Cumbayá: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.avif",
    "González Suárez": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.avif",
  },
  "Lima, Peru": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.avif",
    Miraflores: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.avif",
    "San Isidro": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.avif",
    Barranco: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.avif",
  },
  "Montevideo, Uruguay": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.avif",
    "Punta Carretas": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.avif",
    Pocitos: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.avif",
    Carrasco: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.avif",
  },
};

export default function Locations() {
  const [hoveredImage, setHoveredImage] = useState(imageMap["Buenos Aires, Argentina"].image);
  const [key, setKey] = useState("Buenos Aires");

  const locations: { city: string; neighborhoods: string[] }[] = [
    { city: "Buenos Aires, Argentina", neighborhoods: ["Palermo", "Recoleta", "Belgrano"] },
    // { city: "Mendoza, Argentina", neighborhoods: ["Chacras de Coria", "City Center"] },
    // { city: "São Paulo, Brazil", neighborhoods: ["Jardins", "Vila Madalena", "Moema"] },
    { city: "Mexico City, Mexico", neighborhoods: ["Polanco", "Condesa", "Roma Norte"] },
    { city: "Rio de Janeiro, Brazil", neighborhoods: ["Ipanema", "Leblon", "Barra da Tijuca"] },
    // { city: "Florianópolis, Brazil", neighborhoods: ["Jurerê Internacional", "Lagoa da Conceição"] },
    { city: "Medellín, Colombia", neighborhoods: ["El Poblado", "Laureles"] },
    { city: "Santiago, Chile", neighborhoods: ["Providencia", "Las Condes", "Vitacura"] },
    { city: "Quito, Ecuador", neighborhoods: ["La Floresta", "Cumbayá", "González Suárez"] },
    { city: "Lima, Peru", neighborhoods: ["Miraflores", "San Isidro", "Barranco"] },
    { city: "Montevideo, Uruguay", neighborhoods: ["Punta Carretas", "Pocitos", "Carrasco"] },
  ];

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-2 grid-rows-4 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-2 gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {locations.map((location, index) => (
          <Card
            key={index}
            className="flex flex-col h-42 w-full shadow-lg relative overflow-hidden"
            onMouseEnter={() => {
              setHoveredImage(imageMap[location.city]["image"]);
              setKey(location.city.split(",")[0]);
            }}
          >
            <Image
              className="object-cover opacity-60"
              src={imageMap[location.city].image}
              alt="Location Image"
              fill={true}
            />
            <div className="relative z-10">
              <CardHeader className="w-full p-2 px-2">
                <CardTitle className="flex justify-center">
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="md:h-9 md:px-4 md:py-2 md:text-sm w-full"
                    onMouseEnter={() => {
                      setHoveredImage(imageMap[location.city].image);
                      setKey(location.city.split(",")[0]);
                    }}
                  >
                    {location.city}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center w-full h-full p-2 gap-y-1 pt-0">
                {location.neighborhoods.map((neighborhood) => (
                  <Button
                    key={neighborhood}
                    variant={"secondary"}
                    onMouseEnter={() => {
                      setHoveredImage(imageMap[location.city][neighborhood]);
                      setKey(neighborhood);
                    }}
                    className="w-2/3 justify-center"
                    size={"sm"}
                  >
                    {neighborhood}
                  </Button>
                ))}
              </CardContent>
            </div>
          </Card>
        ))}
        <Card className="hidden md:relative md:block col-span-2 row-span-2 row-start-1 row-end-3 md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-3 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 xl:col-start-5 xl:col-end-7 xl:row-start-1 xl:row-end-3 border">
          <Image
            src={hoveredImage}
            alt="Location Image"
            fill={true}
            className="object-cover rounded-xl opacity-60 absolute inset-0 z-0"
          />
          <CardTitle className="relative z-1 flex flex-col justify-center items-center h-full w-full text-2xl">
            {key}
          </CardTitle>
        </Card>
      </div>
    </div>
  );
}
