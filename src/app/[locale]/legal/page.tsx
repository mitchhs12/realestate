import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getScopedI18n } from "@/locales/server";
import { Handshake, Lock } from "lucide-react";

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("home.footer.legal");

  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-white dark:bg-black">
      <div className="flex flex-col space-y-8 pt-8 pb-16 justify-start items-center h-full">
        <div className="flex gap-10 justify-between w-full">
          <Button asChild variant={"outline"}>
            <Link href="/legal/terms-and-conditions">
              <div className="flex w-full h-full justify-center items-center gap-2">
                <div className="flex justify-center items-center">
                  <Handshake size={18} strokeWidth={1.3} />
                </div>
                <h2 className="flex justify-center items-center text-sm md:text-md lg:text-lg xl:text-lg font-light">
                  {t("terms")}
                </h2>
              </div>
            </Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link href="/legal/privacy-policy">
              <div className="flex w-full h-full justify-center items-center gap-2">
                <div className="flex justify-center items-center">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <h2 className="flex justify-center items-center text-sm md:text-md lg:text-lg xl:text-lg font-light">
                  {t("privacy")}
                </h2>
              </div>
            </Link>
          </Button>
        </div>
        <p>
          Vectors and icons by{" "}
          <a href="https://www.figma.com/@karthik_shyam?ref=svgrepo.com" target="_blank">
            Karthik Shyam
          </a>{" "}
          in CC Attribution License via{" "}
          <a href="https://www.svgrepo.com/" target="_blank">
            SVG Repo
          </a>
        </p>
      </div>
    </div>
  );
}
