import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getMyHomes } from "./actions";
import MyHomes from "./MyHomes";

export const metadata: Metadata = {
  title: "My Properties",
};

export default async function Page({ params: { locale } }: any) {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin locale={locale} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/");
    }
  } else if (user && user.id) {
    const myHomes = await getMyHomes(user.id);

    return (
      <div className="flex flex-col items-center h-full">
        <MyHomes myHomes={myHomes} />
      </div>
    );
  }
}
