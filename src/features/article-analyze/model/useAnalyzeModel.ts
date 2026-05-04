'use client';
import { useAnalyze } from './useAnalyze';
import { logExperiment } from '../api/logExperiment';
import { getSourceName } from '../lib/newspaperFormat';
import { stripHtml } from '../lib/striphtml';
import type { NewsItem, SearchMode } from './type';

export function useAnalyzeModel(mode: SearchMode, query: string) {
  const { mutate: analyze, isPending, isError: isAnalyzeError } = useAnalyze();
  const { log } = logExperiment();

  const handleCompare = async (selected: NewsItem[], keyword: string) => {
    log({ mode, query, eventType: 'compare_start' });

    const articles = await Promise.all(
      selected.map(async (article) => ({
        title: stripHtml(article.title),
        content: stripHtml(article.description),
        source: await getSourceName(article.originallink),
        originallink: article.originallink,
      })),
    );

    analyze({ keyword, articles });
  };

  return {
    handleCompare,
    isPending,
    isAnalyzeError,
  };
}
