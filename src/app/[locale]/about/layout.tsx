import Footer from "@/components/Footer";

export default async function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <main className="flex-grow w-full h-full min-h-screen-minus-header-svh max-w-8xl">{children}</main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    </>
  );
}
