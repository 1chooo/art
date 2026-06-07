#!/usr/bin/env node

import { spawn } from "child_process";
import { cp, readFile, writeFile, readdir, rm, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";

const TEMPLATE_REPO = "https://github.com/1chooo/art";
const TEMPLATE_PATH = "templates/journal";

const PLACEHOLDERS = [
  ["{{AUTHOR_NAME}}", "authorName"],
  ["{{AUTHOR_EMAIL}}", "authorEmail"],
  ["{{GITHUB_USERNAME}}", "githubUsername"],
  ["{{CITY_NAME}}", "cityName"],
];

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const TEXT_EXTENSIONS = new Set([
  ".json",
  ".ts",
  ".tsx",
  ".mjs",
  ".js",
  ".md",
  ".mdx",
  ".css",
  ".env",
  ".example",
]);

async function replacePlaceholders(projectDir, values) {
  const files = await walk(projectDir);
  for (const file of files) {
    const ext = file.slice(file.lastIndexOf("."));
    if (!TEXT_EXTENSIONS.has(ext) && !file.endsWith(".env.example")) continue;
    let content = await readFile(file, "utf8");
    let changed = false;
    for (const [token, key] of PLACEHOLDERS) {
      if (content.includes(token)) {
        content = content.split(token).join(values[key]);
        changed = true;
      }
    }
    if (changed) await writeFile(file, content);
  }
}

async function stripZhLocale(projectDir) {
  const zhJson = join(projectDir, "messages", "zh.json");
  if (await fileExists(zhJson)) await rm(zhJson);

  const routingPath = join(projectDir, "i18n", "routing.ts");
  if (await fileExists(routingPath)) {
    let routing = await readFile(routingPath, "utf8");
    routing = routing.replace(
      /export const routing = defineRouting\(\{[\s\S]*?locales:\s*\[[^\]]*\]/,
      "export const routing = defineRouting({\n  locales: [\"en\"]",
    );
    await writeFile(routingPath, routing);
  }

  const postsDir = join(projectDir, "content", "posts");
  if (await fileExists(postsDir)) {
    for (const file of await readdir(postsDir)) {
      if (file.endsWith(".zh.mdx")) {
        await rm(join(postsDir, file));
      }
    }
  }
}

function runCreateNextApp(projectName, cwd) {
  return new Promise((resolve, reject) => {
    const args = [
      "create-next-app@latest",
      projectName,
      "--example",
      TEMPLATE_REPO,
      "--example-path",
      TEMPLATE_PATH,
      "--yes",
      "--disable-git",
    ];
    const child = spawn("npx", args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`create-next-app exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  p.intro("create-bento-journal");

  const projectNameArg = process.argv[2];

  const projectName = projectNameArg
    ? projectNameArg
    : await p.text({
        message: "Project name",
        placeholder: "my-journal",
        defaultValue: "my-journal",
        validate: (v) => {
          if (!v?.trim()) return "Project name is required";
          if (!/^[a-z0-9-_]+$/i.test(v)) {
            return "Use letters, numbers, hyphens, and underscores only";
          }
        },
      });

  if (p.isCancel(projectName)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const authorName = await p.text({
    message: "Your name (brand)",
    placeholder: "Alex Chen",
    validate: (v) => (v?.trim() ? undefined : "Name is required"),
  });
  if (p.isCancel(authorName)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const authorEmail = await p.text({
    message: "Email",
    placeholder: "hello@example.com",
    validate: (v) =>
      v?.includes("@") ? undefined : "Enter a valid email address",
  });
  if (p.isCancel(authorEmail)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const githubUsername = await p.text({
    message: "GitHub username",
    placeholder: "your-username",
    validate: (v) => (v?.trim() ? undefined : "GitHub username is required"),
  });
  if (p.isCancel(githubUsername)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const cityName = await p.text({
    message: "Home city (weather tile & location page)",
    placeholder: "San Francisco",
    defaultValue: "San Francisco",
  });
  if (p.isCancel(cityName)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const locales = await p.select({
    message: "Locales",
    options: [
      { value: "en,zh", label: "English + Chinese (zh)" },
      { value: "en", label: "English only" },
    ],
    initialValue: "en,zh",
  });
  if (p.isCancel(locales)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const cwd = process.cwd();
  const projectDir = join(cwd, projectName);

  if (await fileExists(projectDir)) {
    p.cancel(`Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const s = p.spinner();
  s.start("Scaffolding with create-next-app…");

  try {
    await runCreateNextApp(projectName, cwd);
  } catch (err) {
    s.stop("Scaffold failed.");
    p.log.error(String(err));
    process.exit(1);
  }

  s.message("Replacing placeholders…");
  await replacePlaceholders(projectDir, {
    authorName,
    authorEmail,
    githubUsername,
    cityName,
  });

  if (locales === "en") {
    s.message("Configuring English-only locale…");
    await stripZhLocale(projectDir);
  }

  const envExample = join(projectDir, ".env.example");
  if (await fileExists(envExample)) {
    let env = await readFile(envExample, "utf8");
    env = env.replace(/^WEATHER_CITY=.*$/m, `WEATHER_CITY=${cityName}`);
    await writeFile(join(projectDir, ".env.example"), env);
    await cp(join(projectDir, ".env.example"), join(projectDir, ".env"));
  }

  s.stop("Project created.");

  p.note(
    [
      `cd ${projectName}`,
      "pnpm install",
      "pnpm dev",
      "",
      "Start reading:",
      "  /en/notes/hello-world",
      "  /en/notes/writing-in-mdx",
    ].join("\n"),
    "Next steps",
  );

  p.outro(`Done! Open http://localhost:3000 after pnpm dev`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
