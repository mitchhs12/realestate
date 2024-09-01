import { client, urlFor } from "@/lib/sanity";
import { FullBlog } from "@/lib/validations";
import { PortableText } from "@portabletext/react";
import { getReadingTime } from "@/lib/utils";
import Image from "next/image";

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

async function getData(slug: string) {
  const query = `
  *[_type=="article" && slug.current == '${slug}'] {
    "currentSlug": slug.current,
      title,
      content,
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
  const data: FullBlog = await getData(params.slug);

  return (
    <div className="flex flex-col items-center h-full mt-8 p-8">
      <h1 className="w-full max-w-[720px]">
        <span className="mt-2 block text-3xl leading-8 font-bold tracking-tight sm:text-4xl">{data.title}</span>
        <span className="w-full text-right text-md leading-8 tracking-tight sm:text-lg">{`${getReadingTime(
          data.content
        )} minute read`}</span>
        <div className="flex justify-start items-center mt-4">
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
        height={480}
        priority={true}
        className="rounded-lg mt-12 shadow-md dark:shadow-white/10"
      />
      <div className="mt-8 prose prose-stone prose-blockquote:font-charter text-base md:text-lg prose-base prose-p:font-charter prose-ol:font-charter prose-strong:font-charter prose-li:font-charter dark:prose-invert prose-li:marker:text-primary prose-a:text-primary pb-10">
        <PortableText value={data.content} components={components} />
      </div>
    </div>
  );
}
