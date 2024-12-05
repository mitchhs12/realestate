import Footer from "@/components/Footer";

export default async function Searchlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <main className="w-full h-screen-minus-header-double-svh">{children}</main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    </>
  );
}
