import { X, Ticket, MessageCircle, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  sizes: string[] | null;
  image_url: string | null;
}

interface OrderDialogProps {
  product: Product | null;
  onClose: () => void;
}

const DISCORD_URL = "https://discord.gg/sN2CbnNWED";

const OrderDialog = ({ product, onClose }: OrderDialogProps) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-heading text-sm tracking-[0.2em]">CÓMO PEDIR</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            {product.image_url && <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />}
            <div className="min-w-0">
              <span className="font-heading text-xs tracking-wider block truncate">{product.name}</span>
              <span className="block text-base font-heading font-bold text-primary">{product.price}€</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground">INSTRUCCIONES</div>
            <ol className="space-y-3 text-sm font-body text-foreground/90">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-heading text-xs flex items-center justify-center">1</span>
                <span>Únete al <span className="text-primary font-semibold">Discord oficial</span> con el botón de abajo.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-heading text-xs flex items-center justify-center">2</span>
                <span>Ve a la categoría <span className="font-semibold">MERCH</span> y abre un <span className="inline-flex items-center gap-1 text-primary font-semibold"><Ticket className="w-3.5 h-3.5" />ticket</span>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-heading text-xs flex items-center justify-center">3</span>
                <span>Pon como título <span className="font-mono text-xs px-1.5 py-0.5 bg-secondary rounded">Merch — {product.name}</span> y un miembro del staff te atenderá.</span>
              </li>
            </ol>
          </div>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military flex items-center justify-center gap-2 glow-green-sm"
          >
            <MessageCircle className="w-4 h-4" />
            ABRIR TICKET EN DISCORD
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <p className="text-[10px] text-muted-foreground text-center font-body">
            El staff confirmará disponibilidad, talla, pago y envío por Discord.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDialog;
