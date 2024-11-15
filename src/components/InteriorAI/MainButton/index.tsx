"use client";

import { useState, useContext } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AIContent from "@/components/InteriorAI/Content";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";

interface Props {
  imageUrl: string;
}

export default function InteriorAI({ imageUrl }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { defaultLanguage } = useContext(LocaleContext);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger>
        <Button
          variant="default"
          className="flex justify-center items-center gap-3 bg-purple-600 hover:bg-purple-600/90"
        >
          <span className="flex justify-center items-center gap-3">
            <Sparkles size={20} />
            <p>Redesign</p>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col justify-start items-center w-full h-full max-w-[90%] max-h-[85%] px-0 pb-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <I18nProviderClient locale={defaultLanguage}>
          <AIContent imageUrl={imageUrl} />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
