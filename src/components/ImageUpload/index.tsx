import { useState, useContext, useEffect } from "react";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { resizeImageToMinDimensions } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Icons } from "../Icons/icons";
import { uploadAIPhoto } from "@/app/[locale]/actions";
import { LocaleContext } from "@/context/LocaleContext";

interface Props {
  filePath: string;
  onlyImagesError: string;
  tooNarrowError: string;
  fileSizeError: string;
  tooShortError: string;
  setUploadedImage: (url: string) => void;
  setUploadNew: (url: boolean) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

export default function ImageUpload({
  filePath,
  onlyImagesError,
  tooNarrowError,
  tooShortError,
  fileSizeError,
  setUploadedImage,
  setUploadNew,
  isUploading,
  setIsUploading,
}: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm();
  const { control } = form;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setErrorMessage(null);

    const file = event.target.files?.[0]; // Get the first file

    if (!file) {
      setIsUploading(false);
      return;
    }

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error(onlyImagesError);
      }

      if (file.size > 4000000) {
        throw new Error(fileSizeError);
      }

      // Resize and compress the file
      const resizedFile = await resizeImageToMinDimensions(file, 700, tooShortError, tooNarrowError);

      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(resizedFile, options);
      const webpFile = new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), { type: "image/webp" });

      // Prepare and upload the file
      const formData = new FormData();
      formData.append("file", webpFile);
      try {
        const url = await uploadAIPhoto(formData, filePath);
        console.log(url);
        const newUrl = url.replace(
          "https://vivaidealfinalbucket.s3.amazonaws.com",
          process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL!
        );
        setUploadedImage(newUrl);

        setUploadNew(false);
      } catch (uploadError: any) {
        throw new Error(`File upload failed: ${uploadError.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error during file processing:", error);
      setErrorMessage(error.message || "Error uploading the file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Form {...form}>
        <form className="flex justify-start space-y-6 w-full h-full">
          <FormField
            control={control}
            name="imageUpload"
            render={() => (
              <FormItem className="flex flex-col justify-start items-start w-full h-full">
                <FormControl className="w-full h-full">
                  <div
                    className={`relative flex w-full h-full justify-center items-center bg-card ${
                      !isUploading && "hover:bg-muted"
                    }`}
                  >
                    <div className="absolute flex justify-center items-center w-full h-full">
                      {isUploading ? <ReloadIcon className="animate-spin w-6 h-6" /> : <Icons.image_icon />}
                    </div>
                    <input
                      className={`relative flex w-full h-full opacity-0 ${!isUploading && "cursor-pointer"}`}
                      accept="image/*"
                      type="file"
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
      {errorMessage && <p className="absolute p-4 bottom-0 text-center text-red-600 mt-2">{errorMessage}</p>}
    </div>
  );
}
