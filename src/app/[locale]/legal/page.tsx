import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-white dark:bg-black">
      <div className="flex flex-col space-y-8 pt-8 pb-16 justify-start items-center h-full">
        <div className="flex gap-10 justify-between w-full">
          <Link href="/legal/terms-and-conditions">
            <h2 className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light">
              {"Terms of Service"}
            </h2>
          </Link>
          <Link href="/legal/privacy-policy">
            <h2 className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light">
              {"Privacy Policy"}
            </h2>
          </Link>
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
