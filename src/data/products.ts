import heinekenImg from "@/assets/products/heineken.jpg";
import brahmaImg from "@/assets/products/brahma.jpg";
import cocaColaImg from "@/assets/products/coca-cola.jpg";
import absolutImg from "@/assets/products/absolut.jpg";
import skolImg from "@/assets/products/skol.jpg";
import vinhoImg from "@/assets/products/vinho.jpg";
import geloImg from "@/assets/products/gelo.jpg";
import coronaImg from "@/assets/products/corona.jpg";
import budweiserImg from "@/assets/products/budweiser.jpg";
import stellaImg from "@/assets/products/stella.jpg";
import smirnoffImg from "@/assets/products/smirnoff.jpg";
import jackDanielsImg from "@/assets/products/jack-daniels.jpg";
import guaranaImg from "@/assets/products/guarana.jpg";
import redbullImg from "@/assets/products/redbull.jpg";
import spriteImg from "@/assets/products/sprite.jpg";
import aguaImg from "@/assets/products/agua.jpg";
import redLabelImg from "@/assets/products/red-label.jpg";
import cavalinhoImg from "@/assets/products/cavalinho.jpg";
import casilleroImg from "@/assets/products/casillero.jpg";
import vinhoRoseImg from "@/assets/products/vinho-rose.jpg";
import vinhoBrancoImg from "@/assets/products/vinho-branco.jpg";
import monsterImg from "@/assets/products/monster.jpg";
import tntImg from "@/assets/products/tnt.jpg";
import fantaImg from "@/assets/products/fanta.jpg";
import pepsiImg from "@/assets/products/pepsi.jpg";
import schweppesImg from "@/assets/products/schweppes.jpg";
import tanquerayImg from "@/assets/products/tanqueray.jpg";
import geloLimaoImg from "@/assets/products/gelo-limao.jpg";
import geloMorangoImg from "@/assets/products/gelo-morango.jpg";
import geloMaracujaImg from "@/assets/products/gelo-maracuja.jpg";
import comboCervejaImg from "@/assets/products/combo-cerveja.jpg";
import comboDestiladoImg from "@/assets/products/combo-destilado.jpg";
import comboVinhoImg from "@/assets/products/combo-vinho.jpg";
import comboEnergiaImg from "@/assets/products/combo-energia.jpg";

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
  { id: "combos", label: "🎉 Combos", emoji: "🎉" },
  { id: "cervejas", label: "🍺 Cervejas", emoji: "🍺" },
  { id: "destilados", label: "🥃 Destilados", emoji: "🥃" },
  { id: "vinhos", label: "🍷 Vinhos", emoji: "🍷" },
  { id: "refrigerantes", label: "🥤 Refrigerantes", emoji: "🥤" },
  { id: "energeticos", label: "⚡ Energéticos", emoji: "⚡" },
  { id: "agua", label: "💧 Água", emoji: "💧" },
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
  {
    id: 9,
    name: "Budweiser Lata 350ml",
    description: "Cerveja Budweiser lata gelada",
    price: 3.99,
    image: budweiserImg,
    category: "cervejas",
  },
  {
    id: 10,
    name: "Stella Artois 275ml",
    description: "Cerveja Stella Artois Long Neck",
    price: 6.49,
    image: stellaImg,
    category: "cervejas",
    tag: "Premium",
  },
  {
    id: 11,
    name: "Smirnoff Ice 275ml",
    description: "Bebida mista Smirnoff Ice Original",
    price: 7.49,
    image: smirnoffImg,
    category: "destilados",
  },
  {
    id: 12,
    name: "Jack Daniel's 750ml",
    description: "Whiskey Jack Daniel's Old No.7",
    price: 119.90,
    image: jackDanielsImg,
    category: "destilados",
    tag: "Premium",
  },
  {
    id: 13,
    name: "Guaraná Antarctica 350ml",
    description: "Refrigerante Guaraná Antarctica lata",
    price: 3.49,
    image: guaranaImg,
    category: "refrigerantes",
  },
  {
    id: 14,
    name: "Red Bull 250ml",
    description: "Energético Red Bull lata",
    price: 9.99,
    image: redbullImg,
    category: "energeticos",
    tag: "Mais vendido",
  },
  {
    id: 15,
    name: "Sprite 2L",
    description: "Refrigerante Sprite 2 litros",
    price: 8.49,
    image: spriteImg,
    category: "refrigerantes",
  },
  {
    id: 16,
    name: "Água Mineral 1,5L",
    description: "Água mineral sem gás 1,5 litros",
    price: 2.99,
    image: aguaImg,
    category: "agua",
  },
  {
    id: 17,
    name: "Red Label 750ml",
    description: "Whisky Johnnie Walker Red Label",
    price: 89.90,
    image: redLabelImg,
    category: "destilados",
    tag: "Mais vendido",
  },
  {
    id: 18,
    name: "Cavalinho 1L",
    description: "Cachaça Cavalinho tradicional",
    price: 12.90,
    image: cavalinhoImg,
    category: "destilados",
  },
  {
    id: 19,
    name: "Casillero del Diablo 750ml",
    description: "Vinho tinto chileno Cabernet Sauvignon",
    price: 39.90,
    image: casilleroImg,
    category: "vinhos",
    tag: "Premium",
  },
  {
    id: 20,
    name: "Vinho Rosé 750ml",
    description: "Vinho rosé suave e refrescante",
    price: 29.90,
    image: vinhoRoseImg,
    category: "vinhos",
  },
  {
    id: 21,
    name: "Vinho Branco Chardonnay 750ml",
    description: "Vinho branco seco Chardonnay",
    price: 34.90,
    image: vinhoBrancoImg,
    category: "vinhos",
  },
  {
    id: 22,
    name: "Monster Energy 473ml",
    description: "Energético Monster Energy verde",
    price: 8.99,
    image: monsterImg,
    category: "energeticos",
  },
  {
    id: 23,
    name: "TNT Energy 473ml",
    description: "Energético TNT lata",
    price: 5.99,
    image: tntImg,
    category: "energeticos",
    tag: "Promoção",
  },
  {
    id: 24,
    name: "Fanta Laranja 350ml",
    description: "Refrigerante Fanta Laranja lata",
    price: 3.49,
    image: fantaImg,
    category: "refrigerantes",
  },
  {
    id: 25,
    name: "Pepsi 350ml",
    description: "Refrigerante Pepsi lata gelada",
    price: 3.29,
    image: pepsiImg,
    category: "refrigerantes",
    tag: "Promoção",
  },
  {
    id: 26,
    name: "Schweppes Citrus 350ml",
    description: "Água tônica Schweppes Citrus lata",
    price: 4.49,
    image: schweppesImg,
    category: "refrigerantes",
  },
  {
    id: 27,
    name: "Tanqueray 750ml",
    description: "Gin Tanqueray London Dry",
    price: 99.90,
    image: tanquerayImg,
    category: "destilados",
    tag: "Premium",
  },
  {
    id: 28,
    name: "Gelo Sabor Limão 1kg",
    description: "Gelo de sabor limão refrescante",
    price: 7.99,
    image: geloLimaoImg,
    category: "extras",
    tag: "Novidade",
  },
  {
    id: 29,
    name: "Gelo Sabor Morango 1kg",
    description: "Gelo de sabor morango para drinks",
    price: 7.99,
    image: geloMorangoImg,
    category: "extras",
    tag: "Novidade",
  },
  {
    id: 30,
    name: "Gelo Sabor Maracujá 1kg",
    description: "Gelo de sabor maracujá tropical",
    price: 7.99,
    image: geloMaracujaImg,
    category: "extras",
    tag: "Novidade",
  },
  {
    id: 31,
    name: "Combo Churrasco 🍺",
    description: "6 Heineken 600ml + 1 Gelo 3kg — economize R$12!",
    price: 41.90,
    image: comboCervejaImg,
    category: "combos",
    tag: "Economia",
  },
  {
    id: 32,
    name: "Combo Festa 🎉",
    description: "1 Absolut 750ml + 1 Coca 2L + 1 Gelo 3kg",
    price: 79.90,
    image: comboDestiladoImg,
    category: "combos",
    tag: "Mais vendido",
  },
  {
    id: 33,
    name: "Combo Vinho & Queijo 🍷",
    description: "1 Vinho Tinto + 1 Vinho Branco — noite especial",
    price: 54.90,
    image: comboVinhoImg,
    category: "combos",
    tag: "Premium",
  },
  {
    id: 34,
    name: "Combo Energia Total ⚡",
    description: "2 Red Bull 250ml + 2 Monster 473ml",
    price: 34.90,
    image: comboEnergiaImg,
    category: "combos",
    tag: "Economia",
  },
];
