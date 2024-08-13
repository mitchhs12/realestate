import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Listings from "@/components/Listings";
import Locations from "@/components/Locations";

export default async function Home() {
  return (
    <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
      <main className="w-full">
        <Hero />
      </main>
      <div className="flex flex-col justify-start h-full w-full">
        <section className="flex flex-col justify-center items-center w-full h-full bg-white dark:bg-black">
          <div className="flex flex-col space-y-8 pt-8 pb-12 justify-start h-full px-2">
            <h2 className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light">
              {"Recommended City Destricts"}
            </h2>
            <Locations />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col space-y-8 pt-8 pb-12 justify-start h-full px-2">
            <h2 className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light ">
              {"Featured Listings"}
            </h2>
            <Listings type={"featured"} />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-white dark:bg-black">
          <div className="flex flex-col space-y-8 pt-8 pb-12 justify-start h-full px-2">
            <h2 className="flex justify-center text-sm md:text-md lg:text-lg xl:text-lg font-light">
              {"Recent Listings"}
            </h2>
            <Listings type={"new"} />
          </div>
        </section>
      </div>

      <footer className="flex justify-center items-center p-6 w-full bg-muted">
        <Footer />
      </footer>
    </div>
  );
}
