import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const displayIds = [91, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];

const MansaoMarombaSection = () => {
  const displayProducts = products.filter((p) => displayIds.includes(p.id));

  if (displayProducts.length === 0) return null;

  return (
    <section className="container py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <h2 className="text-lg font-black text-foreground">Mansão Maromba</h2>
        <span className="ml-2 rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-white animate-pulse">
          EM ALTA
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MansaoMarombaSection;
