import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NaverArticle, ClusterResult } from '../model/type';

export function useCluster() {
  return useMutation<ClusterResult, Error, NaverArticle[]>({
    mutationFn: async (items: NaverArticle[]) => {
      const { data } = await axios.post('/api/cluster', { items });
      return data;
    },
    onError: (error) => {
      console.error('클러스터링 중 오류 발생:', error);
    },
  });
}
