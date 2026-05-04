import React from 'react';
import { TONE_STYLE } from '../lib/constants';
import { Article, Row } from '../model/type';

export function PairAnalysisSection({
  articles,
  rows,
  commonKeywords,
}: {
  articles: Article[];
  commonKeywords: string[];
  rows: Row[];
}) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            항목별 비교
          </div>
        </div>

        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_2fr_2fr] bg-gray-50 border-b border-gray-100">
          <div className="px-4 py-3 border-r border-gray-100" />
          {articles.map((a, i) => {
            const tone = TONE_STYLE[a.analysis.tone] ?? TONE_STYLE['단정 서술'];
            return (
              <div
                key={a.source}
                className={`px-4 py-3 flex items-center gap-2 ${i === 0 ? 'border-r border-gray-100' : ''}`}
              >
                <span className="text-xs font-medium text-gray-700 break-all">
                  {a.source.replace(/\//g, '/\n')}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${tone.bg} ${tone.text} ${tone.border}`}
                >
                  {a.analysis.tone}
                </span>
              </div>
            );
          })}
        </div>

        {/* 행 */}
        {rows.map((row, ri) => (
          <div
            key={row.key}
            className={`grid grid-cols-[1fr_2fr_2fr] ${ri < rows.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="px-4 py-4 bg-gray-50 border-r border-gray-100 flex flex-col justify-start gap-1.5">
              <div className="text-xs font-medium text-gray-400 uppercase ">
                {row.key}
              </div>
              {row.isDiff && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div className="text-xs text-amber-500 font-medium">차이</div>
                </div>
              )}
            </div>

            {articles.map((a, ai) => {
              const tone =
                TONE_STYLE[a.analysis.tone] ?? TONE_STYLE['단정 서술'];
              return (
                <div
                  key={a.source}
                  className={`px-4 py-4 text-sm leading-relaxed text-gray-900
                              ${row.isDiff ? 'bg-amber-50' : 'bg-transparent'}
                              ${ai === 0 ? 'border-r border-gray-100' : ''}
                              ${row.isDiff && ai === 0 ? 'border-l-2 border-l-amber-400' : ''}
                            `}
                >
                  {row.isTone ? (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tone.bg} ${tone.text} ${tone.border}`}
                    >
                      {a.analysis.tone}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      {row.getVal(a) ?? '—'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 비교 키워드 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          키워드
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />두 매체
            공통
          </div>
          <div className="flex flex-wrap gap-2">
            {commonKeywords.map((k) => (
              <div
                key={k}
                className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
              >
                {k}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {articles.map((a) => {
            const unique = a.analysis.keywords.filter(
              (k) => !commonKeywords.includes(k),
            );
            return (
              <div key={a.source}>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {a.source} 단독
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {unique.map((k) => (
                    <div
                      key={k}
                      className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-400"
                    >
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
