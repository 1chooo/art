#!/usr/bin/env node
/**
 * Sync root app → templates/journal for the open-source template.
 * Run: pnpm template:sync
 */

import { cp, mkdir, readFile, writeFile, rm, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(ROOT, "templates", "journal");

const COPY_DIRS = ["app", "components", "lib", "i18n", "public"];

const COPY_FILES = [
  "next.config.mjs",
  "proxy.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "tsconfig.json",
  "mdx-components.tsx",
  "mdx.d.ts",
  ".env.example",
  ".gitignore",
];

const APP_SKIP = new Set(["app/[locale]/posts"]);

const POST_ALLOWLIST = new Set([
  "hello-world.mdx",
  "writing-in-mdx.en.mdx",
  "writing-in-mdx.zh.mdx",
]);

const PROJECT_ALLOWLIST = new Set(["sample-project.mdx"]);

async function copyDirFiltered(src, dest, skipPaths = []) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const rel = srcPath.slice(ROOT.length + 1);
    if (skipPaths.some((s) => rel === s || rel.startsWith(s + "/"))) continue;
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirFiltered(srcPath, destPath, skipPaths);
    } else {
      await cp(srcPath, destPath);
    }
  }
}

async function syncContent() {
  const postsSrc = join(ROOT, "content", "posts");
  const postsDest = join(TEMPLATE, "content", "posts");
  await rm(postsDest, { recursive: true, force: true });
  await mkdir(postsDest, { recursive: true });
  for (const file of POST_ALLOWLIST) {
    await cp(join(postsSrc, file), join(postsDest, file));
  }

  const projectsSrc = join(ROOT, "content", "projects");
  const projectsDest = join(TEMPLATE, "content", "projects");
  await rm(projectsDest, { recursive: true, force: true });
  await mkdir(projectsDest, { recursive: true });
  for (const file of PROJECT_ALLOWLIST) {
    await cp(join(projectsSrc, file), join(projectsDest, file));
  }
}

function sanitizeMessages(json) {
  const data = JSON.parse(json);
  data.metadata.title = "{{AUTHOR_NAME}} · Journal";
  data.metadata.description = "Notes, projects, and experiments.";
  data.brand = "{{AUTHOR_NAME}}";
  data.about.lead =
    "Replace this with a short introduction — who you are and what you write about.";
  data.about.philosophy =
    "A quote or line that captures how you think about your work.";
  data.about.background =
    "Share your background — education, paths taken, and what led you here.";
  data.about.work =
    "Describe your professional experience, roles, and what you build.";
  data.about.beyond =
    "Hobbies, interests, or pursuits outside of your main work.";
  data.about.projects = "A few things you have built:";
  data.about.project1chooo = "a project worth highlighting";
  data.about.projectArt = "this journal — brutalist bento grid with MDX posts";
  data.about.projectVCard = "another project or experiment";
  data.about.connect = "Want to collaborate or chat? Find me at";
  data.home.quickLinks.location = "{{CITY_NAME}}";
  data.home.quickLinks.email = "{{AUTHOR_EMAIL}}";
  data.home.quote = "Start writing. The grid is already yours.";
  data.home.upcomingFallbackTitle = "Your next note";
  data.home.upcomingFallbackDesc = "Add a post in content/posts/ to see it here.";
  data.projects.description =
    "Things I have built — from personal sites to open-source templates and weekend experiments.";
  data.location.description = "{{CITY_NAME}} now — edit lib/locations.ts to add your cities.";
  data.location.cities = {
    city1: "{{CITY_NAME}}",
    city2: "City Two",
    city3: "City Three",
  };
  data.location.cityNotes = {
    city1: "Your current city.",
    city2: "Another place that matters to you.",
    city3: "A third marker on the globe.",
  };
  return JSON.stringify(data, null, 2) + "\n";
}

