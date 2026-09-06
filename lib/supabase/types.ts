/**
 * Types de la base — miroir de `supabase/migrations/`.
 *
 * Écrits à la main tant que `supabase gen types` n'a pas de projet distant à
 * interroger. Toute modification du schéma doit être répercutée ici : c'est ce
 * qui permet aux clients d'être typés sans un seul `any`.
 */

export type Json =
  string | number | boolean | null | { [key: string]: Json } | Json[];

export type Domain = "saas" | "product" | "finance" | "agency";
export type Plan = "free" | "pro" | "agency";
export type AssetPath =
  "standard" | "enhanced" | "sequence" | "video" | "advanced";

type PromptTemplateRow = {
  id: string;
  slug: string;
  domain: Domain;
  art_direction: string;
  title: string;
  summary: string;
  body: string;
  variables: Json;
  tags: string[];
  asset_paths: Json;
  complexity: string;
  is_active: boolean;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_renews_at: string | null;
  created_at: string;
};

type UsageCounterRow = {
  user_id: string;
  period_start: string;
  generations_used: number;
};

type GenerationRow = {
  id: string;
  user_id: string | null;
  idea: string;
  template_id: string | null;
  domain: string | null;
  extracted_vars: Json | null;
  asset_path: string | null;
  output: string;
  tokens_in: number | null;
  tokens_out: number | null;
  /** Qui a décidé du domaine : la pill de l'utilisateur, ou le classifieur. */
  project_type_source: "user" | "classifier" | null;
  /** Re-sélections de template déjà consommées sur cette génération (§7.2). */
  template_reselects: number;
  created_at: string;
};

type FaqArticleRow = {
  slug: string;
  category: string;
  question: string;
  answer_md: string;
  position: number;
  is_active: boolean;
};

export type Database = {
  public: {
    Tables: {
      prompt_templates: {
        Row: PromptTemplateRow;
        Insert: Omit<PromptTemplateRow, "id" | "created_at"> &
          Partial<Pick<PromptTemplateRow, "id" | "created_at">>;
        Update: Partial<PromptTemplateRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Pick<ProfileRow, "id"> & Partial<Omit<ProfileRow, "id">>;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      usage_counters: {
        Row: UsageCounterRow;
        Insert: Pick<UsageCounterRow, "user_id" | "period_start"> &
          Partial<Pick<UsageCounterRow, "generations_used">>;
        Update: Partial<UsageCounterRow>;
        Relationships: [];
      };
      generations: {
        Row: GenerationRow;
        Insert: Pick<GenerationRow, "idea" | "output"> &
          Partial<Omit<GenerationRow, "idea" | "output">>;
        Update: Partial<GenerationRow>;
        Relationships: [];
      };
      /**
       * Conversations et messages — migration 20260812090000.
       *
       * `Insert` n'expose que ce que l'application écrit réellement.
       * `messages.user_id` y figure parce que PostgREST exige la colonne
       * `not null`, mais le trigger `messages_set_owner` la réécrit avec le
       * propriétaire réel de la conversation : la valeur envoyée par le client
       * n'a aucune autorité.
       *
       * Aucun `Update` sur `messages` : la table n'accorde pas ce privilège, et
       * le type le reflète plutôt que de promettre une opération que la base
       * refuse.
       */
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; title: string; id?: string };
        Update: Partial<{ title: string; user_id: string }>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          generation_id: string | null;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          generation_id?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      generation_files: {
        Row: {
          id: string;
          user_id: string;
          generation_id: string | null;
          filename: string;
          mime_type: string;
          byte_size: number;
          extracted_text: string;
          truncated: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          filename: string;
          mime_type: string;
          byte_size: number;
          extracted_text: string;
          truncated?: boolean;
          generation_id?: string | null;
        };
        /*
         * Seul `generation_id` est modifiable, et le type le dit aussi. Le
         * GRANT SQL est borné à cette colonne ; laisser le type plus large
         * ferait écrire du code que la base refuserait à l'exécution.
         */
        Update: { generation_id: string | null };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          consent: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          message: string;
          consent: boolean;
        };
        Update: Partial<{
          name: string;
          email: string;
          message: string;
          consent: boolean;
        }>;
        Relationships: [];
      };
      stripe_events: {
        Row: { id: string; type: string; processed_at: string };
        Insert: { id: string; type: string; processed_at?: string };
        Update: Partial<{ id: string; type: string; processed_at: string }>;
        Relationships: [];
      };
      faq_articles: {
        Row: FaqArticleRow;
        Insert: Pick<
          FaqArticleRow,
          "slug" | "category" | "question" | "answer_md"
        > &
          Partial<Pick<FaqArticleRow, "position" | "is_active">>;
        Update: Partial<FaqArticleRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      /** Incrément atomique du compteur du mois courant. Voir §7. */
      consume_generation: {
        Args: { p_user_id: string };
        Returns: number;
      };
      /**
       * Réservation atomique d'une génération (§7). Renvoie le nouveau
       * compteur, ou `null` si la limite est atteinte — aucun appel modèle ne
       * doit partir dans ce cas.
       */
      reserve_generation: {
        Args: { p_user_id: string; p_limit: number };
        /** `{ used, period }`, ou `null` si la limite est atteinte. */
        Returns: { used: number; period: string } | null;
      };
      /**
       * Rend une unité réservée quand la génération échoue. Renvoie le nouveau
       * compteur, ou `null` s'il n'y avait rien à rendre.
       */
      refund_generation: {
        Args: { p_user_id: string; p_period_start: string };
        Returns: number | null;
      };
      /**
       * Consommation atomique d'une re-sélection de template (§7.2).
       * Renvoie le nouveau compteur, ou `null` si le budget est épuisé ou si
       * la génération n'appartient pas à l'utilisateur.
       */
      consume_template_reselect: {
        Args: { p_generation_id: string; p_user_id: string; p_max: number };
        Returns: number | null;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
