import { getScopedI18n } from "@/locales/server";
import Link from "next/link";
import Icons from "@/components/Footer/Icons";

export default async function Footer() {
  const scopedT = await getScopedI18n("home.footer");

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col justify-center gap-4 items-center max-w-8xl">
        <div className="grid grid-cols-3 xs:grid-cols-6 text-xs xs:text-sm gap-6 iteems-center text-center justify-center">
          <Link href={"/"}>{scopedT("pages.home")}</Link>
          <Link href={"/about"}>{scopedT("pages.about")}</Link>
          <Link href={"/explore"}>{scopedT("pages.explore")}</Link>
          <Link href={"/articles"}>{scopedT("pages.articles")}</Link>
          <Link href={"/pricing"}>{scopedT("pages.pricing")}</Link>
          <Link href={"/data"}>{scopedT("pages.data")}</Link>
        </div>
        <div className="flex flex-col xs:flex-row text-xs xs:text-sm xs:gap-6 justify-center items-center text-center">
          <Link href={"/legal"}>{scopedT("legal.title")}</Link>
          <div className="flex flex-col xs:flex-row xs:gap-6 justify-center">
            <Link href={"/legal/terms-and-conditions"}>{scopedT("legal.terms")}</Link>
            <Link href={"/legal/privacy-policy"}>{scopedT("legal.privacy")}</Link>
          </div>
        </div>
      </div>
      <Icons />
      <h3 className="text-xs text-center">{scopedT("allRightsReserved")}</h3>
    </div>
  );
}
