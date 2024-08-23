import { Metadata } from "next";
import HomePhotos from "@/components/HomePhotos";
import { getHomeById } from "@/app/[locale]/homes/actions";

export const metadata: Metadata = {
  title: "Homes",
};

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
      <main className="flex flex-col md:justify-center min-h-screen-minus-header-svh md:flex-row">
        <div className="flex flex-col text-center border-2 h-full max-w-7xl w-full pt-8">
          <h1 className="flex justify-center text-3xl">{home.title}</h1>
          <HomePhotos home={home} />
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <div className="flex justify-center text-xl">Something went wrong fetching this home.</div>
      </main>
    );
  }
}
