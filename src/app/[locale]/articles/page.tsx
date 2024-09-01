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

export const revalidate = 30;

async function getData() {
  const query = `
  *[_type=="article"] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      thumbnailImage,
      _createdAt
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
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-full gap-4 justify-start p-8 items-start max-w-8xl">
          {data.map((blog, idx) => (
            <Card key={idx} className="flex flex-col items-center shadow-xl h-[380px]">
              <div className="relative items-center justify-center h-[200px] w-full">
                <Image
                  src={urlFor(blog.thumbnailImage).url()}
                  alt="image"
                  fill={true}
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>

              <CardContent className="flex flex-col justify-between w-full h-[180px] px-3 gap-2 py-2">
                <h3 className="mt-2 text-primary text-lg line-clamp-1 font-bold">{blog.title}</h3>
                <div className="items-start flex-grow line-clamp-3 text-sm text-gray-600 dark:text-gray-300 pose">
                  {blog.smallDescription}
                </div>
                <div className="flex items-end">
                  <Button asChild className="w-full mb-1">
                    <Link href={`/articles/${blog.currentSlug}`}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
