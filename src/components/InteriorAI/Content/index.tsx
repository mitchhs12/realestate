"use client";

import { useEffect, useState, useContext } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import CountUpClock from "@/components/CountUpClock";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { CompareSlider } from "@/components/ReactCompareSlider";
import { roomTypesMap, roomStylesMap, propertyStylesMap, typesMap } from "@/lib/sellFlowData";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HomeContext } from "@/context/HomeContext";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useScopedI18n } from "@/locales/client";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  imageUrl?: string;
}

export default function AIContent({ imageUrl }: Props) {
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [isRoom, setIsRoom] = useState<boolean>(true);
  const { matchingTypes } = useContext(HomeContext);
  const HomeIcon = typeIcons["house"];
  const RoomIcon = typeIcons["room"];
  const t = useScopedI18n("ai-studio");

  const types = useScopedI18n("sell.type");
  const rt = useScopedI18n("home.roomTypes");
  const rs = useScopedI18n("home.roomStyles");
  const ps = useScopedI18n("home.propertyStyles");

  const propertyTypes = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: types(`options.${index}` as keyof typeof types),
  }));
  const roomTypes = Array.from({ length: 6 }, (_, index) => ({
    id: roomTypesMap[index].id,
    name: roomTypesMap[index].name,
    translation: rt(`options.${index}` as keyof typeof rt),
  }));
  const roomStyles = Array.from({ length: 10 }, (_, index) => ({
    id: roomStylesMap[index].id,
    name: roomStylesMap[index].name,
    translation: rs(`options.${index}` as keyof typeof rs),
  }));
  const propertyStyles = Array.from({ length: 10 }, (_, index) => ({
    id: propertyStylesMap[index].id,
    name: propertyStylesMap[index].name,
    translation: ps(`options.${index}` as keyof typeof ps),
  }));

  async function callRedesign() {
    setStatus("pending");
    const result = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: `${imageUrl}`,
        type: isRoom,
        room: type,
        style: style,
      }),
    });

    const data = await result.json();
    setPredictionId(data.id);
  }

  useEffect(() => {
    if (!predictionId || status === "succeeded" || status === "failed") return;

    const fetchPredictionStatus = async () => {
      try {
        while (status === "pending") {
          await sleep(2000);
          const response = await fetch("/api/predictions/" + predictionId);
          const prediction = await response.json();

          if (response.status !== 200) {
            setError(prediction.detail || "An error occurred");
            setStatus("failed");
            return;
          }

          if (prediction.status === "succeeded") {
            if (prediction.input.image === imageUrl) {
              setGeneratedImage(prediction.output[1]);
              setStatus("succeeded");
              break;
            }
          } else if (prediction.status === "failed") {
            setError("Prediction failed");
            setStatus("failed");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
        setStatus("failed");
      }
    };

    fetchPredictionStatus();
  }, [predictionId, status]);

  useEffect(() => {
    if (!isRoom) {
      setType(null);
      setStyle(null);
    } else {
      setType(null);
      setStyle(null);
    }
  }, [!isRoom]);

  return (
    <>
      <DialogHeader className="items-center">
        <DialogTitle className="text-lg lg:text-xl">{t("title")}</DialogTitle>
        <DialogDescription className="text-md lg:text-lg">{t("subtitle")}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col justify-star w-full h-full overflow-y-auto gap-6">
        <div className="flex justify-center items-start w-full h-full">
          <div className="flex flex-col justify-start items-center gap-3 w-[500px] h-full px-4">
            <div className="flex w-full gap-3">
              <div className="flex text-nowrap items-center gap-3">{t("redesign")}</div>
              <Button
                className="flex items-center gap-3 w-full justify-center text-md"
                variant={"outline"}
                size={"default"}
                onClick={() => setIsRoom(!isRoom)}
              >
                {isRoom ? (
                  <RoomIcon color="black" width={30} height={30} />
                ) : (
                  <HomeIcon color="black" width={30} height={30} />
                )}
                {isRoom ? t("isRoomButton.room") : t("isRoomButton.property")}
              </Button>
            </div>
            <div className="flex w-full gap-3 items-center justify-between">
              <Select key={isRoom ? "room" : "property"} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isRoom ? t("kind-room-placeholder") : t("kind-property-placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{isRoom ? t("room-kind-title") : t("property-kind-title")}</SelectLabel>
                    {isRoom
                      ? roomTypes.map((room) => (
                          <SelectItem key={room.id} value={room.name}>
                            {room.translation}
                          </SelectItem>
                        ))
                      : propertyTypes.map((property) => (
                          <SelectItem key={property.id} value={property.name}>
                            {property.translation}
                          </SelectItem>
                        ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full gap-3 items-center justify-between">
              <Select key={isRoom ? "room" : "property"} onValueChange={setStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isRoom ? t("style-room-placeholder") : t("style-property-placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{isRoom ? t("room-style-title") : t("property-style-title")}</SelectLabel>
                    {isRoom
                      ? roomStyles.map((roomStyle) => (
                          <SelectItem key={roomStyle.id} value={roomStyle.name}>
                            {roomStyle.translation}
                          </SelectItem>
                        ))
                      : propertyStyles.map((propertyStyle) => (
                          <SelectItem key={propertyStyle.id} value={propertyStyle.name}>
                            {propertyStyle.translation}
                          </SelectItem>
                        ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full gap-6 items-center">
          <div className="grid grid-cols-1 xl:grid-cols-2 w-full gap-6 px-4 justify-items-center">
            {imageUrl && (
              <div className="relative w-full h-[250px] xs:h-[350px] sm:h-[400px] md:h-[450px] xl:h-[400px] max-w-[700px] rounded-xl shadow-xl overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt="Original Image"
                  className="object-cover object-center"
                  fill={true}
                  sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                />
              </div>
            )}
            <div className="relative w-full h-[250px] xs:h-[350px] sm:h-[400px] md:h-[450px] xl:h-[400px] max-w-[700px] rounded-xl shadow-xl overflow-hidden border">
              {status === "pending" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Skeleton className="absolute inset-0 w-full h-full" />
                  <div className="relative z-10">
                    <CountUpClock />
                  </div>
                </div>
              ) : status === "failed" ? (
                <p className="text-center text-red-500">Failed to generate design!</p>
              ) : (
                generatedImage && (
                  <Image
                    src={generatedImage}
                    alt="Generated Image"
                    className="object-cover object-center"
                    fill={true}
                    sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                  />
                )
              )}
            </div>
          </div>
          <div className="flex flex-col h-full w-full items-center gap-12 px-4 pb-8">
            <div className="flex flex-col gap-3 h-[30px]">
              <Button
                variant="default"
                className="flex justify-center items-center gap-3 text-md"
                onClick={callRedesign}
                disabled={status === "pending" || !type || !style}
              >
                {status === "pending" ? (
                  <span className="flex justify-center items-center gap-3">
                    <ReloadIcon className="animate-spin w-6 h-6" />
                    <p>{t("executeButton.loading")}</p>
                  </span>
                ) : (
                  <span className="flex justify-center items-center gap-3">
                    <Sparkles size={20} />
                    <p>{t("executeButton.submit")}</p>
                  </span>
                )}
              </Button>
              {status === "pending" && <p>(this may take 20+ seconds...)</p>}
            </div>
            <div className="w-full h-[250px] xs:h-[350px] sm:h-[400px] md:h-[450px] xl:h-[400px] max-w-[700px] shadow-xl overflow-hidden rounded-xl border">
              {status === "pending" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Skeleton className="absolute inset-0 w-full h-full" />
                  <div className="relative z-10">
                    <CountUpClock />
                  </div>
                </div>
              ) : status === "failed" ? (
                <p className="text-center text-red-500">Failed to generate design!</p>
              ) : (
                generatedImage && <CompareSlider original={imageUrl!} restored={generatedImage!} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
