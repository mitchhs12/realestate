import { client, urlFor } from "@/lib/sanity";
import { FullBlog } from "@/lib/validations";
import { PortableText } from "@portabletext/react";
import { getReadingTime } from "@/lib/utils";
import Image from "next/image";

export const revalidate = 30;

async function getData(slug: string) {
  const query = `
  *[_type=="article" && slug.current == '${slug}'] {
    "currentSlug": slug.current,
      title,
      content,
      titleImage,
      author
  }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default async function Article({ params }: { params: { locale: string; slug: string } }) {
  const data: FullBlog = await getData(params.slug);

  return (
    <div className="flex flex-col items-center h-full mt-8 p-8">
      <h1 className="w-full max-w-[720px]">
        {/* <span className="block text-base text-start font-semibold tracking-wide uppercase">{data.author}</span> */}
        <span className="mt-2 block text-3xl leading-8 font-bold tracking-tight sm:text-4xl">{data.title}</span>
        <span className="w-full text-right text-md leading-8 tracking-tight sm:text-lg">{`${getReadingTime(
          data.content
        )} minute read`}</span>
      </h1>
      <Image
        src={urlFor(data.titleImage).url()}
        alt="Title Image"
        width={720}
        height={720}
        priority={true}
        className="rounded-lg mt-8 shadow-md dark:shadow-white/10 p-8"
      />
      <div className="mt-8 prose prose-stone prose-blockquote:font-charter text-base md:text-lg prose-base prose-p:font-charter prose-ol:font-charter prose-strong:font-charter prose-li:font-charter dark:prose-invert prose-li:marker:text-primary prose-a:text-primary pb-10">
        <PortableText value={data.content} />
      </div>
    </div>
  );
}
