import { Metadata } from "next";
import Capacity from "./Capacity";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";

export const metadata: Metadata = {
  title: "Capacity",
};

export default async function Page() {
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
  return <Capacity user={user} />;
}
