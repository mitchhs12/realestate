import { Metadata } from "next";
import AdminPage from "./AdminPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }
  return <AdminPage />;
}
