import Image from "next/image";
import { HomeType } from "@/lib/validations";

export default function HomePhotos({ home }: { home: HomeType }) {
  return (
    <div className="flex justify-center h-full border-2 border-blue-500">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-1/2 w-full">
        {home.photos.slice(0, 5).map((photo, index) => (
          <div key={index} className={`relative ${index === 0 ? "row-span-2 col-span-2 h-full w-full" : ""}`}>
            <Image
              src={photo}
              className="object-cover object-center rounded-lg"
              alt={`${home.title} photo ${index}`}
              fill={true}
              sizes={"(max-width: 500px), (max-height: 500px)"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
