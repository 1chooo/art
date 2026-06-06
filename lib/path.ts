import { join } from "path";

export const POSTS_DIRECTORY = join(process.cwd(), "content", "posts");

export const postPath = (slug: string) => `/posts/${slug}`;
