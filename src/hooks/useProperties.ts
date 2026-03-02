import { useQuery } from '@tanstack/react-query';
import { properties, neighborhoods, Property } from '@/data/properties';

export type { Property };

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => properties,
  });
};

export const useProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => properties.find(p => p.id === id) ?? null,
    enabled: !!id,
  });
};

export const useNeighborhoods = () => {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: async () => neighborhoods,
  });
};
