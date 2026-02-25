import { ShoppingCart, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/ze-delivery-logo.jpg";
import { useCart } from "@/context/CartContext";

const STORES = [
  { lat: -23.5505, lng: -46.6333 },
  { lat: -23.5630, lng: -46.6543 },
  { lat: -23.5475, lng: -46.6361 },
  { lat: -22.9068, lng: -43.1729 },
  { lat: -22.9707, lng: -43.1824 },
  { lat: -19.9167, lng: -43.9345 },
  { lat: -25.4284, lng: -49.2733 },
  { lat: -30.0346, lng: -51.2177 },
  { lat: -12.9714, lng: -38.5124 },
  { lat: -8.0476, lng: -34.8770 },
  { lat: -15.7975, lng: -47.8919 },
  { lat: -3.7172, lng: -38.5433 },
  { lat: -3.1190, lng: -60.0217 },
  { lat: -16.6869, lng: -49.2648 },
  { lat: -2.5297, lng: -44.2825 },
  { lat: -1.4558, lng: -48.5024 },
  { lat: -5.7945, lng: -35.2110 },
  { lat: -20.3155, lng: -40.3128 },
  { lat: -27.5954, lng: -48.5480 },
  { lat: -10.9472, lng: -37.0731 },
  { lat: -9.6658, lng: -35.7353 },
  { lat: -7.1195, lng: -34.8450 },
  { lat: -5.0892, lng: -42.8019 },
  { lat: -2.5046, lng: -44.2826 },
  { lat: -10.5105, lng: -48.3603 },
  { lat: -20.4697, lng: -54.6201 },
  { lat: -15.6014, lng: -56.0979 },
  { lat: 2.8195, lng: -60.6714 },
  { lat: -0.0346, lng: -51.0694 },
  { lat: -9.9747, lng: -67.8100 },
  { lat: -8.7612, lng: -63.9004 },
  { lat: -22.9099, lng: -47.0626 },
  { lat: -23.3045, lng: -51.1696 },
  { lat: -21.1767, lng: -47.8208 },
  { lat: -22.3285, lng: -49.0718 },
];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestStoreDistance(lat: number, lng: number) {
  return Math.min(...STORES.map(s => haversineDistance(lat, lng, s.lat, s.lng)));
}

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const km = nearestStoreDistance(pos.coords.latitude, pos.coords.longitude);
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
