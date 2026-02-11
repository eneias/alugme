import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  coordinates: { lat: number; lng: number };
  landlordId: string | null;
  bankAccountId: string | null;
  availability: 'available' | 'rented' | 'maintenance';
}

const mapProperty = (row: any): Property => ({
  id: row.id,
  name: row.name,
  address: row.address,
  neighborhood: row.neighborhood,
  city: row.city,
  price: Number(row.price),
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  area: Number(row.area),
  rating: Number(row.rating ?? 0),
  reviews: row.reviews ?? 0,
  createdAt: row.created_at ?? '',
  description: row.description ?? '',
  amenities: row.amenities ?? [],
  images: row.images ?? [],
  coordinates: { lat: Number(row.lat ?? 0), lng: Number(row.lng ?? 0) },
  landlordId: row.landlord_id,
  bankAccountId: row.bank_account_id,
  availability: row.availability ?? 'available',
});

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProperty);
    },
  });
};

export const useProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProperty(data) : null;
    },
    enabled: !!id,
  });
};

export const useNeighborhoods = () => {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('neighborhood');
      if (error) throw error;
      return [...new Set((data ?? []).map(p => p.neighborhood))];
    },
  });
};
