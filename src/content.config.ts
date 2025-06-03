import { z } from "astro:content";
import { defineCollection } from "astro:content";
import {
  notionLoader,
  fileToImageAsset,
} from "@chlorinec-pkgs/notion-astro-loader";
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from "@chlorinec-pkgs/notion-astro-loader/schemas";
import { NOTION_TOKEN, NOTION_DATABASE_ID } from "astro:env/server";

const defaultImageUrl = "https://placehold.co/600x500.png"; // when image missing somehow

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
      // TODO: is this correct? not sure
      Image: propertySchema.files.transform(async (files) => {
        const firstFile = files.files[0];
        return (await fileToImageAsset(firstFile))?.src;
      }),
      ImageAlt: transformedPropertySchema.rich_text,
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
      // FIXME: does not load more than one person's data
      // also, zod schema for this is kind of cooked
      Authors: propertySchema.people,
    }),
  }),
});

export const collections = { posts };
