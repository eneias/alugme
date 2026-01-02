export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  order: number;
}

export const banners: Banner[] = [
  {
    id: "1",
    title: "Encontre seu novo lar",
    subtitle: "Descubra casas e apartamentos incríveis para alugar nas melhores localizações do Brasil",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    linkUrl: "/",
    active: true,
    order: 1
  },
  {
    id: "2",
    title: "Apartamentos de luxo",
    subtitle: "Conheça nossos imóveis premium com acabamento de alto padrão",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    linkUrl: "/",
    active: true,
    order: 2
  },
  {
    id: "3",
    title: "Casas com piscina",
    subtitle: "Aproveite o verão em imóveis com área de lazer completa",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
    linkUrl: "/",
    active: true,
    order: 3
  }
];
