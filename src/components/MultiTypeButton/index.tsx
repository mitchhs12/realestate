"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TypeObject } from "@/lib/validations";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useTheme } from "next-themes";

export default function MultiTypeButton({
  types,
  currentType,
  setCurrentType,
  color,
  className,
  variant,
  disabled,
  width,
  height,
  premium,
}: {
  types: TypeObject[];
  currentType: TypeObject | null;
  setCurrentType: (type: TypeObject | null) => void;
  color?: string;
  className?: string;
  disabled?: boolean | null;
  width?: number;
  height?: number;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "none" | null | undefined;
  premium?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const { resolvedTheme: theme } = useTheme();

  const IconComponent = currentType ? typeIcons[currentType?.id as keyof typeof typeIcons] : null; // Get the corresponding icon

  useEffect(() => {
    if (types.length > 0) {
      setCurrentType(types[0]);
    } else {
      setCurrentType(null);
    }
  }, [types]);

  return (
    IconComponent && (
      <Button
        variant={variant ? variant : types.length > 1 ? "outline" : "ghost"}
        // sets disabled to true if it is null
        disabled={disabled === true ? (types.length > 1 ? false : true) : disabled === false ? false : true}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const newIndex = (index + 1) % types.length;
          setIndex(newIndex);
          setCurrentType(types[newIndex]);
        }}
        size={"icon"}
        className={className ? `${className}` : "absolute bottom-2 left-2 disabled:opacity-100"}
      >
        <IconComponent
          color={color ? color : premium ? "#F59E0B" : theme === "dark" ? "white" : "black"}
          width={width ? width : 40}
          height={height ? height : 40}
        />
      </Button>
    )
  );
}
