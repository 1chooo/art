# Bento Journal

A bilingual personal journal template — brutalist bento home grid, MDX posts, and an editorial reading experience.

Design by [Hugo Lin](https://1chooo.com).

## Quick start

### Option A — create-next-app (recommended)

```bash
npx create-next-app@latest my-journal \
  --example "https://github.com/1chooo/art" \
  --example-path "templates/journal"
```

### Option B — create-bento-journal CLI (interactive prompts)

```bash
npx create-bento-journal@latest my-journal
```

Then:

```bash
cd my-journal
pnpm install   # or npm / yarn / bun
cp .env.example .env   # optional: set WEATHER_CITY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Start here (sample content)

After scaffolding, read these starter articles in order:

1. **[Hello, world](/en/notes/hello-world)** — tone and basic MDX
2. **[Writing in MDX](/en/notes/writing-in-mdx)** — `postMeta`, images, shortcodes (`Callout`, `CodeBlock`, `TagDemo`, `GapDemo`, etc.)
3. **[Sample Project](/en/projects/sample-project)** — how featured projects appear on the home grid

Delete or replace them once you are comfortable.

## Customize these files

| File | What to change |
|------|----------------|
| `messages/en.json`, `messages/zh.json` | Site title, brand name, about page copy, nav labels |
| `lib/bento-links.ts` | GitHub, email, and location quick links on the home grid |
| `lib/locations.ts` | Cities on the globe page (coordinates + ids) |
| `lib/nav.ts` | Navigation items |
| `content/posts/` | Your notes (`.mdx` files with `postMeta` export) |
| `content/projects/` | Your projects (`projectMeta` export) |
| `public/` | Images — `opengraph-image.png` powers the bento carousel and sample MDX |
| `.env` | `WEATHER_CITY` or `WEATHER_LAT` / `WEATHER_LON` for the home weather tile |

### Placeholders (if you used Option A)

Search for `{{AUTHOR_NAME}}`, `{{AUTHOR_EMAIL}}`, `{{GITHUB_USERNAME}}`, and `{{CITY_NAME}}` across the project and replace them, or use Option B which does this automatically.

## Adding a post

Create `content/posts/my-post.mdx`:

```mdx
export const postMeta = {
  title: "My first note",
  date: "2026-06-06",
  description: "A short summary for listings and SEO.",
  tags: ["journal"],
};

Your MDX content starts here.
```

No manual registry — `lib/posts.ts` scans `content/posts/` at build time.

- `my-post.mdx` → English only
- `my-post.en.mdx` + `my-post.zh.mdx` → bilingual under the same slug

Visit `/en/notes/my-post` (or `/zh/notes/my-post`).

## Stack

- Next.js 16 App Router & React Server Components
- MDX with remark-gfm
- Tailwind CSS v4 & @tailwindcss/typography
- next-intl (English & Chinese)
- Bento home grid with image, tag, and upcoming carousels

## License

MIT — see [LICENSE](./LICENSE).
