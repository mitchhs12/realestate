import { Metadata } from "next";
import HomePhotos from "@/components/HomePhotos";
import { getHomeById } from "@/app/[locale]/homes/actions";
import HomeText from "@/components/HomeText";
import Footer from "@/components/Footer";
import StickyPrice from "@/components/StickyPrice";

export const metadata: Metadata = {
  title: "Homes",
};
import getSession from "@/lib/getSession";

export default async function Page({ params }: { params: { homeId: string } }) {
  const session = await getSession();
  const user = session?.user;

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
        <main className="flex flex-col items-center justify-start">
          <div className="flex flex-col text-center h-full max-w-7xl w-full pt-8">
            <h1 className="flex justify-center text-3xl">{home.title}</h1>
            <HomePhotos home={home} />
          </div>
          <div className="flex flex-col text-center h-full max-w-7xl w-full">
            <HomeText home={home} user={user} />
          </div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
        <div className="sticky sm:hidden bottom-0 bg-white w-full h-full text-center">
          {<StickyPrice home={home} user={user} />}
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
