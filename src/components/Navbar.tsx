import { useState, useEffect } from "react";
import logoImg from "@/assets/logowithtext.png";

const navLinks = [
  { label: "INICIO", href: "#hero" },
  { label: "SERVIDORES", href: "#servers" },
  { label: "MODS", href: "#mods" },
  { label: "ESTADO", href: "#status" },
  { label: "ROADMAP", href: "#roadmap" },
  { label: "MERCH", href: "#merch" },
  { label: "PARTNERS", href: "#partners" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <button onClick={() => handleClick("#hero")} className="flex items-center gap-2">
          <img src={logoImg} alt="Warborn" className="h-8 md:h-10" />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="px-3 py-2 text-xs font-heading tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded text-xs font-heading tracking-widest text-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
            DISCORD
          </a>
          <button
            onClick={() => handleClick("#servers")}
            className="btn-military flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded text-xs font-heading tracking-widest font-bold hover:brightness-110 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            JUGAR
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="bg-background/95 backdrop-blur-md border-t border-border px-4 py-6 flex flex-col gap-2">
          {navLinks.map((l, i) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="text-left px-4 py-3 font-heading tracking-widest text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded transition-all duration-300"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {l.label}
            </button>
          ))}
          <div className="flex gap-3 mt-4 px-4">
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-3 border border-border rounded font-heading tracking-widest text-xs hover:border-primary transition-colors">DISCORD</a>
            <button onClick={() => handleClick("#servers")} className="flex-1 text-center px-4 py-3 bg-primary text-primary-foreground rounded font-heading tracking-widest text-xs font-bold">JUGAR</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
