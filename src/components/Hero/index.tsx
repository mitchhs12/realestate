import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import { montserrat } from "@/app/fonts";

export default function Hero() {
  return (
    <div className="relative h-[30vh] flex w-full">
      <Image
        src="/house.jpg"
        alt="background"
        fill={true}
        objectFit="cover"
        quality={100}
        className="-z-10 opacity-30"
      />
      <div className="z-10 flex flex-col w-full justify-center items-center space-y-10">
        <h1 className={`${montserrat.className} text-3xl font-bold whitespace-nowrap`}>Global Patios</h1>
        <div className="flex justify-center items-center w-full">
          <SearchBox />
        </div>
      </div>
    </div>
  );
}
