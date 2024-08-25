import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HomeType } from "@/lib/validations";

interface Props {
  home: HomeType;
  height?: string;
  rounded?: string;
  isLoading?: boolean;
  openModal?: (index: number) => void;
}

export default function ResizableCard({ home, height, rounded, openModal }: Props) {
  return (
    <Carousel className="h-full w-full">
      <CarouselContent>
        {home.photos.map((photo: string, index) => (
          <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
            <div
              onClick={openModal && (() => openModal(index))}
              className={`relative justify-center items-center ${height ? height : "h-[220px]"} w-full`}
            >
              <Image
                src={photo}
                className={`object-cover object-center ${rounded ? rounded : "rounded-t-lg"}`}
                alt={`${home.title} photo ${index}`}
                fill
                sizes="(max-width: 500px) 100vw, (max-height: 500px) 100vh"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex absolute left-6 size-8" />
      <CarouselNext className="hidden sm:flex absolute right-6 size-8" />
    </Carousel>
  );
}
