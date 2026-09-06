import type { Metadata } from "next";

import { GenerateRunner } from "@/components/generate/generate-runner";

export const metadata: Metadata = { title: "Generating" };

/**
 * Écran de génération — plein écran, aucun chrome marketing, fond uni.
 *
 * L'idée est reprise depuis `sessionStorage` : elle a survécu à l'éventuel
 * passage par l'authentification (README §3.3).
 */
export default function GeneratePage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-5">
      <GenerateRunner />
    </div>
  );
}
