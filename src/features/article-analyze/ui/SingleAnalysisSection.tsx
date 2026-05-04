import React from 'react';
import { TONE_STYLE } from '../lib/constants';
import { Article } from '../model/type';

export function SingleAnalysisSection({ articles }: { articles: Article[] }) {
  return (
    <>
      {/* ── 단독 분석 카드 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            분석 결과
          </div>
          {(() => {
            const tone =
              TONE_STYLE[articles[0].analysis.tone] ?? TONE_STYLE['단정 서술'];
            return (
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tone.bg} ${tone.text} ${tone.border} `}
              >
                {articles[0].analysis.tone}
              </span>
            );
          })()}
        </div>

        {/* 행 */}
        {[
          { label: 'WHO', value: articles[0].analysis.who },
          { label: 'WHAT', value: articles[0].analysis.what },
          { label: 'WHY', value: articles[0].analysis.why },
          { label: 'WHEN/WHERE', value: articles[0].analysis.when_where },
        ].map((row, ri, arr) => (
          <div
            key={row.label}
            className={`flex gap-4 px-6 py-4 ${ri < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="w-24 shrink-0 text-xs font-medium text-gray-400 uppercase tracking-widest pt-0.5">
              {row.label}
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {row.value ?? '—'}
            </div>
          </div>
        ))}
      </div>

      {/* ── 단독 키워드 ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          키워드
        </div>
        <div className="flex flex-wrap gap-2">
          {articles[0].analysis.keywords.map((k) => (
            <div
              key={k}
              className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
            >
              {k}
            </div>
          ))}
        </div>
      </div>

      {/* ── 단독 원문 링크 ── */}
      <a
        href={articles[0].url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-400 hover:bg-gray-50 transition-colors"
      >
        {articles[0].source} 원문 보기 →
      </a>
    </>
  );
}
