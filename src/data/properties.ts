export interface Property {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
  reviews: number;
  createdAt: string;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  // Campos do antigo LandlordProperty
  landlordId?: string;
  bankAccountId?: string;
  availability: 'available' | 'rented' | 'maintenance';
}

export const properties: Property[] = [
  {
    id: "1",
    name: "Casa Vista Mar",
    address: "Servidão Servulo Chagas, 239",
    neighborhood: "Campeche",
    city: "Florianópolis - SC, 88063-560",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    rating: 4.8,
    reviews: 42,
    createdAt: "2024-12-01",
    description: "Linda casa com vista panorâmica para o mar. Ambiente espaçoso e arejado, perfeito para famílias. Localizada em área nobre com fácil acesso a praias, restaurantes e comércio. Acabamento de alto padrão com piscina privativa.",
    amenities: ["Piscina", "Churrasqueira", "Garagem", "Wi-Fi", "Ar condicionado", "Vista mar"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800"
    ],
    coordinates: { lat: -22.9714, lng: -43.1823 },
    landlordId: 'landlord-1',
    bankAccountId: 'bank-1',
    availability: 'rented'
  },
  {
    id: "2",
    name: "Apartamento Moderno Centro",
    address: "Av. Paulista, 1500",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    price: 3200,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    rating: 4.5,
    reviews: 28,
    createdAt: "2024-11-15",
    description: "Apartamento moderno e sofisticado no coração de São Paulo. Design contemporâneo com acabamentos de primeira linha. Próximo ao metrô, shoppings e vida cultural da cidade.",
    amenities: ["Academia", "Portaria 24h", "Elevador", "Wi-Fi", "Ar condicionado"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"
    ],
    coordinates: { lat: -23.5614, lng: -46.6565 },
    landlordId: 'landlord-2',
    bankAccountId: 'bank-2',
    availability: 'available'
  },
  {
    id: "3",
    name: "Cobertura Jardins",
    address: "Rua Oscar Freire, 800",
    neighborhood: "Jardins",
    city: "São Paulo",
    price: 8500,
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    rating: 4.9,
    reviews: 56,
    createdAt: "2024-12-10",
    description: "Cobertura duplex exclusiva nos Jardins. Terraço com vista 360° da cidade, piscina privativa e churrasqueira. Decoração assinada por arquiteto renomado.",
    amenities: ["Piscina privativa", "Terraço", "Churrasqueira", "4 vagas", "Wi-Fi", "Ar condicionado", "Home office"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
      "https://images.unsplash.com/photo-1600566752734-2a0cd66c42c4?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
    ],
    coordinates: { lat: -23.5665, lng: -46.6720 },
    landlordId: 'landlord-1',
    bankAccountId: 'bank-1',
    availability: 'rented'
  },
  {
    id: "4",
    name: "Casa Colonial Histórica",
    address: "Rua do Carmo, 45",
    neighborhood: "Pelourinho",
    city: "Salvador",
    price: 2800,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    rating: 4.7,
    reviews: 34,
    createdAt: "2024-10-20",
    description: "Charmosa casa colonial restaurada no coração do Pelourinho. Mantém características históricas com conforto moderno. Perfeita para quem busca cultura e história.",
    amenities: ["Varanda", "Cozinha equipada", "Wi-Fi", "Ar condicionado"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
      "https://images.unsplash.com/photo-1600566752734-2a0cd66c42c4?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
    ],
    coordinates: { lat: -12.9730, lng: -38.5108 },
    landlordId: undefined,
    bankAccountId: undefined,
    availability: 'available'
  },
  {
    id: "5",
    name: "Loft Industrial",
    address: "Rua Augusta, 2000",
    neighborhood: "Consolação",
    city: "São Paulo",
    price: 2500,
    bedrooms: 1,
    bathrooms: 1,
    area: 60,
    rating: 4.6,
    reviews: 22,
    createdAt: "2024-11-25",
    description: "Loft estilo industrial com pé direito alto e grandes janelas. Decoração moderna e descolada, ideal para jovens profissionais. Localização privilegiada na Augusta.",
    amenities: ["Rooftop", "Lavanderia", "Bike rack", "Wi-Fi", "Pet friendly"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800"
    ],
    coordinates: { lat: -23.5534, lng: -46.6564 },
    landlordId: 'landlord-1',
    bankAccountId: 'bank-1',
    availability: 'available'
  },
  {
    id: "6",
    name: "Apartamento Beira-Mar",
    address: "Av. Beira Mar, 500",
    neighborhood: "Meireles",
    city: "Fortaleza",
    price: 3800,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    rating: 4.8,
    reviews: 48,
    createdAt: "2024-12-05",
    description: "Apartamento de frente para o mar com vista deslumbrante. Varanda gourmet, decoração praiana elegante. A poucos passos da praia de Meireles.",
    amenities: ["Vista mar", "Varanda gourmet", "Piscina", "Academia", "Wi-Fi", "Ar condicionado"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
      "https://images.unsplash.com/photo-1600566752734-2a0cd66c42c4?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
    ],
    coordinates: { lat: -3.7253, lng: -38.4973 },
    landlordId: 'landlord-1',
    bankAccountId: 'bank-1',
    availability: 'available'
  }
];

export const neighborhoods = [...new Set(properties.map(p => p.neighborhood))];
