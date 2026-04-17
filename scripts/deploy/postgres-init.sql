-- CareAI Postgres Init (runs once on fresh container)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- LLM usage tracking — referenced by src/lib/llm/cost-tracker.ts
CREATE TABLE IF NOT EXISTS billing_llm_usage (
  id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider       text NOT NULL,
  model          text NOT NULL,
  input_tokens   integer NOT NULL,
  output_tokens  integer NOT NULL,
  cost_eur       numeric(12,6) NOT NULL,
  tenant_id      uuid,
  user_id        uuid,
  prompt_key     text,
  at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_billing_llm_usage_tenant_at
  ON billing_llm_usage (tenant_id, at DESC);
