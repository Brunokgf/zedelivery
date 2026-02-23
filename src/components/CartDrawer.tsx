import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, totalPrice, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-black flex items-center gap-2 text-card-foreground">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho
          </h2>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-30" />
            <p className="font-bold">Carrinho vazio</p>
            <p className="text-sm">Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-contain bg-card"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-card-foreground truncate">{item.name}</p>
                    <p className="text-sm font-black text-ze-green">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold">Total</span>
                <span className="text-xl font-black text-ze-green">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <button className="w-full rounded-full bg-ze-green py-3 text-center font-black text-white shadow-lg hover:opacity-90 transition-opacity">
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
