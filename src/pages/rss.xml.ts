import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "The Hacker Press",
    description: "An online newsletter built by teens at Hack Club.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.properties.Name,
      pubDate: post.data.properties.Date,
      link: `/posts/${post.data.properties.Slug}`,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}
