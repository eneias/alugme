import { useQuery } from '@tanstack/react-query';
import { banners, Banner } from '@/data/banners';

export type { Banner };

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => banners.filter(b => b.active).sort((a, b) => a.order - b.order),
  });
};
