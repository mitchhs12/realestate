import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HomeType } from "@/lib/validations";
import { useState } from "react";

interface Props {
  home: HomeType;
  height?: string;
  rounded?: string;
  isLoading?: boolean;
  openModal?: (index: number) => void;
  hovering?: boolean;
}

export default function ResizableCard({ home, height, rounded, openModal, hovering }: Props) {
  return (
    <Carousel className="h-full w-full">
      <CarouselContent>
        {home.photos.map((photo: string, index) => (
          <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
            <div
              onClick={openModal && (() => openModal(index))}
              className={`relative justify-center items-center ${height ? height : "h-[200px]"} w-full`}
            >
              <Image
                src={photo}
                className={`object-cover object-center ${rounded ? rounded : "rounded-t-lg"}`}
                alt={`${home.title} photo ${index}`}
                fill={true}
                loading={"lazy"}
                placeholder={"blur"}
                blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                sizes="
                (max-width: 400px) 400px,
                (max-width: 510px) 510px,
                (max-width: 768px) 768px, 
                (max-width: 1024px) 1024px, 
                (max-width: 1280px) 1280px, 
                (max-width: 1536px) 1536px,
                (max-width: 1920px) 1920px,
                100vw"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`${hovering ? "flex" : "hidden"} absolute left-6 size-8`} />
      <CarouselNext className={`${hovering ? "flex" : "hidden"} absolute right-6 size-8 border-2`} />
    </Carousel>
  );
}
