"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormField, FormControl, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icons } from "@/components/icons";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Photos({ sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const placeholderFiles = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    name: `Placeholder ${index + 1}`,
  }));

  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome } =
    useContext(SellContext);
  // initialize array with 5 files
  const [selectedFiles, setSelectedFiles] = useState(placeholderFiles);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
    console.log(JSON.stringify(currentHome, null, 2));
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleFileChange = (index: any, files: any) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = files[0];
    setSelectedFiles(newSelectedFiles);
  };

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-10">
      <div className="flex flex-col w-full h-full justify-start items-center text-center gap-y-10">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Photos</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">What does your property look like?</h3>
          </div>
        </div>
        <div className="flex gap-4 p-4 w-full h-full justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-start space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem className="flex flex-col justify-start items-start">
                    <FormControl>
                      <div className="relative flex w-full h-[300px] justify-center items-center bg-card hover:bg-muted border-2">
                        <div className="absolute flex justify-center items-center w-full h-full">
                          <Icons.image_icon />
                        </div>
                        <input
                          className="relative flex w-full h-full opacity-0 cursor-pointer"
                          accept="images/*"
                          type="file"
                          multiple
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
