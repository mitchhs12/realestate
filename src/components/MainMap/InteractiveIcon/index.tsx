"use client";
import React, { useState } from "react";
import { findMatching } from "@/lib/utils";
import MultiTypeButton from "@/components/MultiTypeButton";
import { TypeObject } from "@/lib/validations";

export default function InteractiveIcon({
  typesObject,
  array,
}: {
  typesObject: {
    id: string;
    name: string;
    translation: string;
  }[];
  array: any;
}) {
  const matchingTypes = findMatching(typesObject, array, "type");
  const [currentType, setCurrentType] = useState<TypeObject | null>(matchingTypes[0]);

  return (
    <MultiTypeButton
      types={matchingTypes}
      currentType={currentType}
      setCurrentType={setCurrentType}
      width={50}
      className="flex border-2"
      height={50}
      color={"#16A34A"}
      variant={"none"}
      disabled={false}
    />
  );
}
