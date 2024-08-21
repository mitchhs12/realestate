import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getFlagEmoji } from "@/lib/utils";
import Link from "next/link";
import lookup from "country-code-lookup";
import { Separator } from "@/components/ui/separator";
import { getScopedI18n } from "@/locales/server";
import { LanguageType } from "@/lib/validations";

function convertToUrlSlug(countryName: string) {
  return countryName.toLowerCase().replace(/\s+/g, "-");
}

export default async function GuideSelection({ type, guides }: { type: "buy" | "sell"; guides: string[] }) {
  const scopedT = await getScopedI18n(`guides.${type}`);

  return (
    <div className="flex flex-col w-1/2 h-full items-center">
      <div className="flex w-full items-center justify-center gap-x-3">
        <h3 className="hidden md:flex text-sm lg:text-lg font-semibold text-nowrap">{scopedT("title")}</h3>
        <h3 className="md:hidden text-sm md:text-md lg:text-lg font-semibold">{scopedT("title-short")}</h3>
        <div className="hidden sm:hidden sm:dark:flex">
          {type === "sell" ? (
            <Icons.sell_guide_dark width={"40"} height={"40"} />
          ) : (
            <Icons.buy_guide_dark width={"40"} height={"40"} />
          )}
        </div>
        <div className="hidden sm:flex sm:dark:hidden">
          {type === "sell" ? (
            <Icons.sell_guide width={"40"} height={"40"} />
          ) : (
            <Icons.buy_guide width={"40"} height={"40"} />
          )}
        </div>
      </div>
      <Separator className="w-[90%]" />
      <ul className="flex flex-col gap-y-6 pt-3 w-full">
        {guides.map((countryName) => {
          const countryInfo = lookup.byCountry(countryName);
          const iso2 = countryInfo?.iso2.toLowerCase() as LanguageType;
          return (
            <li key={countryName} className="flex flex-col justify-start w-full">
              <Link href={`guides/${convertToUrlSlug(countryName)}`}>
                <Button variant={"link"} className="w-full">
                  <div className="flex items-center w-full gap-x-3">
                    {countryInfo && countryInfo.iso2 && (
                      <>
                        <span className="">{getFlagEmoji(countryInfo.iso2)}</span>
                        <span className="flex text-xs text-wrap text-start">{scopedT(`countries.${iso2}` as any)}</span>
                      </>
                    )}
                  </div>
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
