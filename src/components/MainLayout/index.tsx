import Header from "@/components/Header";
import { getScopedI18n } from "@/locales/server";
type Props = {
  children: React.ReactNode;
  locale: string;
};

export default async function MainLayout({ children, locale }: Props) {
  const t = await getScopedI18n("home.header");
  return (
    <>
      <Header
        guides={t("guides")}
        searchPlaceholder={t("search.placeholder")}
        searchText={t("search.search-button")}
        construction={t("construction")}
        construction_sub={t("construction-sub")}
        sellButtonBig={t("sell-button-big")}
        sellButtonSmall={t("sell-button-small")}
      />
      {children}
    </>
  );
}
