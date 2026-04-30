'use client';
import { useAnalyze } from '../api/useAnalyze';
import { useExperimentLog } from '../api/useExperimentLog';
import { getSourceName } from '../lib/newspaperFormat';
import { stripHtml } from '../lib/striphtml';
import type { NewsItem, SearchMode } from './type';

export function useAnalyzeModel(mode: SearchMode, query: string) {
  const { mutate: analyze, isPending, isError: isAnalyzeError } = useAnalyze();
  const { log } = useExperimentLog();

  const handleCompare = (selected: NewsItem[], keyword: string) => {
    log({ mode, query, eventType: 'compare_start' }); // 추가
    analyze({
      keyword,
      articles: selected.map((article) => ({
        title: stripHtml(article.title),
        content: stripHtml(article.description),
        source: getSourceName(article.originallink),
        originallink: article.originallink,
      })),
    });
  };

  const handleAnalyze = (pasteText: string) => {
    analyze({
      keyword: '붙여넣기 분석',
      articles: [{ title: '', content: pasteText }],
    });
  };

  return {
    handleCompare,
    handleAnalyze,
    isPending,
    isAnalyzeError,
  };
}
