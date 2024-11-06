import { poppins } from "@/app/[locale]/fonts";
import { getScopedI18n } from "@/locales/server";

export default async function ArticlesTitle({ locale }: { locale: string }) {
  const t = await getScopedI18n("articles");
  const title = t("title");

  return (
    <div className="absolute inset-0 flex flex-col w-full justify-center items-center">
      <div className="flex flex-col gap-y-4">
        <h1
          className={`${poppins.className} flex text-center justify-center text-xl sm:text-2xl md:text-3xl font-light tracking-wider`}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
