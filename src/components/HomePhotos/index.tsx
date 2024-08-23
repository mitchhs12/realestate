import Image from "next/image";
import { HomeType } from "@/lib/validations";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function HomePhotos({ home }: { home: HomeType }) {
  return (
    <div className="flex flex-col min-h-full w-full p-8">
      <div className="flex justify-center min-h-full w-full">
        {/* Grid for larger screens */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-80 lg:h-96 w-full">
          {home.photos.slice(0, 5).map((photo, index) => (
            <div key={index} className={`relative ${index === 0 ? "row-span-2 col-span-2" : ""} h-full w-full`}>
              <Image
                src={photo}
                className="object-cover object-center rounded-lg"
                alt={`${home.title} photo ${index}`}
                fill
                sizes="(max-width: 500px), (max-height: 500px)"
              />
            </div>
          ))}
        </div>

        {/* Carousel for smaller screens */}
        <div className="md:hidden w-full">
          <Carousel className="relative h-full w-full">
            <CarouselContent>
              {home.photos.map((photo: string, index) => (
                <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
                  <div className="relative justify-center items-center h-48 xs:h-64 sm:h-72 w-full">
                    <Image
                      src={photo}
                      className="object-cover object-center rounded-lg"
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
        </div>
      </div>
    </div>
  );
}
