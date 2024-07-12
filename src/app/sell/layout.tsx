import ProgressBar from "@/components/ProgressBar";
import { SellContextProvider } from "@/context/SellContext";
import { getUnfinishedHome } from "./actions";

export default async function SellFlowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
