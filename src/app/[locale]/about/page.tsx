import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import Image from "next/image";
import { client } from "@/lib/sanity";
import AboutPageContent from "@/components/AboutPage";
import { getLanguageAlternates } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { urbanist } from "@/app/[locale]/fonts";

async function getData() {
  const query = `
  *[_type == "author"] {
    name,
    jobTitle,
    bio,
    email,
    "image_url": image.asset->url
  }
`;

  const data = await client.fetch(query);
  return data;
}

export async function generateMetadata(props: { params: Promise<{ locale: LanguageType }> }): Promise<Metadata> {
  const params = await props.params;
  const route = "/about";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "About Us",
    description: "Viva Ideal's team, mission, and contact details.",
    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}${route}`,
      languages: languageAlternates,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export const revalidate = 30;

export default async function Page(props: { params: Promise<{ locale: LanguageType }> }) {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);

  const t = await getScopedI18n("about");
  const data = await getData();

  const team = { title: t("team.title"), sub: t("team.sub") };
  const latam = {
    title: t("latam.title"),
    sub: t("latam.sub"),
    content: [
      { title: t("latam.content.1.title"), body: t("latam.content.1.body") },
      { title: t("latam.content.2.title"), body: t("latam.content.2.body") },
      { title: t("latam.content.3.title"), body: t("latam.content.3.body") },
      { title: t("latam.content.4.title"), body: t("latam.content.4.body") },
      { title: t("latam.content.5.title"), body: t("latam.content.5.body") },
    ],
  };
  const mission = { title: t("mission.title"), content: t("mission.content") };
  const how = { title: t("how.title"), content: t("how.content") };
  const values = {
    title: t("values.title"),
    trust: t("values.content.0"),
    transparency: t("values.content.1"),
    accessibility: t("values.content.2"),
    affordability: t("values.content.3"),
  };
  const brochures = { title: t("brochures.title"), sub: t("brochures.sub") };

  return (
    <div className="flex flex-col h-full items-center p-4 md:p-8 gap-16 py-6 w-full">
      <div className="flex flex-col items-center gap-2 pt-8 justify-center text-center">
        <h2
          className={`${urbanist.className} tracking-widest font-medium text-xl sm:text-2xl text-[#0C7A33] dark:text-primary`}
        >
          {t("main.sub")}
        </h2>
        <h1 className="flex items-center gap-4 sm:text-4xl text-5xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
          {t("main.title")}
        </h1>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-center w-full gap-12">
        <div className="flex flex-col gap-12 lg:w-1/2 text-center md:text-start">
          <div className="text-md md:text-sm italic">{t("content.0")}</div>
          <div className="text-primary text-xl md:text-2xl font-semibold">{t("content.1")}</div>
          <div className="text-md md:text-lg">{t("content.2")}</div>
          <div className="text-md md:text-lg">{t("content.3")}</div>
          <div className="text-md md:text-lg">{t("content.4")}</div>
        </div>
        <div className="flex justify-center md:justify-end items-center w-full lg:w-1/2 BORDER-2">
          <div className="relative h-[40vh] w-full max-w-[970px] shadow-2xl rounded-3xl">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/about.png`}
              alt="about"
              fill={true}
              style={{ objectFit: "cover" }}
              loading={"eager"}
              quality={70}
              priority={true}
              placeholder="blur"
              className="rounded-3xl"
              blurDataURL={
                "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
              }
              sizes="(max-width: 400px) 400px,
        (max-width: 510px) 510px,
        (max-width: 768px) 768px, 
        (max-width: 970px) 970px"
            />
          </div>
        </div>
      </div>

      <AboutPageContent
        locale={locale}
        data={data}
        contact={t("contact")}
        team={team}
        mission={mission}
        how={how}
        values={values}
        brochures={brochures}
        latam={latam}
      />
    </div>
  );
}
