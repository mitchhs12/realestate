import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getFlagEmoji } from "@/lib/utils";
import Link from "next/link";
import lookup from "country-code-lookup";
import { Separator } from "@/components/ui/separator";

function convertToUrlSlug(countryName: string) {
  return countryName.toLowerCase().replace(/\s+/g, "-");
}

export default function GuideSelection({ type, guides }: { type: "buy" | "sell"; guides: string[] }) {
  return (
    <div className="flex flex-col w-1/2 h-full items-center">
      <div className="flex w-full items-center justify-center gap-x-3">
        <h3 className="hidden md:flex text-md lg:text-lg font-semibold text-nowrap">
          I don&apos;t know how to {type[0].toUpperCase().concat(type.slice(1))}
        </h3>
        <h3 className="md:hidden text-md lg:text-lg font-semibold">
          How to {type[0].toUpperCase().concat(type.slice(1))}
        </h3>
        <div className="hidden sm:flex">
          <Icons.sell_guide width={"40"} height={"40"} />
        </div>
      </div>
      <Separator className="w-[90%]" />
      <ul className="flex flex-col gap-y-6 pt-3 w-full">
        {guides.map((countryName) => {
          const countryInfo = lookup.byCountry(countryName);

          return (
            <li key={countryName} className="flex flex-col justify-start w-full">
              <Link href={`guides/${convertToUrlSlug(countryName)}`}>
                <Button variant={"link"} className="w-full">
                  <div className="flex items-center w-full gap-x-3">
                    {countryInfo && (
                      <>
                        <span className="">{getFlagEmoji(countryInfo.iso2)}</span>
                        <span className="flex text-xs text-wrap text-start">
                          How to {type} in {countryName}
                        </span>
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
