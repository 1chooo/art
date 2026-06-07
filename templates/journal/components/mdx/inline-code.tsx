import type { ReactNode } from "react";

const inlineCodeClass =
  "bg-surface text-ink font-(family-name:--font-mono) rounded px-1.5 py-0.5 text-[0.875em]";

export function InlineCode({ children }: { children: ReactNode }) {
  return <code className={inlineCodeClass}>{children}</code>;
}

export { inlineCodeClass };
