"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { changeAllHomeVisibilities } from "@/app/[locale]/my-properties/actions";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  hideAllText: string;
  showAllText: string;
  allCompletedHomesActive: boolean;
}

export default function ToggleAllVisbilityButton({ hideAllText, showAllText, allCompletedHomesActive }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [allCompletedHomesActive]);

  return (
    <Button
      onClick={() => {
        setIsLoading(true);
        changeAllHomeVisibilities(allCompletedHomesActive);
      }}
      disabled={isLoading}
      className="text-xs sm:text-normal gap-3"
      variant={allCompletedHomesActive ? "destructive" : "default"}
    >
      {!isLoading ? (
        allCompletedHomesActive ? (
          <>
            <EyeOff />
            {hideAllText}
          </>
        ) : (
          <>
            <Eye />
            {showAllText}
          </>
        )
      ) : (
        <>
          <ReloadIcon className="animate-spin w-5 h-5" /> Loading...
        </>
      )}
    </Button>
  );
}
