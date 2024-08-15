"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import SearchBox from "@/components/SearchBox";
import SmallMap from "@/components/SmallMap";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

interface SearchResult {
  text: string;
  placeId: string;
}

export default function Location({ sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome } =
    useContext(SellContext);
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
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Location</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Where is your property?</h3>
          </div>
          <div className="flex flex-col h-full justify-center items-center w-full text-lg md:text-xl xl:text-2xl py-8">
            <SearchBox
              isSmallMap={true}
              setSearchResult={(text, placeId) => setSearchResult({ text: text, placeId: placeId })}
            />
          </div>
        </div>
        {currentCoords.lat !== 0 && currentCoords.long !== 0 ? (
          <div className="flex w-[80vw] h-full">
            <SmallMap coordinates={currentCoords} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
