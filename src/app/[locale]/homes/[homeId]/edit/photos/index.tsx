"use client";
import { useContext, useEffect, useState } from "react";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icons } from "@/components/Icons/icons";
import { getPhotoUrls, deletePhoto } from "@/app/[locale]/sell/actions";
import { uploadPhotos } from "@/app/[locale]/sell/sell-actions";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import imageCompression from "browser-image-compression";
import { resizeImageToMinDimensions } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { HomeContext } from "@/context/HomeContext";
import { usePathname } from "next/navigation";
import { LocaleContext } from "@/context/LocaleContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PricingDialog from "@/components/StartPageContent/Dialog";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function SortableItem({
  id,
  url,
  index,
  onDelete,
  isLoading,
}: {
  id: string;
  url: string;
  index: number;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="draggable relative flex items-center justify-center h-[112px] sm:h-[184px] lg:h-[252px]"
    >
      <Image
        src={`${url}?cache=${new Date().getTime()}`}
        alt={`Uploaded ${id}`}
        fill={true}
        className="object-cover"
        placeholder={"blur"}
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
      />
      {isLoading && (
        <div className="absolute flex items-center justify-center inset-0 bg-black bg-opacity-50 rounded">
          <ReloadIcon className="animate-spin w-6 h-6" />
        </div>
      )}
      <Button
        size={"icon"}
        variant={"destructive"}
        onClick={() => onDelete(url)}
        className="absolute top-1 right-1 justify-center items-center"
        disabled={isLoading}
      >
        <TrashIcon className="w-6 h-6" />
      </Button>
      <div className="absolute top-2 left-2 flex items-center justify-center">
        <Badge variant="secondary">{index + 1}</Badge>
      </div>
    </div>
  );
}

