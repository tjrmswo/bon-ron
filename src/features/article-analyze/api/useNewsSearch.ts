import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NewsResultProps, UseNewsSearchOptions } from '../model/type';
import { useToastMessageStore } from '../model/useToastMessageStore';

export function useNewsSearch(options?: UseNewsSearchOptions) {
  const { setToastMessage } = useToastMessageStore();

  return useMutation<NewsResultProps, Error, string>({
    mutationFn: async (query: string) => {
      const { data } = await axios.get('/api/search', {
        params: { search: query },
      });

      // console.log('뉴스 검색 결과:', data);
      return data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      if(!data.items || data.items.length === 0) {
        setToastMessage('검색 결과가 없습니다.');
      }
    },
    onError: (error) => {
      console.error('뉴스 검색 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        setToastMessage('뉴스 검색 중 오류가 발생했습니다.');
      }
    },
  });
}
