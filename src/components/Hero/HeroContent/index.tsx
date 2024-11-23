import SearchBox from "@/components/SearchBox";
import { poppins, urbanist } from "@/app/[locale]/fonts";
import { getScopedI18n } from "@/locales/server";
import { laurel } from "@/components/Icons/laurel";

export default async function HeroContent() {
  const scopedT = await getScopedI18n("home.hero");
  return (
    <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
      <div className="flex flex-col items-center gap-y-12 w-full max-w-8xl p-2 px-4 sm:p-4 md:px-6">
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
  );
}
