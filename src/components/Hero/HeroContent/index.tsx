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
      <div className="flex flex-col gap-8 items-center justify-between pt-6 pb-12 h-full w-full max-w-8xl px-4 md:px-6">
        <div className="flex gap-5">
          <div className="flex justify-center items-center w-[40px] h-full">
            <LeftLeaf className="text-[#4F4F4F] dark:text-white" />
          </div>
          <div className="flex flex-col justify-center items-center text-center gap-1">
            <text
              className={`${urbanist.className} text-[#4F4F4F] dark:text-white text-md sm:text-lg text-nowrap font-bold`}
            >
              #1 Property App
            </text>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  color="currentColor"
                  fill="currentColor"
                  className="text-[#4F4F4F] dark:text-white"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center w-[40px] h-full">
            <RightLeaf className="text-[#4F4F4F] dark:text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full items-center">
          <h1
            className={`${urbanist.className} flex text-center font-semibold tracking-wider text-[#4F4F4F] dark:text-white justify-center text-xl xs:text-2xl sm:text-3xl lg:text-4xl`}
          >
            {scopedT("title")}
          </h1>
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
    </div>
  );
}
