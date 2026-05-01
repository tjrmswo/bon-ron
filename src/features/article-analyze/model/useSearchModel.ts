'use client';

import { useNewsSearch } from '../api/useNewsSearch';
import { useCluster } from '../api/useCluster';
import { useState } from 'react';
import { SearchMode } from './type';
import { useSelectedNewsStore } from './useSelectedNewsStore';

export function useSearchModel() {
  const [mode, setMode] = useState<SearchMode>('cluster');
  const [query, setQuery] = useState('');
  const { clearNews } = useSelectedNewsStore();

  const {
    mutate: cluster,
    data: clusterData,
    isPending: isClustering,
  } = useCluster();

  const {
    mutate: searchNews,
    data: searchData,
    isPending: isSearching,
  } = useNewsSearch({
    onSuccess: (data) => {
      if (mode === 'cluster') {
        cluster(data.items);
        clearNews();
      }
    },
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    if (query.trim()) searchNews(query);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'cluster' ? 'flat' : 'cluster'));
  };

  // flat 모드: 검색 결과를 ClusterResult 형태로 래핑해서 반환
  const flatAsCluster = searchData
    ? { groups: [{ topic: '검색 결과', articles: searchData.items }] }
    : undefined;
  
  
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };

  return {
    mode,
    toggleMode,
    handleSearch,
    searchData: mode === 'cluster' ? clusterData : flatAsCluster,
    isSuccess: mode === 'cluster' ? !!clusterData : !!flatAsCluster,
    isLoading: isSearching || (mode === 'cluster' && isClustering),
    query,
    handleQuery,
  };
}
