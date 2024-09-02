import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "71vkn2m9",
  dataset: "production",
  apiVersion: "2023-09-01",
  useCdn: false, // we don't need this because next-14 has built in caching
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
