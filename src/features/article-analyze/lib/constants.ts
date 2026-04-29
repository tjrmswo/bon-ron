export const TONE_STYLE: Record<string, { bg: string; text: string; border: string }> =
  {
    '단정 서술': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    '주장 인용': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    '해석·전망': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
  };

  export const ANALYSIS_ROW_KEYS = [
    { key: 'WHO', field: 'who' as const, isTone: false },
    { key: 'WHAT', field: 'what' as const, isTone: false },
    { key: 'WHY', field: 'why' as const, isTone: false },
    { key: 'WHEN', field: 'when_where' as const, isTone: false },
    { key: 'TONE', field: 'tone' as const, isTone: true },
  ] as const;
