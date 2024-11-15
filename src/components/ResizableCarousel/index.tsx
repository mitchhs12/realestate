"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HomeType } from "@/lib/validations";
import { FavoriteComponent } from "@/components/FavoriteComponent";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import Link from "next/link";
import { useTheme } from "next-themes";
import InteriorAI from "@/components/InteriorAI/MainButton";

interface Props {
  photos: string[];
  title: string;
  height?: string;
  isLoading?: boolean;
  openModal?: (index: number) => void;
  handleFavorite?: () => void;
  hovering?: boolean;
  home: HomeType;
  large?: boolean;
  link?: boolean;
  aiDesign?: boolean;
}

export default function ResizableCarousel({
  photos,
  title,
  height,
  openModal,
  hovering,
  home,
  large,
  link,
  aiDesign,
}: Props) {
  const { user } = useContext(LocaleContext);
  const { resolvedTheme: theme } = useTheme();
  const placeholderImage = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/${theme === "dark" ? "dark4" : "light4"}.jpg`; // Placeholder image URL
  const validPhotos = photos && photos.length > 0 ? photos : [placeholderImage];

  return (
    <Carousel className="h-full w-full overflow-hidden bg-white dark:bg-black">
      <CarouselContent className="ml-0">
        {validPhotos.map((photo: string, index) => (
          <CarouselItem key={index} className="h-full w-full pl-0">
            <div className="relative w-full h-full">
              <div
                onClick={openModal && (() => openModal(index))}
                className={`relative justify-center items-center ${height ? height : "h-[250px]"} w-full `}
              >
                {link ? (
                  <Link href={home.isComplete ? `/homes/${home.id}` : `/sell/${home.id}`} target={"_blank"}>
                    <Image
                      src={photo.replace(
                        process.env.NEXT_PUBLIC_AWS_S3_URL!,
                        process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL!
                      )}
                      className={`object-cover object-center`}
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
                  </Link>
                ) : (
                  <Image
                    src={photo.replace(
                      process.env.NEXT_PUBLIC_AWS_S3_URL!,
                      process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL!
                    )}
                    className={`object-cover object-center`}
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
                )}
              </div>
              {/* Check if the photo is AI-generated */}
              {aiDesign && (
                <div className="absolute top-3 left-3 z-100">
                  <InteriorAI imageUrl={photo} />
                </div>
              )}
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
