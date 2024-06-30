import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="flex w-full h-[30vh]">
      <div className="z-10 flex gap-10 flex-col justify-center items-center h-full w-full bg-stone-200 dark:bg-stone-900">
        <h1 className="text-3xl font-bold">Welcome to Propertuna!</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search for properties" />
          <Button type="submit">Search</Button>
        </div>
      </div>
    </div>
  );
}
