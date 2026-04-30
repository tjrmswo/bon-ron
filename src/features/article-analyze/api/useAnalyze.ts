'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AnalyzeParams } from '../model/type';
import { useToastMessageStore } from '../model/useToastMessageStore';

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
        console.log('Axios error:', error.response?.data || error.message);
        setToastMessage('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  });
}
