import Header from "@/components/Header";
import { getScopedI18n } from "@/locales/server";
type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  // do these await functions in a promise
  const [h, p, t] = await Promise.all([
    getScopedI18n("home.header"),
    getScopedI18n("home.header.profile-button"),
    getScopedI18n("home.header.profile-button.theme"),
  ]);

  return (
    <>
      <Header
        guides={h("guides")}
        searchPlaceholder={h("search.placeholder")}
        searchText={h("search.search-button")}
        construction={h("construction")}
        construction_sub={h("construction-sub")}
        sellButtonBig={h("sell-button-big")}
        sellButtonSmall={h("sell-button-small")}
        greeting={p("greeting")}
        log_in={p("log-in")}
        sign_up={p("sign-up")}
        log_out={p("log-out")}
        theme={{
          theme: t("theme"),
          light: t("light"),
          dark: t("dark"),
          system: t("system"),
        }}
        language={p("language")}
        currency={p("currency")}
        settings={p("settings")}
        exit={p("exit")}
        exit_short={p("exit-short")}
      />
      {children}
    </>
  );
}
