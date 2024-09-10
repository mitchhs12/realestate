"use client";

import React, { useContext } from "react";
import { QueryContext } from "../../../context/QueryContext";
import { Button } from "../../../components/ui/button";
import { LayoutGrid, Map } from "lucide-react";

interface Props {
  showMap: string;
  showList: string;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export default function FloatingDrawerButton({ showMap, showList, drawerOpen, setDrawerOpen }: Props) {
  return (
    <Button
      variant="outline"
      size={"default"}
      onClick={() => {
        console.log("test");
        setDrawerOpen(!drawerOpen);
      }}
      className={`md:hidden z-[30] fixed bottom-20 left-1/2 transform -translate-x-1/2 shadow-xl dark:shadow-white/10`}
    >
      {!drawerOpen ? (
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
