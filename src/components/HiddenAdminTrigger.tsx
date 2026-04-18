import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Admin from "@/pages/Admin";

const HiddenAdminTrigger = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de administración"
      className="fixed inset-0 z-[200] bg-background overflow-y-auto"
    >
      <button
        onClick={() => setOpen(false)}
        aria-label="Cerrar panel admin"
        className="fixed top-3 right-3 z-[210] w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border hover:bg-destructive/10 hover:border-destructive transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <Admin />
    </div>
  );
};

export default HiddenAdminTrigger;
