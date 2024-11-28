"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { LocaleContext } from "@/context/LocaleContext";

export default function Brochure() {
  const { defaultLanguage } = useContext(LocaleContext);
  const english = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/pdfs/viva-ideal-en.pdf`; // Replace with your PDF path
  const spanish = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/pdfs/viva-ideal-es.pdf`; // Replace with your PDF path
  const englishName = new Intl.DisplayNames(defaultLanguage, { type: "language" }).of("en");
  const spanishName = new Intl.DisplayNames(defaultLanguage, { type: "language" }).of("es");

  const handleImageClick = (language: string) => {
    const url = language === "en" ? english : spanish;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-row gap-20">
      <div className="flex flex-col gap-3">
        <div
          onClick={() => handleImageClick("en")}
          className="shadow-2xl transition-transform ease-in-out duration-500 hover:rotate-6 hover:cursor-pointer"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/pdfs/pdf-thumbnail.png`}
            alt="pdf-thumbnail"
            width={200} // Set width and height as needed
            height={300}
          />
        </div>
        {englishName}
      </div>
      <div className="flex flex-col gap-3">
        <div
          onClick={() => handleImageClick("es")}
          className="shadow-2xl transition-transform ease-in-out duration-500 hover:rotate-6 hover:cursor-pointer"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/pdfs/pdf-thumbnail.png`}
            alt="pdf-thumbnail"
            width={200} // Set width and height as needed
            height={300}
          />
        </div>
        {spanishName}
      </div>
    </div>
  );
}
