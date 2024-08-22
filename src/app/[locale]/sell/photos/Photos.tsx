"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icons } from "@/components/icons";
import { getPhotoUrls, deletePhoto } from "@/app/[locale]/sell/actions";
import { uploadPhotos } from "@/app/[locale]/sell/sell-actions";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { HomeType } from "@/lib/validations";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  requirement: string;
  restriction: string;
  drag: string;
  maximum: string;
  onlyImages: string;
  tooNarrow: string;
  tooShort: string;
  fileSize: string;
}

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
      <Image src={url} alt={`Uploaded ${id}`} fill={true} className="object-cover" />
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

export default function Photos({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  requirement,
  restriction,
  drag,
  maximum,
  onlyImages,
  tooNarrow,
  tooShort,
  fileSize,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setCurrentHome,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);

  const [isUploading, setIsUploading] = useState(true);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    retrievePhotos().then(() => setIsUploading(false));
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    setErrorMessage(null);
    if (currentHome && uploadedImageUrls.length >= 5) {
      setNextDisabled(false);
      setNewHome({ ...currentHome, photos: uploadedImageUrls });
    } else {
      setNextDisabled(true);
    }
  }, [uploadedImageUrls]);

  const handleDelete = async (url: string) => {
    setPhotoLoading((prev) => ({ ...prev, [url]: true })); // Set loading for this photo
    const urlParts = url.split("/");
    const photoKey = urlParts[urlParts.length - 1]; // Extract the photo key from the URL
    const homeId = currentHome?.id;

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
    if (currentHome) {
      console.log("currentHomeId", currentHome.id);
      const photoUrls = await getPhotoUrls(currentHome.id);
      if (photoUrls) {
        setUploadedImageUrls(photoUrls);
      } else {
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

  const checkImageDimensions = async (file: File): Promise<{ isValid: boolean; reason?: string }> => {
    const bitmap = await createImageBitmap(file);

    if (bitmap.width < 500) {
      return { isValid: false, reason: "width" };
    } else if (bitmap.height < 500) {
      return { isValid: false, reason: "height" };
    }

    return { isValid: true };
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const files = event.target.files;
    console.log("files", files);

    if (files && currentHome) {
      if (files.length + uploadedImageUrls.length > 12) {
        setErrorMessage(restriction);
        setIsUploading(false);
        return;
      }

      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log("file:", file);

        if (!file.type.startsWith("image/")) {
          setErrorMessage(onlyImages);
          setIsUploading(false);
          return;
        }
        const { isValid, reason } = await checkImageDimensions(file);
        if (!isValid) {
          setErrorMessage(reason === "width" ? tooNarrow : tooShort);
          setIsUploading(false);
          return;
        }
        if (file.size > 4000000) {
          setErrorMessage(fileSize);
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("homeId", currentHome.id.toString());

        // Upload each file and store the promise in the array
        const uploadPromise = uploadPhotos(formData);
        uploadPromises.push(uploadPromise);
      }

      try {
        setErrorMessage(null);
        console.log(`attempting to upload ${files.length} photos`);

        // Wait for all the uploads to finish
        const results = await Promise.all(uploadPromises);

        await retrievePhotos(); // Refresh the photo URLs
        console.log("Files retrieved successfully!");
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
    setIsUploading(false);
  };

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 1000,
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
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className={`text-lg w-full ${uploadedImageUrls.length === 12 && "text-green-500"}`}>
              {uploadedImageUrls.length < 5 ? requirement : uploadedImageUrls.length < 12 ? restriction : maximum}
            </h3>
            {uploadedImageUrls.length > 0 && <h4>{drag}</h4>}
            {uploadedImageUrls.length < 5 && <h4>{restriction}</h4>}
          </div>
        </div>
        <div className="flex flex-col px-8 gap-4 w-full lg:h-full justify-center items-center h-full">
          <div className="flex justify-center text-center text-red-500 text-xs md:text-base lg:text-lg">
            {errorMessage}
          </div>
          <div className={`flex w-full h-full max-w-7xl items-start`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-rows-4 lg:grid-cols-4 lg:grid-rows-3 gap-4 pb-8 w-full">
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
                <DragOverlay>
                  {activeId && (
                    <div className="relative flex w-full h-full items-center justify-center">
                      <Image src={activeId} alt={`Dragged ${activeId}`} fill={true} className="object-cover" />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
              {uploadedImageUrls.length < 12 && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
