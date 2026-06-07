"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";

export type FileTreeNode = {
  name: string;
  children?: FileTreeNode[];
};

type FileTreeProps = {
  tree: FileTreeNode[];
};

export function FileTree({ tree }: FileTreeProps) {
  return (
    <div className="border-border bg-surface my-8 overflow-hidden rounded-lg border font-mono text-sm">
      {tree.map((node) => (
        <TreeNode key={node.name} node={node} depth={0} defaultOpen />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  depth,
  defaultOpen = false,
}: {
  node: FileTreeNode;
  depth: number;
  defaultOpen?: boolean;
}) {
  const hasChildren = Boolean(node.children?.length);
  const [open, setOpen] = useState(defaultOpen || depth < 1);

  if (!hasChildren) {
    return (
      <div
        className="text-ink-muted flex items-center gap-2 px-3 py-1.5"
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <File className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
        <span>{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-ink hover:bg-paper flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors"
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        aria-expanded={open}
      >
        <ChevronRight
          className={clsx(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            open && "rotate-90",
          )}
          aria-hidden
        />
        {open ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
        )}
        <span className="font-medium">{node.name}</span>
      </button>
      {open
        ? node.children!.map((child) => (
            <TreeNode key={child.name} node={child} depth={depth + 1} />
          ))
        : null}
    </div>
  );
}
