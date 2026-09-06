import type { Metadata } from "next";

import { BuildPage } from "@/components/build/build-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Prompt Builder",
  description:
    "Describe your idea. Yelhaa analyses it, structures it and hands you a production-ready prompt.",
  path: "/build",
});

export default function BuildRoute() {
  return <BuildPage />;
}
