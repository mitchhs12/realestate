"use client";

import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Button } from "@/components/ui/button";

const FloatingButton = () => {
  const { mapFocused, setMapFocused } = useContext(QueryContext);

  return (
    <Button
      variant="secondary"
      onClick={() => setMapFocused(!mapFocused)}
      className={`hidden md:flex fixed lg:hidden bottom-20 left-1/2 transform -translate-x-1/2 shadow-lg`}
    >
      Show {mapFocused ? "List" : "Map"}
    </Button>
  );
};

export default FloatingButton;
