'use client';

import { useState } from 'react';
import {
  ArticleList,
  PasteSection,
  RecentAnalysesList,
  SearchBar,
  useAnalyzeModel,
  useArticleSelectState,
  useSearchModel,
  useSelectedNewsStore,
} from '@/features/article-analyze';
import { Loader, Toast } from '@/shared';

export function ArticleAnalyzeSection() {
  const [query, setQuery] = useState('');
  const { selectedNews } = useSelectedNewsStore();

  const {
    mode,
    toggleMode,
    handleSearch,
    searchData,
    isSuccess,
    isLoading,
    isSearchError,
  } = useSearchModel();

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
    toastMessage,
    clearToast,
    isAnalyzeError,
  } = useAnalyzeModel(mode, query);

  return (
    <form onSubmit={(e) => handleSearch(e, query)} className="mb-6">
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* A/B 토글 — 검색 결과 있을 때만 표시 */}
      {isSuccess && !isLoading && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            {mode === 'cluster' ? '📋 목록 보기' : '🗂 그룹 보기'}
          </button>
        </div>
      )}
      {isLoading && <Loader />}

      {/* 검색 실패 */}
      {!isLoading && isSearchError && (
        <p className="text-sm text-gray-400 text-center py-8">
          검색 중 오류가 발생했습니다. 다시 시도해주세요.
        </p>
      )}

      {/* 빈 결과 */}
      {!isLoading && isSuccess && !searchData?.groups?.length && (
        <p className="text-sm text-gray-400 text-center py-8">
          검색 결과가 없습니다.
        </p>
      )}

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

      {toastMessage && <Toast message={toastMessage} onClose={clearToast} />}
    </form>
  );
}
