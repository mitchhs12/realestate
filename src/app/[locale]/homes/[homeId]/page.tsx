import { Metadata } from "next";
import HomePhotos from "@/components/HomePhotos";
import { getHomeById } from "@/app/[locale]/homes/actions";
import HomeText from "@/components/HomeText";
import Footer from "@/components/Footer";
import StickyPrice from "@/components/StickyPrice";
import MapComponent from "@/components/SmallMap";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Homes",
};
import getSession from "@/lib/getSession";

export default async function Page({ params }: { params: { homeId: string } }) {
  // const session = await getSession();
  // const user = session?.user;
  // if (!user) {
  //   try {
  //     return <LockedLogin />;
  //   } catch (error) {
  //     console.error("Failed to render LockedLogin component:", error);
  //     redirect("/api/auth/signin?callbackUrl=/sell");
  //   }
  // }

  const home = await getHomeById(params.homeId);

  if (home) {
    return (
      <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
        <main className="flex flex-col items-center justify-start max-w-7xl w-full">
          <div className="flex flex-col text-center h-full w-full pt-8 pb-2">
            <h1 className="flex justify-center text-3xl">{home.title}</h1>
            <HomePhotos home={home} />
          </div>
          <div className="flex flex-col text-center h-full w-full">
            <HomeText home={home} />
            <div className="py-6 px-8">
              <Separator />
            </div>
          </div>
          <div className="flex flex-col max-w-7xl w-full h-[40vh] px-8 py-2 gap-3 mb-16">
            <div className="text-lg sm:text-xl">Location:</div>
            <div className="flex w-full max-w-7xl h-[40vh]">
              <MapComponent
                coordinates={{ long: home.longitude, lat: home.latitude }}
                currentHome={home}
                disabled={true}
              />
            </div>
          </div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
        <div className="sticky sm:hidden bottom-0 bg-white w-full h-full text-center">
          <StickyPrice home={home} />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <main>
          <div className="flex justify-center text-xl">Something went wrong fetching this home.</div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    );
  }
}
