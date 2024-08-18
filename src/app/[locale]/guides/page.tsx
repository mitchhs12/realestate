import GuideSelection from "@/components/GuideSelection";
import Image from "next/image";
import { poppins } from "@/app/[locale]/fonts";
import { sellGuides } from "@/lib/validations";
import { buyGuides } from "@/lib/validations";
import { setStaticParamsLocale } from "next-international/server";

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col h-full w-full border-2 items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src="https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/banners/banner4.avif"
          alt="background"
          fill={true}
          style={{ objectFit: "cover" }}
          quality={80}
          priority={true}
          className="-z-10 opacity-30 dark:opacity-20"
        />
        <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
          <div className="flex flex-col gap-y-4">
            <h1
              className={`${poppins.className} flex text-center justify-center text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light tracking-wider`}
            >
              How to Buy and Sell
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center border-2 w-full flex-grow">
        <div className="flex flex-row w-full h-full justify-between p-8 items-center border-2 max-w-7xl">
          <GuideSelection type={"buy"} guides={buyGuides} />
          <GuideSelection type={"sell"} guides={sellGuides} />
        </div>
      </div>
    </div>
  );
}
