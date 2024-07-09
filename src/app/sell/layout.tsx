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
        <div className="flex flex-col h-screen-minus-header-svh justify-between w-full">
          <main className="flex-grow overflow-auto">{children}</main>
          <ProgressBar />
        </div>
      </SellContextProvider>
    </>
  );
}
