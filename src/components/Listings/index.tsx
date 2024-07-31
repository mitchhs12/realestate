"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import SkeletonCard from "@/components/SkeletonCard";
import { getFeatured, getNew } from "@/app/actions";
import { useState, useEffect } from "react";
import { HomeType } from "@/lib/validations";
import Image from "next/image";

interface Props {
  type: string;
}

export default function Listings({ type }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [homes, setHomes] = useState<HomeType[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let data;
        if (type === "featured") {
          data = await getFeatured();
        } else {
          // type === 'new'
          data = await getNew();
        }
        setHomes(data);
      } catch (error) {
        console.error(`Error fetching ${type} properties:`, error);
      }
    };

    fetchProperties();
  }, [type]);

  return isLoading ? (
    <div className="flex flex-row w-full gap-2 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 justify-center items-center">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ) : (
    <div className="flex flex-row space-x-4">
      {homes.map((home, index) => (
        <div key={index} className="border rounded-lg">
          <Carousel>
            <CarouselContent>
              {home.photos.map((photo: string, index) => (
                <CarouselItem key={index}>
                  <div className="flex justify-center items-center h-64">
                    <Image src={photo} alt={home.title!} width={300} height={300} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-3" />
            <CarouselNext className="absolute right-3" />
          </Carousel>
          <div className="flex flex-col border-2 overflow-auto p-4">
            <h2 className="text-2xl font-semibold mb-2">{home.title}</h2>
            <p className="text-gray-700 mb-4">{home.description}</p>
            <p className="text-lg font-bold">{home.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
