import Footer from "@/components/Footer";

export default async function DataLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col h-screen-minus-header-svh items-center w-full">
        <main className="flex-grow w-full">{children}</main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    </>
  );
}
