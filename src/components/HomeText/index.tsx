"use client";

import { QueryContext } from "@/context/QueryContext";
import { useContext, useEffect } from "react";
import { HomeType } from "@/lib/validations";

interface Props {
  home: HomeType;
}

export default function HomeText({ home }: Props) {
  const { setCurrentHome, setQuery } = useContext(QueryContext);

  useEffect(() => {
    if (home && home.address) {
      setCurrentHome(home);
      setQuery(home.address);
    }
  }, [home]);

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <div>Hello there!</div>
    </div>
  );
}
