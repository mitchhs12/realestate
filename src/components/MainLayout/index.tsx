import Header from "@/components/Header";
import { getScopedI18n } from "@/locales/server";
import { QueryContextProvider } from "@/context/QueryContext";
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

  const headerValues = {
    articles: h("articles"),
    map: h("map"),
    searchPlaceholder: h("search.placeholder"),
    searchText: h("search.search-button"),
    construction: h("construction"),
    construction_sub: h("construction-sub"),
    sellButtonBig: h("sell-button-big"),
    sellButtonSmall: h("sell-button-small"),
    greeting: p("greeting"),
    log_in: p("log-in"),
    sign_up: p("sign-up"),
    log_out: p("log-out"),
    theme_theme: t("theme"),
    theme_light: t("light"),
    theme_dark: t("dark"),
    theme_system: t("system"),
    language: p("language"),
    currency: p("currency"),
    settings: p("settings"),
    exit: p("exit"),
    exit_short: p("exit-short"),
    filters: h("filters"),
    myproperties: p("my-properties"),
    mylists: p("my-lists"),
    features: h("features"),
    featuresSub: h("subtitles.features"),
    categories: h("categories"),
    categoriesSub: h("subtitles.categories"),
    rooms: h("rooms"),
    roomsSub: h("subtitles.rooms"),
    apply: h("apply"),
    reset: h("reset"),
    selectAll: h("select-all"),
    deselectAll: h("deselect-all"),
    search: h("search.search-button-small"),
  };

  return (
    <>
      <QueryContextProvider headerValues={headerValues}>
        {/* <Header
        map={h("map")}
        list={h("list")}
        articles={h("articles")}
        data={h("data")}
        searchPlaceholder={h("search.placeholder")}
        searchPlaceholderShort={h("search.placeholder-short")}
        searchText={h("search.search-button")}
        construction={h("construction")}
        construction_sub={h("construction-sub")}
        sellButtonBig={h("sell-button-big")}
        sellButtonSmall={h("sell-button-small")}
        exit={p("exit")}
        exit_short={p("exit-short")}
        searchButtonSmall={h("search.search-button-small")}
      /> */}
        {children}
      </QueryContextProvider>
    </>
  );
}
