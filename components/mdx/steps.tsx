"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

type StepProps = {
  title: string;
  children: ReactNode;
};

export function Step({ title, children }: StepProps) {
  return (
    <div data-step-title={title} className="hidden">
      {children}
    </div>
  );
}

type StepsProps = {
  children: ReactNode;
};

export function Steps({ children }: StepsProps) {
  const steps = extractSteps(children);
  const [openIndex, setOpenIndex] = useState(0);

  if (steps.length === 0) return null;

  return (
    <div className="border-border my-8 overflow-hidden rounded-lg border">
      {steps.map((step, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={step.title} className="border-border border-b last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="hover:bg-surface flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
              aria-expanded={isOpen}
            >
              <span className="bg-accent text-paper flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-ink flex-1 text-base font-semibold md:text-lg">
                {step.title}
              </span>
              <ChevronDown
                className={clsx(
                  "text-ink-muted h-5 w-5 shrink-0 transition-transform",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div className="text-ink border-border border-t px-5 pb-5 pt-4 text-base leading-relaxed md:pl-18 [&>p:last-child]:mb-0 [&>p]:mb-4 [&_code]:bg-surface [&_code]:font-mono [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.875em]">
                {step.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function extractSteps(children: ReactNode): { title: string; content: ReactNode }[] {
  const steps: { title: string; content: ReactNode }[] = [];

  const walk = (node: ReactNode) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object" && "props" in node) {
      const props = node.props as StepProps;
      if (props.title !== undefined) {
        steps.push({ title: props.title, content: props.children });
        return;
      }
      if (props.children) walk(props.children);
    }
  };

  walk(children);
  return steps;
}
