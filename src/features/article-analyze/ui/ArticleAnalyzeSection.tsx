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
    searchData,
    isSuccess,
    isLoading,
    query,
    handleSearch,
  } = useSearchModel();

  const { toggleArticle, canCompare } = useArticleSelectState(
    mode,
    query,
    selectedNews,
  );

  const {
    handleCompare,
    isPending: isAnalyzePending,
    isAnalyzeError,
  } = useAnalyzeModel(mode, query);

  return (
    <div className="mb-6">
      <SearchBar onSubmit={handleSearch} />
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

      <PasteSection />

      <RecentAnalysesList />

      <Toast />
    </div>
  );
}
