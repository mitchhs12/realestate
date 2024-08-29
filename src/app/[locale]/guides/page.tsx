import GuideSelection from "@/components/GuideSelection";
import Image from "next/image";
import { poppins } from "@/app/[locale]/fonts";
import { sellGuides } from "@/lib/validations";
import { buyGuides } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  const scopedT = await getScopedI18n("guides");
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src="https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/banners/banner4.avif"
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
          <div className="flex flex-col gap-y-4">
            <h1
              className={`${poppins.className} flex text-center justify-center text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light tracking-wider`}
            >
              {scopedT("title")}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full flex-grow">
        <div className="flex flex-row w-full h-full justify-between p-8 items-center max-w-7xl">
          <GuideSelection type={"buy"} guides={buyGuides} />
          <GuideSelection type={"sell"} guides={sellGuides} />
        </div>
      </div>
    </div>
  );
}
