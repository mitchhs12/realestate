import ProgressBar from "@/components/ProgressBar";
import { SellContextProvider } from "@/context/SellContext";
import { getUnfinishedHome } from "./actions";
import { LanguageType } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";
import { headers } from "next/headers";

type Props = {
  children: React.ReactNode;
  params: { locale: LanguageType };
};

export default async function SellFlowLayout({ children, params: { locale } }: Readonly<Props>) {
  const t = await getScopedI18n("sell.progress");
  const cont = t("continue");
  const start = t("start");
  const back = t("back");
  const next = t("next");
  const finish = t("finish");
  const loading = t("loading");
  const unfinishedHome = await getUnfinishedHome();

  return (
    <>
      <SellContextProvider>
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
          <ProgressBar
            unfinishedHome={unfinishedHome}
            cont={cont}
            start={start}
            back={back}
            next={next}
            finish={finish}
            loading={loading}
          />
        </div>
      </SellContextProvider>
    </>
  );
}
