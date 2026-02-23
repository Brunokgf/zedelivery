import { ShoppingCart, MapPin } from "lucide-react";
import logo from "@/assets/ze-delivery-logo.jpg";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { totalItems, setIsOpen } = useCart();

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
          <MapPin className="h-4 w-4 text-ze-orange" />
          <span className="hidden sm:inline">Loja a <strong className="text-primary-foreground">1,2km</strong> de você</span>
          <span className="sm:hidden text-xs">📍 1,2km</span>
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
