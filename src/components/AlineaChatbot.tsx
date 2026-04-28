import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import alineaLogo from "@/assets/alinea-logo.png";
import { trackEvent } from "@/lib/tracking";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/warborn-chatbot`;

const SUGGESTIONS = [
  "¿Diferencia entre Normal y Hardcore?",
  "¿Cómo me uno al servidor?",
  "¿Qué mods recomendáis?",
  "¿Qué es Milsim?",
];

const AlineaChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    trackEvent("chatbot_message", { section: "alinea-chatbot" });

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (resp.status === 429) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "⏱️ Estoy recibiendo muchas preguntas. Prueba en unos segundos." },
        ]);
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "⚠️ Me he quedado sin créditos AI. Avisa a un admin." },
        ]);
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let started = false;
      let streamDone = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          if (!started) return prev; // shouldn't happen
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              if (!started) {
                started = true;
                setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
              }
              upsert(content);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("chatbot error", e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Algo falló. Inténtalo de nuevo o pásate por Discord." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t || loading) return;
    if (t.length > 500) return;
    send(t);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) trackEvent("chatbot_opened", { section: "alinea-chatbot" });
        }}
        aria-label="Abrir chat con Alinea AI"
        className={`fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-all duration-300 ${
          open ? "rotate-90" : ""
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-[79] sm:inset-x-auto sm:right-5 sm:w-[380px] sm:bottom-24 animate-scale-in">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden flex flex-col max-h-[70vh]">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/40">
              <div className="relative">
                <img src={alineaLogo} alt="Alinea AI" className="w-9 h-9" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm tracking-wider">ALINEA AI</p>
                <p className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Asistente Warborn · Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-background/60 rounded-lg px-3 py-2.5 text-sm font-body">
                    ¡Hola! Soy <span className="text-primary font-semibold">Alinea</span>, la asistente de Warborn. Pregúntame lo que quieras sobre los servidores, mods, Milsim o cómo unirte.
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-heading tracking-wider text-muted-foreground">SUGERENCIAS</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full text-left text-xs font-body px-3 py-2 rounded-md border border-border/60 bg-background/30 hover:bg-primary/10 hover:border-primary/40 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-body ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/60 text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-1 prose-a:text-primary">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-background/60 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground font-body">Alinea está escribiendo…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-background/40 p-2.5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                maxLength={500}
                placeholder="Pregunta lo que quieras…"
                className="flex-1 bg-background/80 border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground rounded-lg w-10 h-10 flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AlineaChatbot;