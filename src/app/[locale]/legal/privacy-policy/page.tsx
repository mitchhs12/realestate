import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  return <div>Privacy Policy</div>;
}
