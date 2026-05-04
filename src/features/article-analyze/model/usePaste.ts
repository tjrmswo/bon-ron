import React, { useState } from 'react';
import { useAnalyze } from './useAnalyze';
import { useSelectedNewsStore } from './useSelectedNewsStore';

export function usePaste() {
  const { mutate: analyze } = useAnalyze();
  const [pasteText, setPasteText] = useState<string>('');
  const { clearNews } = useSelectedNewsStore();

  const handleReset = () => {
    clearNews();
    setPasteText('');
  };

  const canAnalyze = pasteText.trim().length > 0;

  const handleAnalyze = (pasteText: string) => {
    analyze({
      keyword: '붙여넣기 분석',
      articles: [{ title: '', content: pasteText }],
    });
  };

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAnalyze(pasteText);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPasteText(e.target.value);

  return {
    canAnalyze,
    onReset: handleReset,
    onSubmit,
    onChange,
    pasteText,
  };
}
