import { type SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { author } from "./author";
import { localeText, localeString } from "./languages";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, author, localeText, localeString],
};
