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
      type: 'reference',
      to: [{type: 'author'}],
      title: 'Author of the article',
      description: 'Select the author of this article',
    }),
    defineField({
      name: 'thumbnailImage',
      type: 'image',
      title:
        'Thumbnail image of your article (this will be displayed on the articles page). Your image should be a square at least 500px x 500px.',
    }),
    defineField({
      name: 'titleImage',
      type: 'image',
      title:
        'Main image of your article (this will be displayed on the top of your article). Your image should be at least 720px wide.',
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
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
  ],
})
