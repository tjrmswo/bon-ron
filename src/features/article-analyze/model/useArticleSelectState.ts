'use client';
import type { NewsItem, SearchMode } from './type';
import { logExperiment } from '../api/logExperiment';
import { useSelectedNewsStore } from './useSelectedNewsStore';

export function useArticleSelectState(
  mode: SearchMode,
  query: string,
  selectedNews: NewsItem[],
) {
  const { addNews } = useSelectedNewsStore();

  const { log } = logExperiment();

  const toggleArticle = (article: NewsItem) => {
    const isDeselecting = selectedNews.some((a) => a.link === article.link);

    // 오선택 취소 시 로그 기록
    if (isDeselecting) {
      log({
        mode,
        query,
        eventType: 'deselect',
        articleLink: article.link,
      });
    }

    addNews(article);
  };

  return {
    toggleArticle,
    canCompare: selectedNews.length === 2,
  };
}
