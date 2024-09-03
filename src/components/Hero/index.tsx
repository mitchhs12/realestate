import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import { poppins } from "@/app/[locale]/fonts";
import { getScopedI18n } from "@/locales/server";

export default async function Hero() {
  const scopedT = await getScopedI18n("home.hero");

  return (
    <div className="relative h-[20vh] flex w-full">
      <Image
        src="https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/banners/banner.avif"
        alt="background"
        fill={true}
        style={{ objectFit: "cover" }}
        quality={70}
        priority={true}
        sizes="(max-width: 400px) 400px,
        (max-width: 510px) 510px,
        (max-width: 768px) 768px, 
        (max-width: 1024px) 1024px, 
        (max-width: 1280px) 1280px, 
        (max-width: 1536px) 1536px,
        (max-width: 1920px) 1920px,
        100vw"
        className="-z-10 opacity-30 dark:opacity-20"
      />
      <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
        <div className="flex flex-col gap-y-4 w-full max-w-8xl p-8">
          <h1
            className={`${poppins.className} flex text-center justify-center text-xl md:text-3xl font-light tracking-wider`}
          >
            {scopedT("title")}
          </h1>
          <div className="flex justify-center items-center w-full">
            <SearchBox
              isSmallMap={false}
              text={scopedT("search.search-button")}
              placeholder={scopedT("search.placeholder")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
