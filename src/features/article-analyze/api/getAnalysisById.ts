import { createClient } from '@/shared/lib/supabase/server';

export async function getAnalysisById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}
