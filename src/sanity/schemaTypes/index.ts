import { type SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { author } from "./author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, author],
};
