"use client";

import { useContext, useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox";
import SmallMap from "@/components/SmallMap";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { HomeContext } from "@/context/HomeContext";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Circle, Pin } from "lucide-react";

interface SearchResult {
  text: string;
  placeId: string;
}

export default function Location() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [searchResult, setSearchResult] = useState<SearchResult>({ text: "", placeId: "" });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isExactLocation, setIsExactLocation] = useState(editedHome?.exactLocation ? true : false);

  const [currentCoords, setCurrentCoords] = useState(
    editedHome?.latitude && editedHome?.longitude
      ? { lat: editedHome.latitude, long: editedHome.longitude }
      : { lat: 0, long: 0 }
  );

  useEffect(() => {
    console.log("exact", isExactLocation);
  }, [isExactLocation]);

  const t = useScopedI18n("sell.location");
  const s = useScopedI18n("home.header.search");
  const h = useScopedI18n("homes");

  useEffect(() => {
    if (editedHome) {
      console.log("exact location pin to be set", isExactLocation);

      setEditedHome({
        ...editedHome,
        latitude: currentCoords.lat,
        longitude: currentCoords.long,
        exactLocation: isExactLocation,
      });
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [currentCoords, isExactLocation]);

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
      setCurrentCoords(data);
    };
    if (searchResult.placeId !== "") {
      fetchCoordinates();
    }
  }, [searchResult]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-6">
      <div className="flex flex-col w-full max-w-8xl gap-8 h-full overflow-y-auto justify-start items-center text-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
          <div className="flex flex-col h-full justify-center items-center w-full text-lg md:text-xl xl:text-2xl py-8">
            <SearchBox
              placeholderShort={s("placeholder-short")}
              isSmallMap={true}
              setSearchResult={(text, placeId) => setSearchResult({ text: text, placeId: placeId })}
              placeholder={s("placeholder")}
              text={s("search-button")}
            />
          </div>
          {currentCoords.lat !== 0 && currentCoords.long !== 0 && (
            <div className="flex justify-center items-center gap-x-4">
              <Button
                disabled={isExactLocation}
                onClick={() => setIsExactLocation(true)}
                className="flex gap-3 items-center"
              >
                <Pin size={20} />
                {t("exact")}
              </Button>
              <Button
                disabled={!isExactLocation}
                onClick={() => setIsExactLocation(false)}
                className="flex gap-3 items-center"
              >
                <Circle size={20} />
                {t("approximate")}
              </Button>
            </div>
          )}
        </div>
        {currentCoords.lat !== 0 && currentCoords.long !== 0 && (
          <div className="flex flex-col items-start justify-center h-full w-full gap-8">
            <div className="flex w-full h-full">
              <SmallMap
                coordinates={currentCoords}
                currentHome={editedHome}
                setNewHome={setEditedHome}
                setSaveDisabled={setSaveDisabled}
                usePin={isExactLocation}
              />
            </div>
          </div>
        )}
      </div>
      <Button
        className="sticky bottom-0"
        variant={"default"}
        onClick={handleSaveEdits}
        disabled={saveDisabled || saveLoading}
      >
        {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : h("save")}
      </Button>
    </div>
  );
}
