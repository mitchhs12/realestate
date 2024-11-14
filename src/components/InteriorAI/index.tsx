"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  imageUrl: string;
  generatedImages: {};
  setGeneratedImages: any;
  toggleImage: any;
}

export default function InteriorAI({ imageUrl, generatedImages, setGeneratedImages, toggleImage }: Props) {
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function callRedesign() {
    setStatus("pending");
    const result = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: `${imageUrl}`,
        room: "Living Room",
        theme: "Minimalist",
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
              console.log("setting prediction");
              const updatedImages = {
                ...generatedImages,
                [imageUrl]: prediction.output[1], // Use [imageUrl] to dynamically set the key
              };
              setGeneratedImages(updatedImages);
              setStatus("succeeded");
              toggleImage(imageUrl);
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

  return (
    <div>
      <Button
        variant="default"
        className="flex justify-center items-center gap-3"
        onClick={callRedesign}
        disabled={status === "pending"}
      >
        <span className="flex justify-center items-center gap-3">
          {status === "failed" ? (
            <span className="flex flex-col justify-center items-center">
              <p>Failed to generate design!</p>
              <p>{error}</p>
            </span>
          ) : status === "pending" ? (
            <span className="flex justify-center items-center gap-3">
              <ReloadIcon className="w-6 h-6 animate-spin" /> <p>Generating design...</p>
            </span>
          ) : (
            <span className="flex justify-center items-center gap-3">
              <Sparkles size={20} />
              <p>AI Redesign</p>
            </span>
          )}
        </span>
      </Button>
    </div>
  );
}
