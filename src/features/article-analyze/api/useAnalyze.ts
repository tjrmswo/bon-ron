'use client'
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AnalyzeParams } from '../model/type';


export function useAnalyze() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: AnalyzeParams) => {
      const { data } = await axios.post('/api/analyze', params);
      return data;
    },
    onSuccess: ({ id }) => {
      router.push(`/result/${String(id)}`);
      
    },
    onError: (error) => {
      console.error('분석 실패:', error);
    },
  });
}
