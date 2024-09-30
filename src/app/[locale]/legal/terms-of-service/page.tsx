import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { PortableText } from "@portabletext/react";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex w-full justify-center items-center">
      <h1>Terms of Service</h1>
      <div></div>
    </div>
  );
}
