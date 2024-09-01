import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Enter your name (as you would like it to appear on the site).',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      title: 'Write a short bio (50 words max).',
      validation: (Rule) =>
        Rule.custom((bio) => {
          const wordLimit = 50 // Set your word limit here
          const wordCount = bio ? bio.trim().split(/\s+/).length : 0
          if (wordCount > wordLimit) {
            return `Biography must be under ${wordLimit} words. You have used ${wordCount} words.`
          }
          return true
        }),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Upload a profile image of yourself (and crop it so that the circle is on your face).',
      options: {hotspot: true},
    }),
  ],
})
