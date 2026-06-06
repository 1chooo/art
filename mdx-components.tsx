import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@/i18n/navigation";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { FileTree } from "@/components/mdx/file-tree";
import { GapDemo } from "@/components/mdx/gap-demo";
import { InlineCode, inlineCodeClass } from "@/components/mdx/inline-code";
import { StackCards } from "@/components/mdx/stack-cards";
import { Step, Steps } from "@/components/mdx/steps";
import { TagDemoWrapper } from "@/components/mdx/tag-demo-wrapper";

function MdxLink({
  href,
  children,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  if (href?.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxImg(props: ComponentPropsWithoutRef<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      className="border-border my-8 h-auto max-w-full rounded-sm border"
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    CodeBlock,
    FileTree,
    GapDemo,
    InlineCode,
    StackCards,
    Step,
    Steps,
    TagDemo: TagDemoWrapper,
    h1: (props) => (
      <h1
        {...props}
        className="font-(family-name:--font-serif-display) mb-6 mt-10 text-4xl tracking-tight text-ink md:text-5xl"
      />
    ),
    h2: (props) => (
      <h2
        {...props}
        className="font-(family-name:--font-serif-display) mb-4 mt-12 text-2xl tracking-tight text-ink md:text-3xl"
      />
    ),
    h3: (props) => (
      <h3
        {...props}
        className="font-(family-name:--font-serif-display) mb-3 mt-10 text-xl text-ink md:text-2xl"
      />
    ),
    p: (props) => (
      <p
        {...props}
        className="mb-6 text-base leading-relaxed text-ink md:text-lg"
      />
    ),
    a: MdxLink,
    ul: (props) => (
      <ul
        {...props}
        className="mb-6 list-disc space-y-2 pl-6 text-ink md:text-lg"
      />
    ),
    ol: (props) => (
      <ol
        {...props}
        className="mb-6 list-decimal space-y-2 pl-6 text-ink md:text-lg"
      />
    ),
    li: (props) => <li {...props} className="leading-relaxed" />,
    blockquote: (props) => (
      <blockquote
        {...props}
        className="border-border font-(family-name:--font-serif-display) my-8 border-l-2 pl-6 text-lg italic text-ink-muted md:text-xl"
      />
    ),
    hr: () => <hr className="border-border my-14 border-t" />,
    code: (props) => <code {...props} className={inlineCodeClass} />,
    pre: (props) => (
      <pre
        {...props}
        className="border-border bg-surface text-ink font-mono my-8 overflow-x-auto rounded-lg border p-4 text-sm leading-relaxed"
      />
    ),
    table: (props) => (
      <div className="my-8 overflow-x-auto">
        <table
          {...props}
          className="w-full border-collapse text-left text-sm md:text-base"
        />
      </div>
    ),
    th: (props) => (
      <th
        {...props}
        className="border-border text-ink border-b px-3 py-2 font-medium"
      />
    ),
    td: (props) => (
      <td
        {...props}
        className="border-border text-ink-muted border-b px-3 py-2"
      />
    ),
    img: MdxImg,
  };
}
