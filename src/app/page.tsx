import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <div className="flex flex-col justify-between h-screen-minus-header-svh items-center">
      <main className="w-full">
        <Hero />
      </main>
      <h1 className="flex flex-col justify-center items-center gap-y-3 text-center">
        <span className="text-md md:text-2xl">This site is under construction.</span>
        <span className="text-md md:text-lg">Please create an account, and we'll email you when it's ready.</span>
      </h1>
      <footer className="flex justify-center items-center p-6 w-full bg-muted">
        <Footer />
      </footer>
    </div>
  );
}
