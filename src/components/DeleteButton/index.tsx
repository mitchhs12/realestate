import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import DeleteButtonContent from "./DeleteButtonContent";
import { deleteHome } from "@/app/[locale]/my-properties/actions";
import { useState } from "react";
import { I18nProviderClient } from "@/locales/client";

export default function DeleteButton({ homeId }: { homeId: number }) {
  const { defaultLanguage } = useContext(LocaleContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleHomeDelete = async (homeId: number) => {
    setIsDeleting(true);
    try {
      await deleteHome(homeId);
    } catch (error) {
      console.error("Failed to delete home:", error);
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"} disabled={isDeleting} className="absolute top-2 right-2">
          {isDeleting ? <ReloadIcon className="animate-spin w-5 h-5" /> : <Trash size={20} />}
        </Button>
      </AlertDialogTrigger>
      <I18nProviderClient locale={defaultLanguage}>
        <DeleteButtonContent homeId={homeId} handleHomeDelete={handleHomeDelete} />
      </I18nProviderClient>
    </AlertDialog>
  );
}
