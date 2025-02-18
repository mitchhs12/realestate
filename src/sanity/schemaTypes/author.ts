import { defineField, defineType } from "sanity";

const bioWordLimit = 100;

export const author = defineType({
  name: "author",
  type: "document",
  title: "Author",

  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Enter your name (as you would like it to appear on the site).",
    }),
    defineField({
      name: "jobTitle",
      type: "string",
      title: "Enter your job title (as you would like it to appear on the site).",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Enter your email (this will be how people can contact you).",
    }),
    defineField({
      name: "bio",
      type: "text",
      title: "Write a short bio (100 words max).",
      validation: (Rule) =>
        Rule.custom((bio) => {
          const wordCount = bio ? bio.trim().split(/\s+/).length : 0;
          if (wordCount > bioWordLimit) {
            return `Biography must be under ${bioWordLimit} words. You have used ${wordCount} words.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Upload a profile image of yourself (and crop it so that the circle is on your face).",
      options: { hotspot: true },
    }),
  ],
});
