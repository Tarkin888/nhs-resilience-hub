
CREATE TABLE public.diagnostics_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_code text NOT NULL,
  provider_name text NOT NULL,
  period text NOT NULL,
  test_code text NOT NULL,
  test_description text,
  total_waiting_list integer DEFAULT 0,
  waiting_6_plus_weeks integer DEFAULT 0,
  percent_6_plus_weeks numeric(5,2) DEFAULT 0,
  total_activity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (provider_code, period, test_code)
);

ALTER TABLE public.diagnostics_cache DISABLE ROW LEVEL SECURITY;

CREATE TABLE public.diagnostics_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_code text NOT NULL,
  provider_name text NOT NULL,
  period text NOT NULL,
  total_waiting_list integer,
  total_waiting_6_plus_weeks integer,
  percent_6_plus_weeks numeric(5,2),
  total_activity integer,
  status text,
  fetched_at timestamptz DEFAULT now(),
  UNIQUE (provider_code, period)
);

ALTER TABLE public.diagnostics_summary DISABLE ROW LEVEL SECURITY;
