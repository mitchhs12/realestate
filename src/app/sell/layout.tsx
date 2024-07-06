import ProgressBar from "@/components/ProgressBar";
import { SellContextProvider } from "@/context/SellContext";

export default function SellFlowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SellContextProvider>
        <div className="flex flex-col h-screen-minus-header-svh justify-between w-full">
          <main className="flex-grow overflow-auto">{children}</main>
          <ProgressBar />
        </div>
      </SellContextProvider>
    </>
  );
}
