import { Metadata } from "next";
import AdminPage from "./AdminPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  setStaticParamsLocale(locale);
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }
  if (user.role !== "admin") {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">You are not authorized to view this page</p>
      </main>
    );
  }
  return <AdminPage user={user} />;
}
