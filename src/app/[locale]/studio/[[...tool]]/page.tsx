/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */
import React from "react";
import { setStaticParamsLocale } from "next-international/server";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";
import { Metadata, Viewport } from "next";

export const dynamic = "force-static";

import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";

// Set the correct `viewport`, `robots` and `referrer` meta tags
export const metadata: Metadata = {
  ...studioMetadata,
  // Overrides the title until the Studio is loaded
  title: "Loading Studio...",
};

export const viewport: Viewport = {
  ...studioViewport,
  // Overrides the viewport to resize behavior
  interactiveWidget: "resizes-content",
};

export default function StudioPage({ params: { locale } }) {
  setStaticParamsLocale(locale);
  return (
    <div className="w-full h-[900px] min-h-screen-minus-header-dvh">
      <NextStudio config={config} />
    </div>
  );
}
