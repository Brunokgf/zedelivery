import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ginIds = [96, 97, 100];

const MansaoMarombaSection = () => {
  const ginProducts = products.filter((p) => ginIds.includes(p.id));

  if (ginProducts.length === 0) return null;

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
        {ginProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MansaoMarombaSection;
