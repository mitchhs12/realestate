import SearchBox from "@/components/SearchBox";
import { poppins } from "@/app/[locale]/fonts";
import { getScopedI18n } from "@/locales/server";

export default async function HeroContent() {
  const scopedT = await getScopedI18n("home.hero");
  return (
    <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
      <div className="flex flex-col items-center gap-y-4 w-full max-w-8xl p-5">
        <h1
          className={`${poppins.className} flex text-center justify-center text-lg sm:text-xl md:text-2xl font-light tracking-wider`}
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
