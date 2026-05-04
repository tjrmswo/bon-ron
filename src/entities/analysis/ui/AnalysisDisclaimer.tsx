import React from 'react';

export function AnalysisDisclaimer() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
      <span className="text-sm">⚠️</span>
      <span className="text-xs text-amber-800 leading-relaxed">
        보도 방식을 분류한 것으로, 내용의 사실 여부와 무관합니다
      </span>
    </div>
  );
}
