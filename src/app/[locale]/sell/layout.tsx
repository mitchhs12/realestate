import ProgressBar from "@/components/ProgressBar";
import { SellContextProvider } from "@/context/SellContext";
import { getUnfinishedHome } from "./actions";
import { LanguageType } from "@/lib/validations";

type Props = {
  children: React.ReactNode;
  params: { locale: LanguageType };
};

export default async function SellFlowLayout({ children, params: { locale } }: Readonly<Props>) {
  const unfinishedHome = await getUnfinishedHome();

  return (
    <>
      <SellContextProvider unfinishedHome={unfinishedHome}>
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
          <ProgressBar />
        </div>
      </SellContextProvider>
    </>
  );
}
