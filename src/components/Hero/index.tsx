import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import { poppins, montserrat } from "@/app/fonts";

export default function Hero() {
  return (
    <div className="relative h-[30vh] flex w-full">
      <Image
        src="/house.jpg"
        alt="background"
        fill={true}
        style={{ objectFit: "cover" }}
        quality={100}
        priority={true}
        className="-z-10 opacity-30 dark:opacity-20"
      />
      <div className="z-10 flex flex-col w-full justify-center items-center space-y-10">
        <h1 className={`${poppins.className} text-center text-2xl md:text-3xl lg:text-3xl font-light tracking-wider`}>
          Find your dream home.
        </h1>
        <div className="flex justify-center items-center w-full">
          <SearchBox />
        </div>
      </div>
    </div>
  );
}
