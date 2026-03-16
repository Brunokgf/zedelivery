import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/products";

type Props = {
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
};

const CategoryBar = ({ activeCategory, onSelectCategory }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const element = scrollRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 8);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 8);
  };

  const handleScrollBy = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollState();

    const element = scrollRef.current;
    if (!element) return;

    const onResize = () => updateScrollState();

    element.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", onResize);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="sticky top-[60px] z-40 border-b border-border bg-background">
      <div className="container py-3">
        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Ver categorias anteriores"
              onClick={() => handleScrollBy("left")}
              className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              aria-label="Ver próximas categorias"
              onClick={() => handleScrollBy("right")}
              className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide md:px-12"
            onWheel={(event) => {
              if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.currentTarget.scrollLeft += event.deltaY;
              }
            }}
          >
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
      </div>
    </section>
  );
};

export default CategoryBar;
