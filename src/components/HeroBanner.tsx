import { Search } from "lucide-react";

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

const HeroBanner = ({ searchQuery, onSearchChange }: Props) => {
  return (
    <section className="bg-primary py-6 pb-10 px-4 sm:py-8 sm:pb-12">
      <div className="container text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-foreground mb-2">
          Bebida gelada na sua porta 🍻
        </h1>
        <p className="text-primary-foreground/70 mb-5 sm:mb-6 text-base sm:text-lg">
          Entrega rápida • Preço baixo • Sempre gelada
        </p>
        <div className="mx-auto max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border-0 bg-card py-3 pl-12 pr-4 text-card-foreground shadow-lg outline-none ring-2 ring-transparent focus:ring-ze-orange transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
