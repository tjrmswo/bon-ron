'use client';

import { PasteSectionProps } from '../model/type';

export function PasteSection({
  value,
  onChange,
  canAnalyze,
  onReset,
  handleAnalyze,
}: PasteSectionProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">또는 본문 직접 분석</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="기사 본문을 여기에 붙여넣으세요…"
        className="w-full min-h-27.5 px-4 py-3 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none leading-relaxed"
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onReset}
          type="button"
          className="h-9 px-4 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          type="button"
          className={`h-9 px-5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            canAnalyze
              ? 'bg-emerald-600 text-white hover:bg-emerald-600/70'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          단독 분석
        </button>
      </div>
    </>
  );
}
