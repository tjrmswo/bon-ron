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

      {/* 검색 로더 */}
      {isLoading && <Loader />}

      {/* 검색 결과 */}
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
      {/* 붙여넣기 분석 섹션 — 검색 결과 없을 때 표시 */}
      <PasteSection />

      {/* 최근 분석 리스트 */}
      <RecentAnalysesList />
      {/* 토스트 메세지 */}
      <Toast />
    </div>
  );
}
