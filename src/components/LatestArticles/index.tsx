import { getScopedI18n } from "@/locales/server";
import { urbanist } from "@/app/[locale]/fonts";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { client, urlFor } from "@/lib/sanity";
import { getFullLanguageName } from "@/lib/utils";
import { ArticleWithAuthor, LanguageType } from "@/lib/validations";
import ChangeLanguageButton from "@/app/[locale]/articles/ChangeLanguageButton";

import Image from "next/image";

async function getData(props: { locale: LanguageType }) {
  const locale = props.locale;
  const query = `
  *[_type=="article"] | order(_updatedAt desc)[0...4] {
    "localizedTitle": localizedTitle.${locale},
    "currentSlug": slug.current,
    thumbnailImage,
    _updatedAt,
    author->{
      name,
      image
    }
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function LatestArticles(props: { locale: LanguageType }) {
  const locale = props.locale;
  const [data, t]: [ArticleWithAuthor[], any] = await Promise.all([
    getData({ locale }),
    getScopedI18n("articles.latestArticles"),
  ]);

  const readMore = t("readMore");
  const changeLanguage = t("changeLanguage");
  const unavailableWarning = t("unavailableWarning");
  const articleUnavailable = t("articleUnavailable");

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 items-center w-full h-full shadow-2xl border shadow-black/10 dark:shadow-white rounded-2xl ">
      <div className="flex w-full flex-col gap-3 py-4 items-center text-center">
        <h3
          className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
        >
          {t("sub")}
        </h3>
        <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
          {t("title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-center w-full md:items-stretch justify-center">
        {data.map((article, index) => (
          <div
            key={index}
            className={`flex flex-col h-full w-full space-y-6
            ${index >= 3 && "hidden sm:block"}
            ${index >= 4 && "sm:hidden md:block"}
            ${index >= 3 && "md:hidden lg:block"}
            ${index >= 3 && "lg:hidden"}
          `}
          >
            <Link
              href={`/articles/${article.currentSlug}`}
              className="relative shadow-2xl dark:shadow-white rounded-xl h-[250px]"
            >
              <Image
                src={urlFor(article.thumbnailImage).url()}
                alt="image"
                fill={true}
                style={{ objectFit: "cover" }}
                className="rounded-xl"
                placeholder="blur"
                blurDataURL={
                  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                }
              />
            </Link>

            <div className="flex flex-col w-full flex-grow">
              {article.localizedTitle ? (
                <div className="flex flex-col w-full h-auto flex-grow gap-6 justify-between">
                  <Button
                    asChild
                    variant={"link"}
                    className="flex p-0 h-auto flex-grow gap-3 items-center text-primary"
                  >
                    <Link href={`/articles/${article.currentSlug}`}>
                      <h3 className="flex text-sm sm:text-md md:text-lg font-bold text-wrap text-start">
                        {article.localizedTitle
                          ? article.localizedTitle
                          : `${articleUnavailable} ${getFullLanguageName(locale)}`}
                      </h3>
                    </Link>
                  </Button>
                  <div className="flex items-center gap-3 text-primary">
                    <Image
                      src={urlFor(article.author.image).url()}
                      alt={article.author.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm sm:text-md truncate">{article.author.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex mb-1 w-full">
                  <ChangeLanguageButton changeLanguageText={changeLanguage} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
