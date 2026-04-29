import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NewsResultProps, UseNewsSearchOptions } from '../model/type';

export function useNewsSearch(options?: UseNewsSearchOptions) {
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
    },
    onError: (error) => {
      console.error('뉴스 검색 중 오류 발생:', error);
    },
  });
}
