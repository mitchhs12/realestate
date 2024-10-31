"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Textarea } from "@/components/ui/textarea";
import { HomeType } from "@/lib/validations";
import ReactQuill from "react-quill";
import "@/app/[locale]/quill.css"; // Import Quill styles

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  warning: string;
  placeholder: string;
}

export default function Description({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  warning,
  placeholder,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNewHome,
    setCurrentHome,
    setNextLoading,
    setPrevLoading,
    setNextDisabled,
  } = useContext(SellContext);
  const [description, setDescription] = useState<string>(currentHome?.description ? currentHome?.description : "");

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
    setNextDisabled(description.length === 0);
  }, []);

  useEffect(() => {
    if (currentHome && description.length > 0 && description.length < 3000) {
      setNextDisabled(false);
      setNewHome({ ...currentHome, description: description });
    } else {
      setNextDisabled(true);
    }
  }, [description]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
        </div>

        <div className="flex flex-col max-w-8xl h-auto w-full justify-center mt-10 shadow-lg dark:shadow-white rounded-xl">
          <ReactQuill
            value={description}
            theme={"snow"}
            placeholder={placeholder}
            className={`flex flex-col h-full max-w-8xl w-full overflow-auto text-sm rounded-t-xl placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${description.length === 3000 && "border-red-500"}`}
            onChange={(value: string) => {
              if (value.length <= 3000) {
                setDescription(value);
              }
            }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
            formats={["header", "font", "bold", "italic", "underline", "list"]}
          />
          <div className="flex justify-center text-sm min-h-12">
            {description.length === 3000 && <span className="text-red-500">{warning}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
