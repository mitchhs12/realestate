import { poppins } from "@/app/[locale]/fonts";
import "@/app/[locale]/globals.css";
import { LanguageType } from "@/lib/validations";
import React from "react";
import "@/app/[locale]/quill.css"; // Import Quill styles

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LanguageType }>;
};

export default async function Layout(props: Props) {
  const { children } = props;

  return (
    <html>
      <body className={`${poppins.className} h-full`}>{children}</body>
    </html>
  );
}