function sanitizeMessagesZh(json) {
  const data = JSON.parse(json);
  data.metadata.title = "{{AUTHOR_NAME}} · 筆記";
  data.metadata.description = "筆記、專案與實驗。";
  data.brand = "{{AUTHOR_NAME}}";
  data.about.lead = "在此寫下簡短自我介紹——你是誰、寫些什麼。";
  data.about.philosophy = "一句話或引言，代表你的思考方式。";
  data.about.background = "分享你的背景——學經歷、走過的路。";
  data.about.work = "描述你的工作經歷與你打造的東西。";
  data.about.beyond = "工作之外的興趣或追求。";
  data.about.projects = "你做過的一些作品：";
  data.about.project1chooo = "值得放上的專案";
  data.about.projectArt = "這本筆記——粗獷 Bento 版面與 MDX 文章";
  data.about.projectVCard = "另一個專案或實驗";
  data.about.connect = "想合作或聊聊？歡迎到";
  data.home.quickLinks.location = "{{CITY_NAME}}";
  data.home.quickLinks.email = "{{AUTHOR_EMAIL}}";
  data.home.quote = "開始寫吧，網格已經準備好了。";
  data.home.upcomingFallbackTitle = "你的下一篇筆記";
  data.home.upcomingFallbackDesc = "在 content/posts/ 新增文章後會顯示在這裡。";
  data.projects.description =
    "我做過的一些作品——從個人網站到開源模板與週末實驗。";
  data.location.description =
    "目前在 {{CITY_NAME}}——在 lib/locations.ts 編輯你的城市。";
  data.location.cities = {
    city1: "{{CITY_NAME}}",
    city2: "城市二",
    city3: "城市三",
  };
  data.location.cityNotes = {
    city1: "你所在的城市。",
    city2: "另一個對你有意義的地方。",
    city3: "地圖上的第三個標記。",
  };
  return JSON.stringify(data, null, 2) + "\n";
}

function sanitizeBentoLinks(content) {
  return content
    .replace(
      'href: "https://github.com/1chooo"',
      'href: "https://github.com/{{GITHUB_USERNAME}}"',
    )
    .replace(
      'href: "mailto:hugo@1chooo.com"',
      'href: "mailto:{{AUTHOR_EMAIL}}"',
    );
}

function sanitizeLocations(content) {
  return `export type LocationId = "city1" | "city2" | "city3";

export type LocationPoint = {
  id: LocationId;
  location: [number, number];
  current?: boolean;
};

/** Cities marked on the location globe — edit coordinates here. */
export const LOCATION_POINTS: LocationPoint[] = [
  { id: "city1", location: [37.7749, -122.4194], current: true },
  { id: "city2", location: [25.033, 121.5654] },
  { id: "city3", location: [34.0522, -118.2437] },
];
`;
}

async function writeTemplatePackageJson() {
  const src = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
  const pkg = {
    name: "my-journal",
    version: "0.1.0",
    private: true,
    scripts: src.scripts,
    dependencies: src.dependencies,
    devDependencies: src.devDependencies,
  };
  await writeFile(
    join(TEMPLATE, "package.json"),
    JSON.stringify(pkg, null, 2) + "\n",
  );
}

async function main() {
  console.log("Syncing template → templates/journal/");

  await mkdir(TEMPLATE, { recursive: true });

  for (const dir of COPY_DIRS) {
    const src = join(ROOT, dir);
    const dest = join(TEMPLATE, dir);
    await rm(dest, { recursive: true, force: true });
    const skip = dir === "app" ? [...APP_SKIP] : [];
    await copyDirFiltered(src, dest, skip);
    console.log(`  copied ${dir}/`);
  }

  for (const file of COPY_FILES) {
    await cp(join(ROOT, file), join(TEMPLATE, file));
    console.log(`  copied ${file}`);
  }

  await syncContent();
  console.log("  synced content/ (allowlist)");

  await mkdir(join(TEMPLATE, "messages"), { recursive: true });
  const enJson = await readFile(join(ROOT, "messages", "en.json"), "utf8");
  const zhJson = await readFile(join(ROOT, "messages", "zh.json"), "utf8");
  await writeFile(
    join(TEMPLATE, "messages", "en.json"),
    sanitizeMessages(enJson),
  );
  await writeFile(
    join(TEMPLATE, "messages", "zh.json"),
    sanitizeMessagesZh(zhJson),
  );
  console.log("  sanitized messages/");

  const bentoLinks = await readFile(join(ROOT, "lib", "bento-links.ts"), "utf8");
  await writeFile(
    join(TEMPLATE, "lib", "bento-links.ts"),
    sanitizeBentoLinks(bentoLinks),
  );
  await writeFile(join(TEMPLATE, "lib", "locations.ts"), sanitizeLocations());
  console.log("  sanitized lib/bento-links.ts, lib/locations.ts");

  await writeTemplatePackageJson();
  console.log("  wrote package.json");

  console.log("  (README.md and LICENSE are preserved — edit them in templates/journal/)");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
