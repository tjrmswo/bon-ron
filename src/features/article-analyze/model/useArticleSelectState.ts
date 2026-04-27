'use client';
import { useState } from 'react';
import type { NewsItem, SearchMode } from './type';
import { useExperimentLog } from '../api/useExperimentLog';
import { useSelectedNewsStore } from './useSelectedNewsStore';

export function useArticleSelectState(
  mode: SearchMode,
  query: string,
  selectedNews: NewsItem[],
) {
  const [pasteText, setPasteText] = useState('');
  const { addNews, clearNews } = useSelectedNewsStore();

  const { log } = useExperimentLog();

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

  const handleReset = () => {
    clearNews();
    setPasteText('');
  };

  const handlePasteTextChange = (text: string) => {
    setPasteText(text);
  };

  return {
    pasteText,
    handlePasteTextChange,
    toggleArticle,
    handleReset,
    canCompare: selectedNews.length === 2,
    canAnalyze: pasteText.trim().length > 0,
  };
}
