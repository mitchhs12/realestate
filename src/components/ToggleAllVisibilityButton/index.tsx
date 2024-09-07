"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { changeAllHomeVisibilities } from "@/app/[locale]/my-properties/actions";

interface Props {
  hideAllText: string;
  showAllText: string;
  allCompletedHomesActive: boolean;
}

export default function ToggleAllVisbilityButton({ hideAllText, showAllText, allCompletedHomesActive }: Props) {
  return (
    <Button
      onClick={() => {
        changeAllHomeVisibilities(allCompletedHomesActive);
      }}
      className="gap-3"
      variant={allCompletedHomesActive ? "destructive" : "default"}
    >
      {allCompletedHomesActive ? (
        <>
          <EyeOff />
          {hideAllText}
        </>
      ) : (
        <>
          <Eye />
          {showAllText}
        </>
      )}
    </Button>
  );
}
