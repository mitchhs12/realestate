import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "cik4bgx3",
  dataset: "production",
  useCdn: false, // we don't need this because next-14 has built in caching
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
