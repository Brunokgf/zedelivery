import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ComboSection = () => {
  const combos = products.filter((p) => p.category === "combos");

  if (combos.length === 0) return null;

  return (
    <section className="container py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🎉</span>
        <h2 className="text-lg font-black text-foreground">Combos em destaque</h2>
        <span className="ml-2 rounded-full bg-destructive px-2.5 py-0.5 text-[11px] font-bold text-destructive-foreground animate-pulse">
          ECONOMIZE
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {combos.map((combo) => (
          <ProductCard key={combo.id} product={combo} />
        ))}
      </div>
    </section>
  );
};

export default ComboSection;
