import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Handshake, Lock } from "lucide-react";
import { getScopedI18n } from "@/locales/server";

export default async function LegalContent() {
  const t = await getScopedI18n("home.footer.legal");
  const l = await getScopedI18n("legal");

  return (
    <div className="flex flex-col gap-y-12 px-4 md:px-6 justify-start items-center">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-semibold text-2xl text-center sm:text-start">{l("documents")}</h3>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between gap-4">
          <Button asChild variant={"outline"} className="w-full max-w-[80%]">
            <Link href="/legal/terms-and-conditions">
              <div className="flex h-full justify-center items-center gap-3">
                <div className="flex justify-center items-center">
                  <Handshake size={18} strokeWidth={1.8} />
                </div>
                <h2 className="flex justify-center items-center">{t("terms")}</h2>
              </div>
            </Link>
          </Button>
          <Button asChild variant={"outline"} className="w-full max-w-[80%]">
            <Link href="/legal/privacy-policy">
              <div className="flex h-full justify-center items-center gap-3">
                <div className="flex justify-center items-center">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <h2 className="flex justify-center items-center">{t("privacy")}</h2>
              </div>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center sm:items-start">
        <h3 className="text-semibold text-2xl text-center sm:text-start">{l("images")}</h3>
        <p className="text-center max-w-[80%] sm:max-w-[100%]">
          Real Estate Icons by{" "}
          <a href="https://www.figma.com/@karthik_shyam?ref=svgrepo.com" target="_blank">
            Karthik Shyam
          </a>{" "}
          in CC Attribution License via{" "}
          <a href="https://www.svgrepo.com/" target="_blank">
            SVG Repo.
          </a>
        </p>
      </div>
    </div>
  );
}
