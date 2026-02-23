import { categories } from "@/data/products";

type Props = {
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
};

const CategoryBar = ({ activeCategory, onSelectCategory }: Props) => {
  return (
    <section className="sticky top-[60px] z-40 bg-background border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
              activeCategory === null
                ? "bg-secondary text-secondary-foreground shadow-md scale-105"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            🔥 Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-secondary text-secondary-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
