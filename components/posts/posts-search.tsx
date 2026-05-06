"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";

type Props = {
  placeholder: string;
  defaultQuery: string;
};

export function PostsSearch({ placeholder, defaultQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultQuery);
  const [prevDefaultQuery, setPrevDefaultQuery] = useState(defaultQuery);
  const [, startTransition] = useTransition();
  const mounted = useRef(false);
  const spRef = useRef(searchParams);

  if (defaultQuery !== prevDefaultQuery) {
    setPrevDefaultQuery(defaultQuery);
    setValue(defaultQuery);
  }

  useLayoutEffect(() => {
    spRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(spRef.current.toString());
      const trimmed = value.trim();
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 350);
    return () => window.clearTimeout(id);
  }, [value, pathname, router]);

  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="border-border bg-surface text-ink placeholder:text-ink-muted focus:border-accent focus:ring-accent/30 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 md:text-base"
      />
    </label>
  );
}
