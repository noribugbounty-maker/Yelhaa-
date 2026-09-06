import { LegalEntityProvider } from "@/components/legal/prose";
import { LEGAL_ENTITY } from "@/lib/config";

/**
 * Lit `LEGAL_*` sur le serveur et les transmet aux documents légaux
 * (composants client). Les valeurs restent hors du dépôt : elles
 * viennent de `.env.local`, jamais recopiées dans le source.
 */
export function LegalEntityGate({ children }: { children: React.ReactNode }) {
  return (
    <LegalEntityProvider entity={LEGAL_ENTITY}>{children}</LegalEntityProvider>
  );
}
