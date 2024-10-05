import Footer from "@/components/Footer";

export default async function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col h-full items-center w-full">
        <main className="flex-grow w-full h-screen-minus-header-svh">{children}</main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    </>
  );
}
