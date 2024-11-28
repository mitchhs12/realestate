import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { client, urlFor } from "@/lib/sanity";
import { getFullLanguageName } from "@/lib/utils";
import { ArticleType } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";
import Image from "next/image";
import { useState } from "react";
import Brochure from "@/components/Brochure";

export default async function AboutPageContent({ locale, data }: { locale: string; data: any }) {
  const t = await getScopedI18n("about");
  const mission = { title: t("mission.title"), content: t("mission.content") };
  const how = { title: t("how.title"), content: t("how.content") };
  const why = { title: t("why.title"), content: t("why.content") };
  const brochures = t("brochures");

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col justify-start items-center p-4 md:p-8 w-full h-full gap-16 max-w-8xl">
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">Our Team</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {data.map((person: { name: string; bio: string; image_url: string }) => {
              return (
                <div
                  key={person.name} // Add a unique key here
                  className="relative items-center justify-center h-[100px] w-[100px] transition-transform ease-in-out duration-200 hover:scale-110 hover:cursor-pointer"
                >
                  <Image
                    src={urlFor(person.image_url).url()}
                    alt="image"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                    placeholder="blur"
                    blurDataURL={
                      "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">{mission.title}</div>
          <div className="text-xl italic">{mission.content}</div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">{how.title}</div>
          <div className="text-lg">{how.content}</div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">{why.title}</div>
          <div className="text-lg">{why.content}</div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">{why.title}</div>
          <div className="text-lg">{why.content}</div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="text-3xl">{brochures}</div>
          <Brochure />
        </div>
      </div>
    </div>
  );
}
