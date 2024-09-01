import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title of your article',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug of your article (this will be used in the URL of your article).',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'string',
      title: 'Your name (this will appear as the author of the article).',
    }),
    defineField({
      name: 'titleImage',
      type: 'image',
      title: 'Main image of your article',
    }),
    defineField({
      name: 'smallDescription',
      type: 'text',
      title: 'Small description of your article',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content of your article',
      of: [{type: 'block'}],
    }),
  ],
})
