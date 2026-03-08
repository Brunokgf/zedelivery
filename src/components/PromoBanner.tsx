import { useState, useEffect } from "react";
import { ShoppingCart, Flame, Clock, ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const PROMO_ITEMS = [
  { id: 31, promoPrice: 69.90, originalPrice: 209.90 },
  { id: 33, promoPrice: 99.90, originalPrice: 299.90 },
  { id: 34, promoPrice: 79.90, originalPrice: 219.90 },
];

const PromoBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 59 });
  const { addItem } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) return prev;
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    const promo = PROMO_ITEMS.find((o) => o.id === productId);
    if (product && promo) {
      addItem({ ...product, price: promo.promoPrice });
    }
  };

  const currentPromo = PROMO_ITEMS[currentSlide];
  const currentProduct = products.find((p) => p.id === currentPromo.id);
  const discount = Math.round(
    ((currentPromo.originalPrice - currentPromo.promoPrice) / currentPromo.originalPrice) * 100
  );

  if (!currentProduct) return null;

  return (
    <section className="container py-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-border shadow-lg"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--ze-dark)), hsl(var(--secondary)))',
        }}
      >
        {/* Top ribbon */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-ze-orange animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-ze-orange">
              Oferta do dia
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Product image */}
          <div className="relative flex-shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-white/10 overflow-hidden">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="h-full w-full object-contain p-2 transition-all duration-500"
            />
            <span className="absolute top-1 left-1 rounded-lg bg-destructive px-1.5 py-0.5 text-[10px] font-black text-destructive-foreground">
              -{discount}%
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black text-secondary-foreground truncate">
              {currentProduct.name}
            </h3>
            <p className="text-xs text-secondary-foreground/60 truncate mb-2">
              {currentProduct.description}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-secondary-foreground/50 line-through">
                R$ {currentPromo.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-ze-green">
                R$ {currentPromo.promoPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button
              onClick={() => handleAdd(currentPromo.id)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-primary-foreground shadow-md hover:scale-105 active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--ze-orange)), hsl(var(--destructive)))',
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Aproveitar
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-2 pb-3">
          {PROMO_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide
                  ? 'w-6 bg-ze-orange'
                  : 'w-1.5 bg-secondary-foreground/30 hover:bg-secondary-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
