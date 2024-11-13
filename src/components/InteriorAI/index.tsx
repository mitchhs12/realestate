"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InteriorAI({ imageUrl }: { imageUrl: string }) {
  async function callRedesign() {
    const result = await fetch("/api/aiDesign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: `${imageUrl}`,
        room: "Living Room",
        theme: "Modern",
      }),
    });
    const data = await result.json();
    console.log(data);
  }

  return (
    <Button variant={"default"} className="flex justify-center items-center gap-3" onClick={callRedesign}>
      <Sparkles size={20} />
      AI Redesign
    </Button>
  );
}
