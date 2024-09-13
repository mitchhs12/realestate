import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { User } from "next-auth";
import { HomeType } from "@/lib/validations";
import { FavoriteComponent } from "@/components/FavoriteComponent";

interface Props {
  photos: string[];
  title: string;
  height?: string;
  rounded?: string;
  isLoading?: boolean;
  openModal?: (index: number) => void;
  handleFavorite?: () => void;
  hovering?: boolean;
  user?: User | undefined;
  home: (HomeType & { isFavoritedByUser: boolean }) | HomeType;
}

export default function ResizableCarousel({ photos, title, height, rounded, openModal, hovering, user, home }: Props) {
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {user && user.id !== home.ownerId && (
        <FavoriteComponent user={user} home={home as HomeType & { isFavoritedByUser: boolean }} />
      )}
      <CarouselPrevious className={`${hovering ? "flex" : "hidden"} absolute left-6 size-8`} />
      <CarouselNext className={`${hovering ? "flex" : "hidden"} absolute right-6 size-8 border-2`} />
    </Carousel>
  );
}
