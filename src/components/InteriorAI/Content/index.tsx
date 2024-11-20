"use client";

import { useEffect, useState, useContext } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import CountUpClock from "@/components/CountUpClock";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { CompareSlider } from "@/components/ReactCompareSlider";
import { roomTypesMap, roomStylesMap, propertyStylesMap, typesMap } from "@/lib/sellFlowData";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocaleContext } from "@/context/LocaleContext";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useScopedI18n } from "@/locales/client";
import { useTheme } from "next-themes";
import ImageUpload from "@/components/ImageUpload";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  imageUrl?: string;
}

export default function AIContent({ imageUrl }: Props) {
  const [newPredictionId, setNewPredictionId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { resolvedTheme: theme } = useTheme();

  const [previousError, setPreviousError] = useState<string | null>(null);
  const [historicalImage, setHistoricalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [isRoom, setIsRoom] = useState<boolean>(true);
  const [originalImage, setOriginalImage] = useState<string>(
    imageUrl
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/${theme === "dark" ? "dark4" : "light4"}.jpg`
  );
  const [uploadedImage, setUploadedImage] = useState<null | string>(null);
  const [uploadNew, setUploadNew] = useState<boolean>(imageUrl ? false : true);
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const [fetchingPrevious, setFetchingPrevious] = useState<boolean>(true);
  const { user } = useContext(LocaleContext);
  const HomeIcon = typeIcons["house"];
  const RoomIcon = typeIcons["room"];
  const t = useScopedI18n("ai-studio");

  const types = useScopedI18n("sell.type");
  const rt = useScopedI18n("home.roomTypes");
  const rs = useScopedI18n("home.roomStyles");
  const ps = useScopedI18n("home.propertyStyles");
  const p = useScopedI18n("sell.photos");

  const sortByCreation = (input: any[]) => {
    return input.sort((a, b) => {
      return new Date(b[Object.keys(b)[0]].createdAt).getTime() - new Date(a[Object.keys(a)[0]].createdAt).getTime();
    });
  };

  useEffect(() => {
    if (uploadedImage) {
      setOriginalImage(uploadedImage);
      console.log("originalImage", originalImage);
    }
  }, [uploadedImage]);

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
        userId: user?.id,
        imageUrl: originalImage,
        type: isRoom,
        room: type,
        style: style,
      }),
    });

    const data = await result.json();
    setNewPredictionId(data.id);
  }

  useEffect(() => {
    const getPreviouslyGenerated = async () => {
      try {
        const response = await fetch("/api/redis/previousGenerations/" + user!.id);
        const predictions = await response.json();

        console.log(predictions);

        if (response.status === 200) {
          setPreviousGenerations(sortByCreation(predictions.data));
        } else {
          setPreviousError(predictions.error || "An error occurred");
          setStatus("Unable to fetch previously generated ");
        }
      } catch (err) {
        setPreviousError(`An unexpected error occurred: ${error}`);
      }
      setFetchingPrevious(false);
    };
    getPreviouslyGenerated();
  }, []);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        while (status === "pending") {
          await sleep(5000);
          const response = await fetch("/api/redis/getSpecificPrediction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user!.id,
              predictionId: newPredictionId,
            }),
          });
          const result = await response.json();

          if (response.status === 500) {
            setError(result.prediction.detail || "An error occurred");
            setStatus("failed");
          } else if (response.status === 200) {
            if (result.prediction.status === "succeeded") {
              setHistoricalImage(result.prediction.originalImg);
              setGeneratedImage(result.prediction.generatedImg);
              const newPreviousGenerations = previousGenerations;
              setPreviousGenerations([{ [newPredictionId!]: result.prediction }, ...newPreviousGenerations]);

              setStatus("succeeded");
              break;
            } else if (result.prediction.status === "failed") {
              setError("Prediction failed");
              setStatus("failed");
            }
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
        setStatus("failed");
      }
    };

    fetchPrediction();
  }, [newPredictionId]);

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
      <div className="flex flex-col justify-start w-full h-full overflow-y-auto gap-6">
        <div className="flex justify-center items-start w-full">
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
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                className="flex justify-center items-center gap-3 text-md"
                onClick={callRedesign}
                disabled={status === "pending" || !type || !style || (!imageUrl && !uploadedImage)}
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
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 items-center justify-start">
          <div className="grid grid-cols-1 xl:grid-cols-2 w-full gap-8 p-8 justify-items-center max-w-8xl">
            <div className="relative w-full h-[375px] xl:h-[400px] 2xl:h-[450px] max-w-[700px] rounded-xl shadow-lg dark:shadow-white/10 overflow-hidden order-1 xl:order-none">
              {originalImage && !uploadNew ? (
                <div>
                  <Image
                    src={originalImage}
                    alt="Original Image"
                    className="object-cover object-center"
                    fill={true}
                    sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                  />
                  <div className="absolute top-0 left-0">
                    <Button
                      variant="default"
                      className="flex justify-center items-center gap-3 text-md"
                      onClick={() => {
                        setUploadNew(true);
                      }}
                    >
                      <ChevronUp />
                      <p>{t("upload-new")}</p>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full justify-center items-center">
                  {!uploadedImage && uploadNew && !imageUrl ? (
                    <ImageUpload
                      filePath={`${user!.id}/ai`}
                      onlyImagesError={p("onlyImages")}
                      tooNarrowError={p("tooNarrow")}
                      tooShortError={p("tooShort")}
                      fileSizeError={p("fileSize")}
                      setUploadedImage={setUploadedImage}
                      setUploadNew={setUploadNew}
                      isUploading={isUploading}
                      setIsUploading={setIsUploading}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <ImageUpload
                        filePath={`${user!.id}/ai`}
                        onlyImagesError={p("onlyImages")}
                        tooNarrowError={p("tooNarrow")}
                        tooShortError={p("tooShort")}
                        fileSizeError={p("fileSize")}
                        setUploadedImage={setUploadedImage}
                        setUploadNew={setUploadNew}
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                      />
                      <div className="absolute top-0 left-0">
                        <Button
                          disabled={isUploading}
                          variant="default"
                          className="flex justify-center items-center gap-3 text-md"
                          onClick={() => setUploadNew(false)}
                        >
                          <ChevronLeft />
                          <p>{t("old-photo")}</p>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative w-full h-[375px] xl:h-[400px] 2xl:h-[450px] max-w-[700px] rounded-xl shadow-lg dark:shadow-white/10 overflow-hidden order-2 xl:order-none">
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
                (generatedImage || historicalImage) && (
                  <Image
                    src={
                      generatedImage ||
                      `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/${theme === "dark" ? "dark4" : "light4"}.jpg`
                    }
                    alt="Generated Image"
                    className="object-cover object-center"
                    fill={true}
                    sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                  />
                )
              )}
            </div>

            <div className="flex flex-col gap-2 w-full h-[375px] xl:h-[400px] 2xl:h-[450px] max-w-[700px] order-4 xl:order-none rounded-xl overflow-hidden">
              <h1 className="text-center text-lg">{t("images-expire-warning")}</h1>
              {fetchingPrevious ? (
                <div className="relative flex w-full h-full">
                  <Skeleton className="absolute inset-0 w-full h-full" />
                  <div className="flex justify-center items-center w-full">
                    <div className="flex items-center gap-3 text-sm sm:text-medium">
                      <ReloadIcon className="animate-spin w-6 h-6" />
                      <p className="text-start">{t("fetching-previous-generations")}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full pb-6 justify-start items-start overflow-y-auto">
                  {previousError ? (
                    <h3 className="text-center text-red-500">{previousError}</h3>
                  ) : previousGenerations.length > 0 ? (
                    <div className="flex flex-col gap-3 w-full items-start justify-start">
                      {previousGenerations.map((generation, index) => (
                        <Button
                          key={index}
                          asChild
                          className="hover:cursor-pointer shadow-lg dark:shadow-white/10 p-0 rounded-xl overflow-hidden"
                          variant={"outline"}
                          onClick={() => {
                            setUploadNew(false);
                            setOriginalImage(generation[Object.keys(generation)[0]].originalImg);
                            setHistoricalImage(generation[Object.keys(generation)[0]].originalImg);
                            setGeneratedImage(generation[Object.keys(generation)[0]].generatedImg);
                          }}
                        >
                          <div className="flex flex-col sm:flex-row w-full h-full sm:gap-5">
                            <div className="relative w-full h-[200px]">
                              <Image
                                src={generation[Object.keys(generation)[0]].generatedImg}
                                alt="Generated Image"
                                className="object-cover object-center"
                                fill={true}
                                sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                              />
                            </div>
                            <div className="flex flex-col py-4 gap-5 items-center justify-center text-center sm:text-start w-1/2">
                              <div className="flex flex-col gap-2 text-center items-center">
                                <div className="text-md">{t("created")}</div>
                                <div>{new Date(generation[Object.keys(generation)[0]].createdAt).toLocaleString()}</div>
                              </div>
                              <div className="flex flex-col gap-2 text-center items-center">
                                <div className="text-md">{t("completed")}</div>
                                <div>
                                  {new Date(generation[Object.keys(generation)[0]].completedAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex text-center justify-center items-center w-full h-full">
                      {t("images-get-started")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full h-[375px] xl:h-[400px] 2xl:h-[450px] max-w-[700px] rounded-xl shadow-lg dark:shadow-white/10 overflow-hidden order-3 xl:order-none">
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
                (generatedImage || historicalImage) && (
                  <CompareSlider
                    original={
                      historicalImage ||
                      imageUrl ||
                      `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/${theme === "dark" ? "dark4" : "light4"}.jpg`
                    }
                    restored={
                      generatedImage ||
                      `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/${theme === "dark" ? "dark4" : "light4"}.jpg`
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
