
ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS moderation_reason text;

ALTER TABLE public.feedback_replies
  ADD COLUMN IF NOT EXISTS moderation_reason text;
