import GuideSelection from "@/components/GuideSelection";
import Image from "next/image";
import { poppins } from "@/app/[locale]/fonts";
import { sellGuides } from "@/lib/validations";
import { buyGuides } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { client, urlFor } from "@/lib/sanity";
import { BlogType } from "@/lib/validations";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getData() {
  const query = `
  *[_type=="article"] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  const data: BlogType[] = await getData();

  const scopedT = await getScopedI18n("articles");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-full justify-start p-8 items-start max-w-8xl">
          {data.map((blog, idx) => (
            <Card key={idx} className="flex flex-col items-center shadow-xl">
              <div className="flex items-center justify-center min-h-[10vh] p-6 w-full h-[20vh]">
                <Image
                  src={urlFor(blog.titleImage).url()}
                  alt="image"
                  width={300}
                  height={300}
                  className="rounded-lg object-fit"
                />
              </div>

              <CardContent className="mt-5">
                <h3 className="text-primary text-lg line-clamp-2 font-bold">{blog.title}</h3>
                <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300 pose">
                  {blog.smallDescription}
                </p>
                <Button asChild className="w-full mt-7">
                  <Link href={`/articles/${blog.currentSlug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
