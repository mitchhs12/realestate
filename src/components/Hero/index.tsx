import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative flex w-full h-[30vh]">
      <Image
        src="/house.jpg"
        alt="background"
        fill={true}
        objectFit="cover"
        quality={100}
        className="-z-10 opacity-30"
      />
      <div className="z-10 flex space-y-10 flex-col justify-center items-center h-full w-full">
        <h1 className="text-3xl font-bold">Welcome to Propertuna!!</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search locations" className="bg-muted" />
          <Button type="submit">Search</Button>
        </div>
      </div>
    </div>
  );
}
