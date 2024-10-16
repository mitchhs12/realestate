import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeContext } from "@/context/HomeContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import Description from "@/app/[locale]/homes/[homeId]/edit/description";

export default function DescriptionDialog() {
  const { description } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);
  const quillRef = useRef<ReactQuill | null>(null);
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  return (
    <Dialog open={isDescriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
      <DialogTrigger>
        <div className="text-base hover:cursor-pointer border-2 p-2 border-primary animate-pulse rounded-md bg-primary/10">
          <ReactQuill
            ref={quillRef}
            theme={"snow"}
            readOnly={true}
            value={description!}
            modules={{ toolbar: false }} // Disable the toolbar
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl h-[80%] overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Description />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
