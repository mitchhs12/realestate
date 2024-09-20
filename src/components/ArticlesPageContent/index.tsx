import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { client, urlFor } from "@/lib/sanity";
import { getFullLanguageName } from "@/lib/utils";
import { ArticleType } from "@/lib/validations";
import { getScopedI18n } from "@/locales/server";
import Image from "next/image";

async function getData(locale: string) {
  const query = `
  *[_type=="article"] | order(_createdAt desc) {
    "localizedTitle":localizedTitle.${locale},
      "thumbnailDescription":thumbnailDescription.${locale},
      "currentSlug": slug.current,
      thumbnailImage,
      _createdAt
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function ArticlesPageContent({ locale }: { locale: string }) {
  const [data, t]: [ArticleType[], any] = await Promise.all([getData(locale), getScopedI18n("articles")]);

  const readMore = t("readMore");
  const changeLanguage = t("changeLanguage");
  const unavailableWarning = t("unavailableWarning");
  const articleUnavailable = t("articleUnavailable");

  return (
    <div className="flex flex-col justify-center items-center w-full flex-grow">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-full gap-4 justify-start pt-8 px-3 items-start max-w-8xl">
        {data.map((article, idx) => (
          <Card key={idx} className="flex flex-col items-center shadow-xl h-[380px]">
            <div className="relative items-center justify-center h-[200px] w-full">
              <Image
                src={urlFor(article.thumbnailImage).url()}
                alt="image"
                fill={true}
                objectFit={"cover"}
                className="rounded-t-lg"
                placeholder="blur"
                blurDataURL={
                  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                }
              />
            </div>

            <CardContent className="flex flex-col justify-between w-full h-[180px] px-3 gap-2 py-2">
              <h3 className="mt-2 text-primary text-lg line-clamp-1 font-bold">
                {article.localizedTitle
                  ? article.localizedTitle
                  : `${articleUnavailable} ${getFullLanguageName(locale)}`}
              </h3>
              <div className="items-start flex-grow line-clamp-3 text-sm text-gray-600 dark:text-gray-300 pose">
                {article.thumbnailDescription ? article.thumbnailDescription : unavailableWarning}
              </div>
              <div className="flex items-end w-full">
                <Button asChild className="flex w-full mb-1" disabled={article.thumbnailDescription ? false : true}>
                  <Link
                    className={`${!article.thumbnailDescription ? "pointer-events-none opacity-50" : ""}`}
                    href={article.thumbnailDescription ? `/articles/${article.currentSlug}` : "#"}
                    tabIndex={article.thumbnailDescription ? 0 : -1}
                    aria-disabled={!article.thumbnailDescription}
                  >
                    {article.localizedTitle ? readMore : changeLanguage}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
