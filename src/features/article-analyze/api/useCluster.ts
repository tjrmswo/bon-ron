import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NaverArticle, ClusterResult } from '../model/type';
import { useToastMessageStore } from '../model/useToastMessageStore';

export function useCluster() {
  const { setToastMessage } = useToastMessageStore();

  return useMutation<ClusterResult, Error, NaverArticle[]>({
    mutationFn: async (items: NaverArticle[]) => {
      const { data } = await axios.post('/api/cluster', { items });
      return data;
    },
    onError: (error) => {
      console.error('클러스터링 중 오류 발생:', error);
      if(axios.isAxiosError(error)) {
        setToastMessage('클러스터링 중 오류가 발생했습니다.');
      }
    },
  });
}
