import { client, urlFor } from "@/lib/sanity";
import { FullArticle } from "@/lib/validations";
import { PortableText } from "@portabletext/react";
import { getReadingTime } from "@/lib/utils";
import Image from "next/image";
import { getScopedI18n } from "@/locales/server";

const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div>
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Image"}
            width={720} // Adjust as needed
            height={480} // Adjust as needed
            className="rounded-lg"
            style={{
              height: "auto",
              maxHeight: "70vh", // Cap height at 80% of viewport height
            }}
          />
        </div>
      );
    },
  },
};

export const revalidate = 30;

async function getData(locale: string, slug: string) {
  const query = `
  *[_type=="article" && slug.current == "${slug}"] {
    "currentSlug": slug.current,
      "localizedTitle":localizedTitle.${locale},
      "content":content[_key == "${locale}"][0],
      titleImage,
      author->{
      name,
      bio,
      image
      }
  }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function Article({ params }: { params: { locale: string; slug: string } }) {
  const [data, t]: [FullArticle, any] = await Promise.all([
    getData(params.locale, params.slug),
    getScopedI18n("articles"),
  ]);

  const titleError = t("titleError");
  const readingTimeError = t("readingTimeError");
  const errorLine1 = t("errorLine1");
  const errorLine2 = t("errorLine2");
  const reading = t("reading");

  return (
    <div className="flex flex-col items-center h-full mt-6 p-8">
      <h1 className="w-full max-w-[720px]">
        <span className="block text-3xl leading-8 font-bold tracking-tight sm:text-4xl">
          {data.localizedTitle ? data.localizedTitle : titleError}
        </span>
        <span className="w-full text-right text-md leading-8 tracking-tight sm:text-lg">
          {data.content ? `${getReadingTime(data.content.value)} ${reading}` : readingTimeError}
        </span>
        <div className="flex justify-start items-center mt-6">
          <Image
            src={urlFor(data.author.image).url()}
            alt={data.author.name}
            width={60}
            height={60}
            className="rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{data.author.name}</p>
            <p className="text-sm">{data.author.bio}</p>
          </div>
        </div>
      </h1>
      <Image
        src={urlFor(data.titleImage).url()}
        alt="Title Image"
        width={720}
        height={308}
        priority
        className="rounded-lg mt-12 shadow-md dark:shadow-white/10"
      />
      <div className="mt-10 prose prose-stone prose-blockquote:font-charter text-base md:text-lg prose-base prose-p:font-charter prose-ol:font-charter prose-strong:font-charter prose-li:font-charter dark:prose-invert prose-li:marker:text-primary prose-a:text-primary pb-10">
        {data.content ? (
          <PortableText value={data.content.value} components={components} />
        ) : (
          <div className="flex flex-col justify-center items-center text-center">
            <div>{errorLine1}</div>
            <div>{errorLine2}</div>
          </div>
        )}
      </div>
    </div>
  );
}
