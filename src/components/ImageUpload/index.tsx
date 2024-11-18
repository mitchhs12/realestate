import { useState, useContext } from "react";
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
}

export default function ImageUpload({
  filePath,
  onlyImagesError,
  tooNarrowError,
  tooShortError,
  fileSizeError,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
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
    } catch (error: any) {
      setErrorMessage(error.message || "Error processing files");
      setIsUploading(false);
      return;
    }

    try {
      // Validate the file
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

      await uploadAIPhoto(formData, filePath);
    } catch (error: any) {
      console.error("Error during file processing:", error);
      setErrorMessage(error.message || "Error uploading the file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
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
                    } `}
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
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </div>
  );
}
