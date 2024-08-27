import { HomeType } from "@/lib/validations";
// import Card from "@/components/Card";
import ResizableCard from "@/components/ResizableCard";

interface Props {
  homes: HomeType[];
}

export default function Listings({ homes }: Props) {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="grid grid-cols-2 grid-rows-2 p-8 w-full h-full sm:grid-cols-3 sm:grid-rows-1 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {homes.map((home, index) => (
          <div
            key={index}
            className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/15 rounded-lg
              ${index >= 4 && "hidden sm:block"}
              ${index >= 3 && "sm:hidden lg:block"}
              ${index >= 4 && "lg:hidden xl:block"}
            `}
          >
            <ResizableCard home={home} />
          </div>
        ))}
      </div>
    </div>
  );
}
