import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <div className="flex flex-col justify-between h-screen-minus-header items-center">
      <main className="w-full">
        <Hero />
      </main>
      <footer className="flex justify-center items-center p-6 w-full bg-muted">
        <Footer />
      </footer>
    </div>
  );
}
