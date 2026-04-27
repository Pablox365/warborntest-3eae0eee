import { useEffect, useState } from "react";
import { Cookie, Shield, BarChart3, Megaphone, X } from "lucide-react";

const CONSENT_KEY = "warborn_cookie_consent";
const CONSENT_VERSION = 1;

export interface CookiePreferences {
  essential: true; // always true
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: number;
}

export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (parsed.version !== CONSENT_VERSION) return null;
    // Expire after 12 months
    if (Date.now() - parsed.timestamp > 365 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
};

const savePreferences = (prefs: Omit<CookiePreferences, "version" | "timestamp" | "essential">) => {
  const full: CookiePreferences = {
    essential: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    version: CONSENT_VERSION,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent("warborn:cookie-consent", { detail: full }));
};

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookiePreferences();
    if (!existing) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    savePreferences({ analytics: true, marketing: true });
    setShow(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    savePreferences({ analytics: false, marketing: false });
    setShow(false);
    setShowSettings(false);
  };

  const saveCustom = () => {
    savePreferences({ analytics, marketing });
    setShow(false);
    setShowSettings(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 animate-slide-in-bottom">
        <div className="max-w-5xl mx-auto bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl glow-green-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm tracking-wider mb-1 text-foreground">COOKIES & PRIVACIDAD</h3>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">
                  Usamos cookies para que Warborn funcione, medir el rendimiento de la comunidad y mejorar tu experiencia.
                  Puedes aceptar, rechazar o configurar tus preferencias.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2.5 text-[10px] font-heading tracking-[0.15em] rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                CONFIGURAR
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2.5 text-[10px] font-heading tracking-[0.15em] rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                SOLO ESENCIALES
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2.5 text-[10px] font-heading tracking-[0.15em] rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all font-bold btn-military"
              >
                ACEPTAR TODAS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-background/85 backdrop-blur-md animate-fade-scale"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="relative bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSettings(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Cookie className="w-6 h-6 text-primary" />
              <h2 className="font-heading text-lg tracking-wider">PREFERENCIAS DE COOKIES</h2>
            </div>
            <p className="text-xs font-body text-muted-foreground mb-6">
              Selecciona qué tipos de cookies aceptas. Las esenciales son obligatorias para el funcionamiento del sitio.
            </p>

            <div className="space-y-3">
              {/* Essential */}
              <div className="bg-secondary/30 border border-border rounded-xl p-4 opacity-80">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-heading text-xs tracking-wider">ESENCIALES</span>
                  </div>
                  <span className="text-[9px] font-heading tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">SIEMPRE ACTIVO</span>
                </div>
                <p className="text-[11px] font-body text-muted-foreground">Necesarias para la sesión, autenticación y funciones básicas. No se pueden desactivar.</p>
              </div>

              {/* Analytics */}
              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="font-heading text-xs tracking-wider">ANALÍTICAS</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalytics(!analytics)}
                    aria-label="Toggle analytics"
                    className={`relative w-10 h-5 rounded-full transition-colors ${analytics ? "bg-primary" : "bg-secondary border border-border"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${analytics ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
                <p className="text-[11px] font-body text-muted-foreground">Nos ayudan a entender cómo usas Warborn para mejorar el sitio (visitas, mods más vistos, errores).</p>
              </div>

              {/* Marketing */}
              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    <span className="font-heading text-xs tracking-wider">MARKETING</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMarketing(!marketing)}
                    aria-label="Toggle marketing"
                    className={`relative w-10 h-5 rounded-full transition-colors ${marketing ? "bg-primary" : "bg-secondary border border-border"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${marketing ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
                <p className="text-[11px] font-body text-muted-foreground">Permiten mostrar contenido relevante de partners y eventos comunitarios.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-3 text-[10px] font-heading tracking-[0.15em] rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                RECHAZAR TODAS
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-4 py-3 text-[10px] font-heading tracking-[0.15em] rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
              >
                GUARDAR SELECCIÓN
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-3 text-[10px] font-heading tracking-[0.15em] rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all font-bold btn-military"
              >
                ACEPTAR TODAS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;