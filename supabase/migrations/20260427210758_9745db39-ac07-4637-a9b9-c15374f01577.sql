
CREATE TABLE public.feedback_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_replies_feedback_id ON public.feedback_replies(feedback_id);

ALTER TABLE public.feedback_replies ENABLE ROW LEVEL SECURITY;

-- Validation trigger (length constraints, mirrors validate_feedback)
CREATE OR REPLACE FUNCTION public.validate_feedback_reply()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.name) < 1 OR length(NEW.name) > 60 THEN
    RAISE EXCEPTION 'name length invalid';
  END IF;
  IF length(NEW.message) < 1 OR length(NEW.message) > 500 THEN
    RAISE EXCEPTION 'message length invalid';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER feedback_replies_validate
BEFORE INSERT OR UPDATE ON public.feedback_replies
FOR EACH ROW EXECUTE FUNCTION public.validate_feedback_reply();

CREATE TRIGGER feedback_replies_updated_at
BEFORE UPDATE ON public.feedback_replies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
CREATE POLICY "Anyone can view approved replies"
ON public.feedback_replies FOR SELECT
USING (approved = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit replies"
ON public.feedback_replies FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update replies"
ON public.feedback_replies FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete replies"
ON public.feedback_replies FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
