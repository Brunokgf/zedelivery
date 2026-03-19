import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "João Silva",
    city: "São Paulo, SP",
    rating: 5,
    text: "Entrega super rápida! Cerveja chegou gelada em menos de 20 minutos. Melhor app de delivery de bebidas!",
    avatar: "JS",
  },
  {
    name: "Maria Santos",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Preços imbatíveis e os combos são incríveis. Já virou tradição pedir pelo Zé todo fim de semana!",
    avatar: "MS",
  },
  {
    name: "Carlos Oliveira",
    city: "Belo Horizonte, MG",
    rating: 4,
    text: "Sempre peço pelo Zé Delivery. Variedade enorme e o atendimento pelo WhatsApp é nota 10!",
    avatar: "CO",
  },
  {
    name: "Ana Paula",
    city: "Curitiba, PR",
    rating: 5,
    text: "Pedi pra festa e chegou tudo certinho. Os combos com destilados têm o melhor custo-benefício!",
    avatar: "AP",
  },
  {
    name: "Rafael Costa",
    city: "Salvador, BA",
    rating: 5,
    text: "Gelada e rápida! Paguei com PIX e foi instantâneo. Recomendo demais! 🍻",
    avatar: "RC",
  },
  {
    name: "Fernanda Lima",
    city: "Brasília, DF",
    rating: 4,
    text: "Ótima seleção de vinhos e cervejas artesanais. Entrega sempre no prazo, adoro!",
    avatar: "FL",
  },
  {
    name: "Lucas Mendes",
    city: "Campinas, SP",
    rating: 5,
    text: "Melhor experiência de compra! Pedi um combo de whisky pro aniversário e chegou perfeito. Virei cliente fiel! 🥃",
    avatar: "LM",
  },
  {
    name: "Patrícia Rocha",
    city: "Fortaleza, CE",
    rating: 5,
    text: "Incrível a rapidez! Fiz o pedido pelo celular e em 15 minutos já estava na porta. Preços melhores que no mercado!",
    avatar: "PR",
  },
  {
    name: "Thiago Almeida",
    city: "Goiânia, GO",
    rating: 5,
    text: "Churrasco salvo! Faltou cerveja e em minutos o Zé resolveu. Entrega gelada e com sorriso no rosto 🍺",
    avatar: "TA",
  },
  {
    name: "Camila Ferreira",
    city: "Recife, PE",
    rating: 4,
    text: "Sempre tem promoção boa! Os combos de gin são maravilhosos e o pagamento por PIX é instantâneo.",
    avatar: "CF",
  },
  {
    name: "Diego Nascimento",
    city: "Porto Alegre, RS",
    rating: 5,
    text: "Pedi pra assistir o jogo com os amigos e não me arrependi. Tudo chegou geladinho e no prazo! Nota 10! ⚽",
    avatar: "DN",
  },
  {
    name: "Juliana Martins",
    city: "Manaus, AM",
    rating: 5,
    text: "Até aqui no Norte a entrega é rápida! Variedade enorme e os preços são justos. Super recomendo!",
    avatar: "JM",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? "fill-ze-orange text-ze-orange" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewsSection = () => {
  return (
    <section className="bg-muted/30 border-t border-border">
      <div className="container py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-foreground">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Mais de <strong className="text-foreground">50.000</strong> avaliações positivas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {review.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.city}</p>
                </div>
              </div>
              <Stars count={review.rating} />
              <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
