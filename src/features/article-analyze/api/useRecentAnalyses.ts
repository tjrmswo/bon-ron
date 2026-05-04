import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { RecentAnalysis } from '../model/type';

export function useRecentAnalyses() {
  return useQuery<RecentAnalysis[]>({
    queryKey: ['recent-analyses'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('analyses')
        .select('id, keyword, articles, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
}
