'use client';

import { Loader, Toast } from '@/shared';
import { useSelectedNewsStore } from '../model/useSelectedNewsStore';
import { useAnalyzeModel } from '../model/useAnalyzeModel';
import { useArticleSelectState } from '../model/useArticleSelectState';
import { useSearchModel } from '../model/useSearchModel';
import { ArticleList } from './ArticleList';
import { PasteSection } from './PasteSection';
import { RecentAnalysesList } from './RecentAnalysesList';
import { SearchBar } from './SearchBar';
import { ToggleButton } from './ToggleButton';

export function ArticleAnalyzeSection() {
  const { selectedNews } = useSelectedNewsStore();

  const {
    mode,
    toggleMode,
    handleSearch,
    searchData,
    isSuccess,
    isLoading,
    query,
    handleQuery,
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
    isAnalyzeError,
  } = useAnalyzeModel(mode, query);

  return (
    <form onSubmit={(e) => handleSearch(e, query)} className="mb-6">
      <SearchBar value={query} onChange={handleQuery} />
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
