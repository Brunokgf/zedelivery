import { useState, useEffect } from "react";
import { X, Clock, ShoppingCart, Flame, Zap, PartyPopper } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const OFFER_COMBOS = [
  { id: 31, discountPrice: 69.90, originalPrice: 209.90 },
  { id: 33, discountPrice: 179.90, originalPrice: 216.00 },
  { id: 34, discountPrice: 129.90, originalPrice: 156.00 },
  { id: 108, discountPrice: 549.90, originalPrice: 680.00 },
  { id: 109, discountPrice: 299.90, originalPrice: 360.00 },
  { id: 110, discountPrice: 189.90, originalPrice: 222.00 },
  { id: 111, discountPrice: 899.90, originalPrice: 1050.00 },
  { id: 112, discountPrice: 1299.90, originalPrice: 1600.00 },
];

interface UrgentOfferPopupProps {
  onClose?: () => void;
}

const UrgentOfferPopup = ({ onClose }: UrgentOfferPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const { addItem } = useCart();

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("urgent-offer-seen");
    if (!alreadySeen) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.minutes === 0 && prev.seconds === 0) return prev;
        if (prev.seconds === 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("urgent-offer-seen", "true");
    onClose?.();
  };

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const offer = OFFER_COMBOS.find((o) => o.id === productId);
      addItem({ ...product, price: offer?.discountPrice ?? product.price });
      setAddedItems((prev) => new Set(prev).add(productId));
    }
  };

  if (!isOpen) return null;

  const isUrgent = timeLeft.minutes < 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scale-in">
        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
          background: 'linear-gradient(135deg, hsl(var(--ze-orange) / 0.3), hsl(var(--destructive) / 0.3), hsl(var(--ze-orange) / 0.3))',
          filter: 'blur(20px)',
          transform: 'scale(1.02)',
          zIndex: -1,
        }} />

        {/* Header with gradient */}
        <div className="relative overflow-hidden px-5 py-5 text-center" style={{
          background: 'linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--ze-orange)))',
        }}>
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-4 text-lg animate-bounce" style={{ animationDelay: '0s' }}>🔥</div>
            <div className="absolute top-3 right-6 text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>⚡</div>
            <div className="absolute bottom-2 left-1/4 text-sm animate-bounce" style={{ animationDelay: '0.6s' }}>💥</div>
            <div className="absolute bottom-1 right-1/4 text-sm animate-bounce" style={{ animationDelay: '0.9s' }}>🎉</div>
          </div>

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">
              Oferta Exclusiva
            </span>
            <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-lg">
            ATÉ <span className="text-yellow-300 text-3xl">67% OFF</span>
          </h2>
          <p className="text-white/80 text-xs mt-1 font-semibold">
            Combos especiais por tempo limitado!
          </p>
        </div>

        {/* Countdown - pulsing when urgent */}
        <div className={`flex items-center justify-center gap-3 px-4 py-3 ${isUrgent ? 'bg-destructive/10' : 'bg-secondary'}`}>
          <Clock className={`h-4 w-4 ${isUrgent ? 'text-destructive animate-pulse' : 'text-secondary-foreground'}`} />
          <span className={`text-sm font-bold ${isUrgent ? 'text-destructive' : 'text-secondary-foreground'}`}>
            {isUrgent ? '⚠️ Quase acabando!' : 'Oferta expira em'}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span className={`rounded-lg px-2.5 py-1 text-xl font-black tabular-nums shadow-inner ${
                isUrgent 
                  ? 'bg-destructive text-destructive-foreground animate-pulse' 
                  : 'bg-secondary-foreground text-secondary'
              }`}>
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5">min</span>
            </div>
            <span className={`text-xl font-black animate-pulse ${isUrgent ? 'text-destructive' : 'text-secondary-foreground'}`}>:</span>
            <div className="flex flex-col items-center">
              <span className={`rounded-lg px-2.5 py-1 text-xl font-black tabular-nums shadow-inner ${
                isUrgent 
                  ? 'bg-destructive text-destructive-foreground animate-pulse' 
                  : 'bg-secondary-foreground text-secondary'
              }`}>
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5">seg</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-4 space-y-3 max-h-[45vh] overflow-y-auto">
          {OFFER_COMBOS.map((offer) => {
            const product = products.find((p) => p.id === offer.id);
            if (!product) return null;
            const discount = Math.round(
              ((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100
            );
            const wasAdded = addedItems.has(offer.id);

            return (
              <div
                key={offer.id}
                className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 border border-border hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="relative h-14 w-14 flex-shrink-0 rounded-lg bg-background overflow-hidden shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-1"
                  />
                  <span className="absolute -top-0.5 -left-0.5 rounded-br-xl bg-destructive px-2 py-0.5 text-[10px] font-black text-destructive-foreground shadow-sm">
                    -{discount}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-card-foreground truncate">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground line-through">
                      R$ {offer.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-lg font-black text-ze-green">
                      R$ {offer.discountPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(offer.id)}
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full shadow-lg transition-all ${
                    wasAdded
                      ? 'bg-ze-green text-white scale-110'
                      : 'bg-primary text-primary-foreground hover:scale-110 hover:shadow-xl'
                  }`}
                >
                  {wasAdded ? (
                    <PartyPopper className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="border-t border-border px-5 py-4 bg-muted/20">
          <button
            onClick={() => {
              OFFER_COMBOS.forEach((o) => handleAddToCart(o.id));
              setTimeout(handleClose, 800);
            }}
            className="w-full rounded-full py-3 font-black text-sm text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--ze-orange)), hsl(var(--destructive)))',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Flame className="h-4 w-4" />
              QUERO TODOS OS COMBOS
              <Flame className="h-4 w-4" />
            </span>
          </button>
          <button
            onClick={handleClose}
            className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Não, obrigado — fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrgentOfferPopup;
