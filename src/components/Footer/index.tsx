import { getScopedI18n } from "@/locales/server";

export default async function Footer() {
  const scopedT = await getScopedI18n("home.footer");
  return <p>{scopedT("allRightsReserved")}</p>;
}
