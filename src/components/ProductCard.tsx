import { Plus, Minus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm border border-border transition-all hover:shadow-lg hover:-translate-y-1">
      {product.tag && (
        <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${
          product.tag === "QUEIMA DE ESTOQUE" ? "bg-destructive animate-pulse" : "bg-ze-orange"
        }`}>
          {product.tag}
        </span>
      )}
      <div className="flex items-center justify-center bg-muted/50 p-4 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-bold text-card-foreground line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-ze-green">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
