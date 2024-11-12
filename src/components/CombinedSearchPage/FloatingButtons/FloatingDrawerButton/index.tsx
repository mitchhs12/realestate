"use client";

import React, { useContext } from "react";
import { QueryContext } from "../../../../context/QueryContext";
import { Button } from "../../../ui/button";
import { LayoutGrid, Map } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  isLoading: boolean;
  loadingText: string;
  showMap: string;
  showList: string;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export default function FloatingDrawerButton({
  isLoading,
  loadingText,
  showMap,
  showList,
  drawerOpen,
  setDrawerOpen,
}: Props) {
  return (
    <Button
      variant="outline"
      size={"default"}
      disabled={isLoading}
      onClick={() => {
        setDrawerOpen(!drawerOpen);
      }}
      className={`md:hidden z-[30] fixed bottom-20 left-1/2 transform -translate-x-1/2 shadow-xl dark:shadow-white/10`}
    >
      {isLoading ? (
        <span className="flex justify-center items-center gap-3">
          <ReloadIcon width={20} height={20} className="animate-spin" />
          {loadingText}
        </span>
      ) : !drawerOpen ? (
        <span className="flex justify-center items-center gap-3">
          <LayoutGrid width={20} />
          {showList}
        </span>
      ) : (
        <span className="flex justify-center items-center gap-3">
          <Map width={20} />
          {showMap}
        </span>
      )}
    </Button>
  );
}
