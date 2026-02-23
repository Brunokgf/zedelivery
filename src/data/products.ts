import heinekenImg from "@/assets/products/heineken.jpg";
import brahmaImg from "@/assets/products/brahma.jpg";
import cocaColaImg from "@/assets/products/coca-cola.jpg";
import absolutImg from "@/assets/products/absolut.jpg";
import skolImg from "@/assets/products/skol.jpg";
import vinhoImg from "@/assets/products/vinho.jpg";
import geloImg from "@/assets/products/gelo.jpg";
import coronaImg from "@/assets/products/corona.jpg";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
};

export const categories = [
  { id: "cervejas", label: "🍺 Cervejas", emoji: "🍺" },
  { id: "destilados", label: "🥃 Destilados", emoji: "🥃" },
  { id: "vinhos", label: "🍷 Vinhos", emoji: "🍷" },
  { id: "refrigerantes", label: "🥤 Refrigerantes", emoji: "🥤" },
  { id: "extras", label: "🧊 Extras", emoji: "🧊" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Heineken 600ml",
    description: "Cerveja Heineken Long Neck gelada",
    price: 7.99,
    image: heinekenImg,
    category: "cervejas",
    tag: "Mais vendido",
  },
  {
    id: 2,
    name: "Brahma Latão 473ml",
    description: "Cerveja Brahma latão gelada",
    price: 4.49,
    image: brahmaImg,
    category: "cervejas",
  },
  {
    id: 3,
    name: "Skol Lata 350ml",
    description: "Cerveja Skol lata gelada",
    price: 3.29,
    image: skolImg,
    category: "cervejas",
    tag: "Promoção",
  },
  {
    id: 4,
    name: "Corona Extra 355ml",
    description: "Cerveja Corona Extra Long Neck",
    price: 8.99,
    image: coronaImg,
    category: "cervejas",
  },
  {
    id: 5,
    name: "Absolut Vodka 750ml",
    description: "Vodka Absolut Original",
    price: 69.90,
    image: absolutImg,
    category: "destilados",
    tag: "Premium",
  },
  {
    id: 6,
    name: "Vinho Tinto Suave 750ml",
    description: "Vinho tinto suave de mesa",
    price: 24.90,
    image: vinhoImg,
    category: "vinhos",
  },
  {
    id: 7,
    name: "Coca-Cola 2L",
    description: "Refrigerante Coca-Cola 2 litros",
    price: 9.99,
    image: cocaColaImg,
    category: "refrigerantes",
  },
  {
    id: 8,
    name: "Gelo 3kg",
    description: "Saco de gelo 3 quilos",
    price: 5.99,
    image: geloImg,
    category: "extras",
  },
];
