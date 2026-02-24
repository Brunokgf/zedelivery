import { ShoppingCart, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/ze-delivery-logo.jpg";
import { useCart } from "@/context/CartContext";

const STORE_LAT = -23.5505;
const STORE_LNG = -46.6333;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const km = haversineDistance(pos.coords.latitude, pos.coords.longitude, STORE_LAT, STORE_LNG);
          setDistance(km);
          setLoading(false);
        },
        () => {
          setDistance(1.2 + Math.random() * 1.3);
          setLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setDistance(1.2 + Math.random() * 1.3);
      setLoading(false);
    }
  }, []);

  const displayDistance = distance ? distance.toFixed(1) : "1,2";

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Zé Delivery"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-xl font-extrabold text-primary-foreground">
            Zé Delivery
          </span>
        </div>

        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
          {loading ? (
            <Loader2 className="h-4 w-4 text-ze-orange animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 text-ze-orange" />
          )}
          <span className="hidden sm:inline">Loja a <strong className="text-primary-foreground">{displayDistance.replace(".", ",")}km</strong> de você</span>
          <span className="sm:hidden text-xs">📍 {displayDistance.replace(".", ",")}km</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition-transform hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ze-orange text-[10px] font-bold text-white animate-bounce-in">
              {totalItems}
            </span>
          )}
          <span className="hidden sm:inline">Carrinho</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
