import { z } from "astro:content";
import { defineCollection } from "astro:content";
import { notionLoader } from "notion-astro-loader";
import {
  notionPageSchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";
import { NOTION_TOKEN, NOTION_DATABASE_ID } from "astro:env/server";

const posts = defineCollection({
  loader: notionLoader({
    auth: NOTION_TOKEN,
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  }),
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      Description: transformedPropertySchema.rich_text,
      Date: transformedPropertySchema.date.transform((property) => {
        return property?.start;
      }),
      Published: transformedPropertySchema.checkbox,
      Slug: transformedPropertySchema.rich_text.refine(
        (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
        {
          message: "Slug must be lowercase, alphanumeric, and kebab-case",
        }
      ),
      //   Authors: transformedPropertySchema.people.optional(),
    }),
  }),
});

export const collections = { posts };
