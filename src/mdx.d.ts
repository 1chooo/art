import type { ComponentType } from "react";

declare module "*.mdx" {
  export const postMeta: {
    title: string;
    date: string;
    description: string;
    tags?: string[];
  };
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
