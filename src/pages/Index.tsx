import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import ComboSection from "@/components/ComboSection";
import CartDrawer from "@/components/CartDrawer";
import UrgentOfferPopup from "@/components/UrgentOfferPopup";
import { products } from "@/data/products";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryBar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {!activeCategory && !searchQuery && <ComboSection />}

      <main className="container py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">
            {activeCategory
              ? `${filteredProducts.length} produto${filteredProducts.length !== 1 ? "s" : ""}`
              : "Todos os produtos"}
          </h2>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-4xl mb-2">😕</p>
            <p className="font-bold">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <CartDrawer />
      <UrgentOfferPopup />
    </div>
  );
};

export default Index;
