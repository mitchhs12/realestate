import SearchBox from "@/components/SearchBox";
import { urbanist } from "@/app/[locale]/fonts";
import { getScopedI18n } from "@/locales/server";
import { Star } from "lucide-react";
import { laurel } from "@/components/Icons/laurel";

export default async function HeroContent() {
  const scopedT = await getScopedI18n("home.hero");
  const LeftLeaf = laurel.left; // Get the corresponding icon
  const RightLeaf = laurel.right; // Get the corresponding icon

  return (
    <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
      <div className="flex flex-col items-center justify-between pt-8 pb-14 h-full w-full max-w-8xl px-4 md:px-6">
        <div className="flex gap-4">
          <div className="flex justify-center items-center w-[40px] h-full">
            <LeftLeaf className="text-[#4F4F4F] dark:text-white" />
          </div>
          <div className="flex flex-col justify-center items-center text-center gap-1">
            <text
              className={`${urbanist.className} text-[#4F4F4F] dark:text-white text-md sm:text-lg text-nowrap font-bold`}
            >
              {scopedT("laurel")}
            </text>
            <div className="flex gap-3 justify-center pb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-[#4F4F4F] fill-[#4F4F4F] dark:fill-white dark:text-white" />
              ))}
            </div>
            <text className="text-[#4F4F4F] dark:text-white text-sm sm:text-md font-semibold">{scopedT("year")}</text>
          </div>
          <div className="flex justify-center items-center w-[40px] h-full">
            <RightLeaf className="text-[#4F4F4F] dark:text-white" />
          </div>
        </div>
        <div className="flex justify-center items-center w-full max-w-6xl">
          <SearchBox
            isSmallMap={false}
            text={scopedT("search.search-button")}
            placeholder={scopedT("search.placeholder")}
            placeholderShort={scopedT("search.placeholderShort")}
          />
        </div>
      </div>
    </div>
  );
}
