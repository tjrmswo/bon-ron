
import { createClient } from '@/shared/lib/supabase/client';

type Mode = 'flat' | 'cluster';
type EventType = 'deselect' | 'compare_start';

export function useExperimentLog() {
  const log = async ({
    mode,
    query,
    eventType,
    articleLink,
  }: {
    mode: Mode;
    query: string;
    eventType: EventType;
    articleLink?: string;
  }) => {
    const supabase = await createClient();

    await supabase.from('experiment_logs').insert({
      mode,
      query,
      event_type: eventType,
      article_link: articleLink ?? null,
    });
  };

  return { log };
}
