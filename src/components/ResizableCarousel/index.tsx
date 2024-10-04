"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HomeType } from "@/lib/validations";
import { FavoriteComponent } from "@/components/FavoriteComponent";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { Star } from "lucide-react";

interface Props {
  photos: string[];
  title: string;
  height?: string;
  rounded?: string;
  isLoading?: boolean;
  openModal?: (index: number) => void;
  handleFavorite?: () => void;
  hovering?: boolean;
  home: HomeType;
  large?: boolean;
}

export default function ResizableCarousel({ photos, title, height, rounded, openModal, hovering, home, large }: Props) {
  const { user } = useContext(LocaleContext);

  return (
    <Carousel className="h-full w-full">
      <CarouselContent>
        {photos.map((photo: string, index) => (
          <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
            <div
              onClick={openModal && (() => openModal(index))}
              className={`relative justify-center items-center ${height ? height : "h-[200px]"} w-full`}
            >
              <Image
                src={photo.replace(process.env.NEXT_PUBLIC_AWS_S3_URL!, process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL!)}
                className={`object-cover object-center ${rounded ? rounded : "rounded-t-lg"}`}
                alt={`${title} photo ${index}`}
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
              {/* {home.listingType === "premium" && (
                <div>
                  <div className="relative flex justify-between w-full">
                    <div className="flex gap-3 px-3 items-center bg-gradient-to-r rounded-l-lg rounded-b-none from-amber-400 via-yellow-400 to-amber-400 text-white py-1 font-semibold shadow-xl">
                      <div className="flex">PREMIUM</div>
                      <div className="flex w-full h-full items-center">
                        <Star size={20} fill={"white"} />
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {user && user.id !== home.ownerId && <FavoriteComponent user={user} home={home} large={large} />}
      <CarouselPrevious className={`${hovering ? "flex" : "hidden"} absolute left-6 size-8`} />
      <CarouselNext className={`${hovering ? "flex" : "hidden"} absolute right-6 size-8 border-2`} />
    </Carousel>
  );
}
