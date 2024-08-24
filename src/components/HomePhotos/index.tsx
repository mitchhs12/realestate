import Image from "next/image";
import { HomeType } from "@/lib/validations";
import ResizableCarousel from "@/components/ResizableCarousel";

export default function HomePhotos({ home }: { home: HomeType }) {
  return (
    <div className="flex flex-col min-h-full w-full p-8">
      <div className="flex justify-center h-full w-full">
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
        <div className="md:hidden w-full border-2 border-green-500">
          <ResizableCarousel home={home} height={"300px"} />
        </div>
      </div>
    </div>
  );
}
