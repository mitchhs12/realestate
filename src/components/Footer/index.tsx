import { getScopedI18n } from "@/locales/server";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Icons from "@/components/Footer/Icons";

export default async function Footer() {
  const scopedT = await getScopedI18n("home.footer");

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col justify-center gap-4 items-center max-w-8xl">
        <div className="flex text-sm gap-6 justify-center">
          <Link href={"/"}>{scopedT("pages.home")}</Link>
          <Link href={"/about"}>{scopedT("pages.about")}</Link>
          <Link href={"/articles"}>{scopedT("pages.articles")}</Link>
          <Link href={"/data"}>{scopedT("pages.data")}</Link>
          <Link href={"/legal"}>{scopedT("legal.title")}</Link>
        </div>
      </div>
      <Icons />
      <h3 className="text-xs text-center">{scopedT("allRightsReserved")}</h3>
    </div>
  );
}
