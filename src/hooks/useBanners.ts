import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  order: number;
}

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((b): Banner => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle ?? '',
        imageUrl: b.image_url,
        linkUrl: b.link_url ?? undefined,
        active: b.active ?? true,
        order: b.order ?? 0,
      }));
    },
  });
};
