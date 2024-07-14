"use client";
import { User } from "next-auth";
import { useContext, useEffect } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormField, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

const formSchema = z.object({
  photos: z.array(z.instanceof(File)).min(5, { message: "You must upload at least 5 photos" }),
});

export default function Photos({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading } = useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photos: Array(5).fill(null), // Ensure at least 5 fields are available initially
    },
  });

  const { fields, append, replace } = useFieldArray({
    control: form.control,
    name: "photos",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    values.photos.forEach((photo) => {
      if (photo) {
        formData.append("files", photo);
      }
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Files uploaded successfully");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleFileChange = (index: number, fileList: FileList) => {
    const files = Array.from(fileList);
    const newPhotos = [...form.getValues("photos")];
    newPhotos[index] = files[0];
    replace(newPhotos);
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col w-full h-full justify-start items-center text-center gap-y-20">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Photos</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">What does your property look like?</h3>
          </div>
        </div>
        <div className="flex flex-col w-1/8 gap-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                const transformedData = {
                  ...data,
                  photos: data.photos.filter(Boolean), // Filter out null values
                };
                onSubmit(transformedData);
              })}
              className="space-y-8"
            >
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`photos.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor={`photo-${index}`} className="flex justify-start px-4">
                        Photo {index + 1}
                      </Label>
                      <FormControl>
                        <Input
                          id={`photo-${index}`}
                          type="file"
                          onChange={(e) => handleFileChange(index, e.target.files)}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value && (
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt={`Photo ${index + 1}`}
                            className="w-32 h-32"
                          />
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" onClick={() => append(null)}>
                Add More Photos
              </Button>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
