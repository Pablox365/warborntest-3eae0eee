
CREATE TABLE public.bug_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  discord_id text NOT NULL,
  server text NOT NULL DEFAULT 'normal',
  report_type text NOT NULL DEFAULT 'bug',
  title text NOT NULL,
  description text NOT NULL,
  severity text,
  category text,
  ai_summary text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bug reports"
ON public.bug_reports FOR INSERT
WITH CHECK (
  player_name IS NOT NULL AND length(player_name) BETWEEN 1 AND 60 AND
  discord_id IS NOT NULL AND length(discord_id) BETWEEN 1 AND 60 AND
  title IS NOT NULL AND length(title) BETWEEN 1 AND 120 AND
  description IS NOT NULL AND length(description) BETWEEN 5 AND 2000 AND
  server IN ('normal','hardcore','milsim','web','otros') AND
  report_type IN ('bug','sugerencia','queja','otro')
);

CREATE POLICY "Admins can view bug reports"
ON public.bug_reports FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bug reports"
ON public.bug_reports FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bug reports"
ON public.bug_reports FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_bug_reports_updated_at
BEFORE UPDATE ON public.bug_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_bug_reports_created_at ON public.bug_reports (created_at DESC);
CREATE INDEX idx_bug_reports_status ON public.bug_reports (status);

CREATE TABLE public.page_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  path text,
  section text,
  session_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
ON public.page_events FOR INSERT
WITH CHECK (
  event_type IS NOT NULL AND length(event_type) BETWEEN 1 AND 60
);

CREATE POLICY "Admins can view events"
ON public.page_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete events"
ON public.page_events FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_page_events_created_at ON public.page_events (created_at DESC);
CREATE INDEX idx_page_events_type ON public.page_events (event_type);
CREATE INDEX idx_page_events_path ON public.page_events (path);
