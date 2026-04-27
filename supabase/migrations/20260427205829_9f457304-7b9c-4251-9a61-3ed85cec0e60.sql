
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS emoji text DEFAULT '📢',
  ADD COLUMN IF NOT EXISTS short_text text,
  ADD COLUMN IF NOT EXISTS detailed_description text,
  ADD COLUMN IF NOT EXISTS starts_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS play_sound boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 0;

-- Backfill: usar el title/content existentes como short_text si están vacíos
UPDATE public.announcements
SET short_text = COALESCE(short_text, title)
WHERE short_text IS NULL;

UPDATE public.announcements
SET detailed_description = COALESCE(detailed_description, content)
WHERE detailed_description IS NULL;

-- Reemplazar la política de SELECT pública para que respete la programación temporal
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;

CREATE POLICY "Anyone can view scheduled active announcements"
ON public.announcements
FOR SELECT
USING (
  active = true
  AND (starts_at IS NULL OR starts_at <= now())
  AND (expires_at IS NULL OR expires_at > now())
);

-- Política adicional para que admins puedan ver TODOS los anuncios (incluso programados a futuro o expirados)
CREATE POLICY "Admins can view all announcements"
ON public.announcements
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at automático
DROP TRIGGER IF EXISTS announcements_updated_at ON public.announcements;
CREATE TRIGGER announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
