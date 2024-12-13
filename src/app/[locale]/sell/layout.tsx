import ProgressBar from "@/components/ProgressBar";
import { SellContextProvider } from "@/context/SellContext";
import { LanguageType } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LanguageType }>;
};
export default async function SellFlowLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const t = await getScopedI18n("sell.progress");
  const cont = t("continue");
  const start = t("start");
  const back = t("back");
  const next = t("next");
  const finish = t("finish");
  const loading = t("loading");

  return (
    <>
      <SellContextProvider>
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
          <ProgressBar cont={cont} start={start} back={back} next={next} finish={finish} loading={loading} />
        </div>
      </SellContextProvider>
    </>
  );
}
