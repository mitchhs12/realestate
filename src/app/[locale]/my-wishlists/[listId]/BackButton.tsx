"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";

export default function BackButton({ listText }: { listText: string }) {
  return (
    <Button
      asChild
      size={"largeIcon"}
      variant={"outline"}
      className="flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group"
      disabled={true}
    >
      <Link href={`/my-wishlists`}>
        <div>
          <div className="flex px-2 justify-center text-center items-center">
            <div className="flex justify-between items-center gap-2">
              <Heart width={"22"} height={"22"} />
              <ChevronLeft width={"22"} height={"22"} />
            </div>
            <h1 className={`flex text-inline align-middle font-medium`}>{listText}</h1>
          </div>
        </div>
      </Link>
    </Button>
  );
}
