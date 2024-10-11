import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

import { useScopedI18n } from "@/locales/client";

interface Props {
  homeId: number;
  handleHomeDelete: (homeId: number) => void;
}

export default function DeleteButtonContent({ homeId, handleHomeDelete }: Props) {
  const t = useScopedI18n("my-properties");

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t("deleteWarning")}</AlertDialogTitle>
        <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{t("deleteCancel")}</AlertDialogCancel>
        <AlertDialogAction
          variant={"destructive"}
          onClick={() => {
            handleHomeDelete(homeId);
          }}
        >
          {t("deleteConfirm")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
