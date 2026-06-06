import { getLocale } from "next-intl/server";
import { getAllPosts, getAllTags, type PostLocale } from "@/lib/posts";
import { TagDemo } from "./tag-demo";

export async function TagDemoWrapper() {
  const locale = (await getLocale()) as PostLocale;
  const posts = getAllPosts(locale).map((p) => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags,
  }));
  const tags = getAllTags().map((t) => t.tag);

  return <TagDemo posts={posts} tags={tags} locale={locale} />;
}
