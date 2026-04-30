'use client';

import { useState } from 'react';
import {
  ArticleList,
  PasteSection,
  RecentAnalysesList,
  SearchBar,
  ToggleButton,
  useAnalyzeModel,
  useArticleSelectState,
  useSearchModel,
  useSelectedNewsStore,
} from '@/features/article-analyze';
import { Loader, Toast } from '@/shared';

export function ArticleAnalyzeSection() {
  const [query, setQuery] = useState('');
  const { selectedNews } = useSelectedNewsStore();

  const { mode, toggleMode, handleSearch, searchData, isSuccess, isLoading } =
    useSearchModel();

  const {
    pasteText,
    handlePasteTextChange,
    toggleArticle,
    handleReset,
    canCompare,
    canAnalyze,
  } = useArticleSelectState(mode, query, selectedNews);

  const {
    handleCompare,
    handleAnalyze,
    isPending: isAnalyzePending,
    isAnalyzeError,
  } = useAnalyzeModel(mode, query);

  return (
    <form onSubmit={(e) => handleSearch(e, query)} className="mb-6">
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* A/B 토글 — 검색 결과 있을 때만 표시 */}
      {isSuccess && !isLoading && (
        <ToggleButton mode={mode} toggleMode={toggleMode} />
      )}

      {isLoading && <Loader />}

      {!isLoading && isSuccess && !!searchData?.groups?.length && (
        <ArticleList
          articles={searchData}
          selected={selectedNews}
          onToggle={toggleArticle}
          canCompare={canCompare}
          handleCompare={() => handleCompare(selectedNews, query)}
          isPending={isAnalyzePending}
          isAnalyzeError={isAnalyzeError}
        />
      )}

      <PasteSection
        value={pasteText}
        onChange={handlePasteTextChange}
        canAnalyze={canAnalyze}
        onReset={handleReset}
        handleAnalyze={() => handleAnalyze(pasteText)}
      />

      <RecentAnalysesList />

      <Toast />
    </form>
  );
}
