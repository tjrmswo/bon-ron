'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AnalyzeParams } from './type';
import { useToastMessageStore } from './useToastMessageStore';

export function useAnalyze() {
  const router = useRouter();
  const { setToastMessage } = useToastMessageStore();

  return useMutation({
    mutationFn: async (params: AnalyzeParams) => {
      const { data } = await axios.post('/api/analyze', params);
      return data;
    },
    onSuccess: ({ id }) => {
      router.push(`/result/${String(id)}`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setToastMessage('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  });
}
