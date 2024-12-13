import { ReactElement } from "react";
import { I18nProviderClient } from "@/locales/client";

export default async function SubLayout(
  props: {
    params: Promise<{ locale: string }>;
    children: ReactElement<any>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
