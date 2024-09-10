"use client";

import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map } from "lucide-react";

interface Props {
  showMap: string;
  showList: string;
}

const FloatingButton = ({ showMap, showList }: Props) => {
  const { mapFocused, setMapFocused } = useContext(QueryContext);

  return (
    <Button
      variant="outline"
      size={"default"}
      onClick={() => setMapFocused(!mapFocused)}
      className={`hidden md:flex fixed lg:hidden bottom-20 left-1/2 transform -translate-x-1/2 shadow-xl dark:shadow-white/10`}
    >
      {mapFocused ? (
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
};

export default FloatingButton;
