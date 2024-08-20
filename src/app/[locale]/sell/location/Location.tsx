"use client";

import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import SearchBox from "@/components/SearchBox";
import SmallMap from "@/components/SmallMap";
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  text: string;
  placeholder: string;
  title: string;
  subtitle: string;
}

interface SearchResult {
  text: string;
  placeId: string;
}

export default function Location({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  text,
  placeholder,
  title,
  subtitle,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setCurrentHome,
    setPrevLoading,
  } = useContext(SellContext);
  const [searchResult, setSearchResult] = useState<SearchResult>({ text: "", placeId: "" });
  const [currentCoords, setCurrentCoords] = useState(
    currentHome?.latitude && currentHome?.longitude
      ? { lat: currentHome.latitude, long: currentHome.longitude }
      : { lat: 0, long: 0 }
  );

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coordinates = await fetch("/api/getCoordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId: searchResult.placeId,
        }),
      });
      const data = await coordinates.json();
      console.log("data", data);
      setCurrentCoords(data);
    };
    if (searchResult.placeId !== "") {
      fetchCoordinates();
    }
  }, [searchResult]);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
          <div className="flex flex-col h-full justify-center items-center w-full text-lg md:text-xl xl:text-2xl py-8">
            <SearchBox
              isSmallMap={true}
              setSearchResult={(text, placeId) => setSearchResult({ text: text, placeId: placeId })}
              placeholder={placeholder}
              text={text}
            />
          </div>
        </div>
        {currentCoords.lat !== 0 && currentCoords.long !== 0 ? (
          <div className="flex w-[80vw] h-full">
            <SmallMap coordinates={currentCoords} currentHome={currentHome} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
