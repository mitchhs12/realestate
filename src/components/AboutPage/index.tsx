"use client";
import { urlFor } from "@/lib/sanity";
import { getScopedI18n } from "@/locales/server";
import Image from "next/image";
import Brochure from "@/components/Brochure";
import { Send, Blend, Handshake, HandCoins, Accessibility } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { urbanist } from "@/app/[locale]/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPageContent({
  locale,
  data,
  contact,
  team,
  mission,
  how,
  values,
  brochures,
  latam,
}: {
  locale: string;
  data: any;
  contact: string;
  team: { title: string; sub: string };
  mission: { title: string; content: string };
  how: { title: string; content: string };
  values: { title: string; trust: string; transparency: string; accessibility: string; affordability: string };
  brochures: { title: string; sub: string };
  latam: { title: string; sub: string; content: { title: string; body: string }[] };
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col justify-start items-center w-full h-full gap-20">
        <div className="flex flex-col md:flex-row gap-16 pb-8 w-full">
          <div className="flex flex-col gap-3 w-full">
            <div
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {values.title}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex gap-3 items-center sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
                <Handshake strokeWidth={2} />
                {values.trust}
              </div>
              <div className="flex gap-3 items-center sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
                <Blend strokeWidth={2} />
                {values.transparency}
              </div>
              <div className="flex gap-3 items-center sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
                <Accessibility strokeWidth={2} />
                {values.accessibility}
              </div>
              <div className="flex gap-3 items-center sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
                <HandCoins strokeWidth={2} />
                {values.affordability}
              </div>
            </div>
          </div>
          <div className="flex-col gap-3 w-full">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {mission.title}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {mission.content}
            </h2>
          </div>
          <div className="flex-col gap-3 w-full">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {how.title}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-lg text-xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {how.content}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-20 pb-8 w-full">
          <div className="flex w-full flex-col gap-3 items-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {team.sub}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {team.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-8 justify-items-center">
            {data.map((person: { name: string; bio: string; jobTitle: string; image_url: string; email: string }) => {
              return (
                <Dialog key={person.name}>
                  <DialogTrigger>
                    <div className="flex flex-col items-center justify-start gap-3 h-full">
                      <div
                        key={person.name} // Add a unique key here
                        className="relative items-center justify-start h-[140px] w-[140px]  transition-transform ease-in-out duration-200 hover:scale-110 hover:cursor-pointer"
                      >
                        <Image
                          src={urlFor(person.image_url).url()}
                          alt="image"
                          fill={true}
                          style={{ objectFit: "cover" }}
                          className="rounded-xl"
                          placeholder="blur"
                          blurDataURL={
                            "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium text-lg">{person.name.split(" ")[0]}</div>
                        <div className="text-md">{person.jobTitle}</div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="flex flex-col justify-center items-center w-[90%]"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-center">{person.name}</DialogTitle>
                      <DialogDescription className="text-center">{person.bio}</DialogDescription>
                      <DialogClose asChild></DialogClose>
                    </DialogHeader>
                    <div className="relative items-center justify-center h-[500px] w-full">
                      <Image
                        src={urlFor(person.image_url).url()}
                        alt="image"
                        fill={true}
                        style={{ objectFit: "cover" }}
                        className="rounded-2xl"
                        placeholder="blur"
                        blurDataURL={
                          "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                        }
                      />
                    </div>
                    <div className="flex w-full justify-center items-center">
                      <Button asChild className="flex w-full gap-3 items-center">
                        <Link href={`mailto:${person.email}`}>
                          <Send />
                          {contact}
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-20 pb-8 w-full items-center text-center">
          <div className="flex w-full flex-col gap-3 items-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {latam.sub}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {latam.title}
            </h2>
          </div>
          <div className="relative h-[1500px] w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/latam.png`}
              alt="about"
              fill={true}
              style={{ objectFit: "cover" }}
              loading={"eager"}
              quality={70}
              priority={true}
              placeholder="blur"
              className="rounded-3xl opacity-30"
              blurDataURL={
                "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
              }
              sizes="(max-width: 400px) 400px,
        (max-width: 510px) 510px,
        (max-width: 768px) 768px, 
        (max-width: 970px) 970px"
            />
            {/* Vertical Dotted Line */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-full border-l-8 border-dashed border-primary"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
              }}
            ></div>
            {/* Alternating Text */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
              {latam.content.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-center items-center px-4 py-8 ${
                    idx % 2 === 0
                      ? "md:justify-end md:pl-16 md:pr-4 md:text-left"
                      : "md:justify-start md:pr-16 md:pl-4 md:text-right"
                  }`}
                >
                  <div className="w-full md:w-1/2 bg-card p-4 rounded-lg shadow-lg">
                    <h3
                      className={`${urbanist.className} tracking-widest font-bold text-lg md:text-2xl text-[#4F4F4F] dark:text-white`}
                    >
                      {item.title}
                    </h3>
                    <h2 className="text-sm md:text-lg font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
                      {item.body}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-16 pb-8 w-full items-center text-center">
          <div className="flex w-full flex-col gap-3 items-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {brochures.sub}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {brochures.title}
            </h2>
          </div>
          <Brochure />
        </div>
      </div>
    </div>
  );
}
