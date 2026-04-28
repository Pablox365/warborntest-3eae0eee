import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "warborn-session-id";
const CONSENT_KEY = "warborn-cookie-consent";

function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  // If user explicitly rejected, don't track. Default = track (anonymous).
  return localStorage.getItem(CONSENT_KEY) !== "rejected";
}

export async function trackEvent(
  event_type: string,
  opts: { path?: string; section?: string; metadata?: Record<string, unknown> } = {},
) {
  if (!hasConsent()) return;
  try {
    await supabase.from("page_events").insert([
      {
        event_type,
        path: opts.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
        section: opts.section ?? undefined,
        session_id: getSessionId() ?? undefined,
        metadata: (opts.metadata ?? {}) as any,
      },
    ]);
  } catch (e) {
    // silent — tracking must never break UI
    console.warn("trackEvent failed", e);
  }
}