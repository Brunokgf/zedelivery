import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const mansaoIds = [89, 90, 91, 92, 93, 94];

const MansaoMarombaSection = () => {
  const mansaoProducts = products.filter((p) => mansaoIds.includes(p.id));

  if (mansaoProducts.length === 0) return null;

  return (
    <section className="container py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <h2 className="text-lg font-black text-foreground">Mansão Maromba</h2>
        <span className="ml-2 rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-white animate-pulse">
          EM ALTA
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mansaoProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MansaoMarombaSection;
