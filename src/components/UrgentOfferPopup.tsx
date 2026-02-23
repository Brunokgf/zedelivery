import { useState, useEffect } from "react";
import { X, Clock, ShoppingCart, Flame } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const OFFER_COMBOS = [
  { id: 31, discountPrice: 69.90, originalPrice: 209.90 },
  { id: 33, discountPrice: 99.90, originalPrice: 299.90 },
  { id: 34, discountPrice: 79.90, originalPrice: 219.90 },
];

const UrgentOfferPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const { addItem } = useCart();

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("urgent-offer-seen");
    if (!alreadySeen) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
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
  };

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const offer = OFFER_COMBOS.find((o) => o.id === productId);
      addItem({ ...product, price: offer?.discountPrice ?? product.price });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-destructive px-5 py-4 text-center">
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-full bg-black/20 p-1 text-destructive-foreground hover:bg-black/40 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-destructive-foreground animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-destructive-foreground/80">
              Oferta Relâmpago
            </span>
            <Flame className="h-5 w-5 text-destructive-foreground animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-destructive-foreground">
            COMBOS COM ATÉ 67% OFF
          </h2>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-2 bg-secondary px-4 py-2.5">
          <Clock className="h-4 w-4 text-secondary-foreground" />
          <span className="text-sm font-bold text-secondary-foreground">Acaba em</span>
          <div className="flex items-center gap-1">
            <span className="rounded bg-destructive px-2 py-0.5 text-lg font-black text-destructive-foreground tabular-nums">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-lg font-black text-secondary-foreground animate-pulse">:</span>
            <span className="rounded bg-destructive px-2 py-0.5 text-lg font-black text-destructive-foreground tabular-nums">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {OFFER_COMBOS.map((offer) => {
            const product = products.find((p) => p.id === offer.id);
            if (!product) return null;

            const discount = Math.round(
              ((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100
            );

            return (
              <div
                key={offer.id}
                className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 border border-border"
              >
                <div className="relative h-16 w-16 flex-shrink-0 rounded-lg bg-background overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute -top-1 -left-1 rounded-br-lg bg-destructive px-1.5 py-0.5 text-[10px] font-black text-destructive-foreground">
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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground line-through">
                      R$ {offer.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-base font-black text-ze-green">
                      R$ {offer.discountPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(offer.id)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 text-center bg-muted/30">
          <button
            onClick={handleClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Não, obrigado — fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrgentOfferPopup;
