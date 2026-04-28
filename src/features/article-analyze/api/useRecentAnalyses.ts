// features/article-analyze/api/useRecentAnalyses.ts
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';

export function useRecentAnalyses() {
  return useQuery({
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