export default function Photos() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [isUploading, setIsUploading] = useState(true);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const { user, defaultLanguage } = useContext(LocaleContext);
  const pathname = usePathname();

  const t = useScopedI18n("sell.photos");
  const h = useScopedI18n("homes");

  const requirement = t("requirement");
  const photoWarningStarter = t("photo-warning-starter");
  const photoWarningpro = t("photo-warning-pro");
  const photoWarningpremium = t("photo-warning-premium");
  const photoWarningbusiness = t("photo-warning-business");
  const restrictionStarter = t("restriction-starter");
  const restrictionPro = t("restriction-pro");
  const restrictionPremium = t("restriction-premium");
  const restrictionBusiness = t("restriction-business");

  const uploadLimit =
    user?.sellerSubscription === "starter"
      ? 5
      : user?.sellerSubscription === "pro"
        ? 15
        : user?.sellerSubscription === "premium"
          ? 30
          : 50;

  const photoRestrictions = {
    starter: restrictionStarter,
    pro: restrictionPro,
    premium: restrictionPremium,
    business: restrictionBusiness,
  };
  const photoWarnings = {
    starter: photoWarningStarter,
    pro: photoWarningpro,
    premium: photoWarningpremium,
    business: photoWarningbusiness,
  };
  const upgrade = {
    upgradePlan: t("upgrade-plan"),
    upgradeButton: t("upgrade-button"),
  };
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${defaultLanguage}${pathname}`
      : `https://www.vivaideal.com/${defaultLanguage}${pathname}`;
  const sellerSubscription = user?.sellerSubscription as keyof typeof photoRestrictions;

  useEffect(() => {
    retrievePhotos().then(() => setIsUploading(false));
  }, []);

  useEffect(() => {
    setErrorMessage(null);
    if (editedHome && uploadedImageUrls.length >= 5) {
      setSaveDisabled(false);
      setEditedHome({ ...editedHome, photos: uploadedImageUrls });
    } else {
      setSaveDisabled(true);
    }
  }, [uploadedImageUrls]);

  const handleDelete = async (url: string) => {
    setPhotoLoading((prev) => ({ ...prev, [url]: true })); // Set loading for this photo
    const urlParts = url.split("/");
    const photoKey = urlParts[urlParts.length - 1]; // Extract the photo key from the URL
    const homeId = editedHome?.id;

    if (!homeId) {
      console.error("Home ID not found");
      return;
    }

    try {
      await deletePhoto(homeId, photoKey); // Call the delete function from your actions
      setUploadedImageUrls((prevUrls) => prevUrls.filter((existingUrl) => existingUrl !== url)); // Update state
    } catch (error) {
      console.error("Error deleting photo from S3:", error);
    }
    setPhotoLoading((prev) => ({ ...prev, [url]: false })); // Set loading for this photo
  };

  const retrievePhotos = async () => {
    if (editedHome) {
      const photoUrls = await getPhotoUrls(editedHome.id);
      if (photoUrls) {
        const updatedPhotos = new Set(editedHome.photos);
        // Add any photoUrls that are not already in editedHome.photos
        photoUrls.forEach((url) => {
          if (!updatedPhotos.has(url)) {
            updatedPhotos.add(url);
          }
        });
        setUploadedImageUrls(Array.from(updatedPhotos));
      } else {
        console.log("Unknown URLS:", photoUrls);
        setUploadedImageUrls([]);
      }
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setErrorMessage(null);

    const files = event.target.files;

    if (!files || !editedHome) {
      setIsUploading(false);
      return;
    }

    if (files.length + uploadedImageUrls.length > uploadLimit) {
      setErrorMessage(photoWarnings[sellerSubscription]);
      setIsUploading(false);
      return;
    }

    const validImageFiles: File[] = [];

    for (const file of Array.from(files)) {
      try {
        if (!file.type.startsWith("image/")) {
          throw new Error(t("onlyImages"));
        }

        if (file.size > 4000000) {
          throw new Error(t("fileSize"));
        }

        validImageFiles.push(file);
      } catch (error: any) {
        setErrorMessage(error.message || "Error processing files");
        setIsUploading(false);
        return;
      }
    }

    try {
      const uploadPromises = validImageFiles.map(async (file) => {
        const resizedFile = await resizeImageToMinDimensions(file, 600, t("tooShort"), t("tooNarrow"));

        const options = {
          maxSizeMB: 1,
          useWebWorker: true,
          fileType: "image/webp",
        };

        const compressedFile = await imageCompression(resizedFile, options);
        const webpFile = new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), { type: "image/webp" });

        const formData = new FormData();
        formData.append("file", webpFile);
        formData.append("homeId", editedHome.id.toString());

        return uploadPhotos(formData);
      });

      await Promise.all(uploadPromises);
      await retrievePhotos(); // Refresh the photo URLs
    } catch (error: any) {
      console.error("Error during file processing:", error);
      setErrorMessage(error.message || "Error uploading files");
    }

    setIsUploading(false);
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over.id) {
      setUploadedImageUrls((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => setActiveId(null);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-10">
      <div className="flex flex-col w-full h-full justify-start items-center text-center gap-y-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className={`text-lg w-full`}>
              {uploadedImageUrls.length > 0 && <h4>{t("drag")}</h4>}
              {uploadedImageUrls.length < 5 && <h4>{t("requirement")}</h4>}
              {uploadedImageUrls.length < uploadLimit ? (
                photoRestrictions[sellerSubscription]
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="text-red-500">{t("maximum")}</div>
                  <div>{upgrade.upgradePlan}</div>
                  <Dialog>
                    <DialogTrigger>
                      <Button>{upgrade.upgradeButton}</Button>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col py-1 px-0 w-[90%] max-w-8xl h-[90%] overflow-y-auto">
                      <PricingDialog redirectUrl={redirectUrl} sellersOnly={true} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </h3>
          </div>
        </div>
        <div className="flex flex-col px-8 gap-4 w-full lg:h-full justify-start items-center h-full overflow-auto">
          <div className="flex justify-center text-center text-red-500 text-xs md:text-base lg:text-lg">
            {errorMessage}
          </div>
          <div className={`flex flex-col w-full h-full max-w-7xl items-center justify-start gap-3`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 w-full">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={uploadedImageUrls} strategy={rectSortingStrategy}>
                  {uploadedImageUrls.map((url, index) => (
                    <SortableItem
                      key={url}
                      id={url}
                      url={url}
                      index={index}
                      onDelete={handleDelete}
                      isLoading={photoLoading[url] || false}
                    />
                  ))}
                </SortableContext>
                <DragOverlay
                  dropAnimation={{
                    duration: 250,
                    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                  }}
                >
                  {activeId && (
                    <div className="relative flex w-full h-full shadow-2xl dark:shadow-white/15 items-center justify-center">
                      <Image src={activeId} alt={`Dragged ${activeId}`} fill={true} className="object-cover" />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
              {uploadedImageUrls.length < uploadLimit && (
                <div className="flex items-center justify-center border row-start-1 row-end-1 h-[112px] sm:h-[184px] lg:h-[252px]">
                  <Form {...form}>
                    <form className="flex justify-start space-y-6 w-full h-full">
                      <FormField
                        control={form.control}
                        name="username"
                        render={() => (
                          <FormItem className="flex flex-col justify-start items-start w-full h-full">
                            <FormControl className="w-full h-full">
                              <div
                                className={`relative flex w-full h-full justify-center items-center bg-card ${
                                  !isUploading && "hover:bg-muted"
                                } border-2`}
                              >
                                <div className="absolute flex justify-center items-center w-full h-full">
                                  {isUploading ? <ReloadIcon className="animate-spin w-6 h-6" /> : <Icons.image_icon />}
                                </div>
                                <input
                                  className={`relative flex w-full h-full opacity-0 ${
                                    !isUploading && "cursor-pointer"
                                  }`}
                                  accept="image/*"
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  disabled={isUploading}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              )}
            </div>
            <Button
              onClick={handleSaveEdits}
              variant={"default"}
              className="bottom-4 sticky"
              disabled={saveDisabled || saveLoading}
            >
              {saveLoading ? <ReloadIcon className="animate-spin w-6 h-6" /> : h("save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
