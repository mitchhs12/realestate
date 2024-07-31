import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="rounded-xl h-12 w-14 xs:h-16 xs:w-20 sm:h-20 sm:w-24 md:h-24 md:w-28 lg:h-32 lg:w-36 xl:h-40 xl:w-48 2xl:h-48 2xl:w-64" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-14 xs:h-4 xs:w-full sm:h-4 sm:w-full md:h-4 md:w-full lg:h-4 lg:w-full xl:h-4 xl:w-full 2xl:h-4 2xl:w-full" />
        <Skeleton className="h-4 w-14 xs:h-4 xs:w-full sm:h-4 sm:w-full md:h-4 md:w-full lg:h-4 lg:w-full xl:h-4 xl:w-full 2xl:h-4 2xl:w-full" />
      </div>
    </div>
  );
}
