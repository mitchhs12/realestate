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
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
    Palermo: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
    Recoleta: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
    Belgrano: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
  },
  "Mendoza, Argentina": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
    "Chacras de Coria": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
    "City Center": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/argentina.webp",
  },
  "São Paulo, Brazil": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    Jardins: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    "Vila Madalena": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    Moema: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
  },
  "Rio de Janeiro, Brazil": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    Ipanema: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    Leblon: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    "Barra da Tijuca": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
  },
  "Florianópolis, Brazil": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    "Jurerê Internacional": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
    "Lagoa da Conceição": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/brazil.webp",
  },
  "Medellín, Colombia": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia.webp",
    "El Poblado": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia.webp",
    Laureles: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/colombia.webp",
  },
  "Santiago, Chile": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.webp",
    Providencia: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.webp",
    "Las Condes": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.webp",
    Vitacura: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/chile.webp",
  },
  "Quito, Ecuador": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.webp",
    "La Floresta": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.webp",
    Cumbayá: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.webp",
    "González Suárez": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/ecuador.webp",
  },
  "Lima, Peru": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.webp",
    Miraflores: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.webp",
    "San Isidro": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.webp",
    Barranco: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/peru.webp",
  },
  "Montevideo, Uruguay": {
    image: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.webp",
    "Punta Carretas": "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.webp",
    Pocitos: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.webp",
    Carrasco: "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/uruguay.webp",
  },
};

export default function Locations() {
  const [hoveredImage, setHoveredImage] = useState(imageMap["Buenos Aires, Argentina"].image);

  const locations: { city: string; neighborhoods: string[] }[] = [
    { city: "Buenos Aires, Argentina", neighborhoods: ["Palermo", "Recoleta", "Belgrano"] },
    { city: "Mendoza, Argentina", neighborhoods: ["Chacras de Coria", "City Center"] },
    { city: "São Paulo, Brazil", neighborhoods: ["Jardins", "Vila Madalena", "Moema"] },
    { city: "Rio de Janeiro, Brazil", neighborhoods: ["Ipanema", "Leblon", "Barra da Tijuca"] },
    { city: "Florianópolis, Brazil", neighborhoods: ["Jurerê Internacional", "Lagoa da Conceição"] },
    { city: "Medellín, Colombia", neighborhoods: ["El Poblado", "Laureles"] },
    { city: "Santiago, Chile", neighborhoods: ["Providencia", "Las Condes", "Vitacura"] },
    { city: "Quito, Ecuador", neighborhoods: ["La Floresta", "Cumbayá", "González Suárez"] },
    { city: "Lima, Peru", neighborhoods: ["Miraflores", "San Isidro", "Barranco"] },
    { city: "Montevideo, Uruguay", neighborhoods: ["Punta Carretas", "Pocitos", "Carrasco"] },
  ];

  return (
    <div className="flex flex-col items-center h-full w-full gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
        <Card className="relative w-full h-96 col-span-2 row-span-2">
          <Image src={hoveredImage} alt="Location Image" fill={true} className="object-cover" />
        </Card>
        {locations.map((location, index) => (
          <Card
            key={index}
            className="flex flex-col h-full w-full"
            onMouseEnter={() => {
              setHoveredImage(imageMap[location.city]["image"]);
            }}
          >
            <CardHeader className="w-full p-4">
              <CardTitle className="flex justify-center">
                <Button variant={"secondary"} size={"default"}>
                  {location.city}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start w-full h-full p-2 pt-0">
              {location.neighborhoods.map((neighborhood) => (
                <Button
                  key={neighborhood}
                  variant={"ghost"}
                  onMouseEnter={() => {
                    setHoveredImage(imageMap[location.city][neighborhood]);
                  }}
                  size={"sm"}
                >
                  {neighborhood}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
