import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import Home from "@/components/Home";
import { getHomeById } from "@/app/homes/actions";

export const metadata: Metadata = {
  title: "Homes",
};

export default async function Page({ params }: { params: { homeId: string } }) {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }

  const home = await getHomeById(params.homeId);

  if (home) {
    return (
      <main className="flex flex-col-reverse h-screen-minus-header-svh lg:flex-row justify-end ">
        <Home home={home} />
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
