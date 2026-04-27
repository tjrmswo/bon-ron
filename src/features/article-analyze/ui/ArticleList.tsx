'use client';

import { dateFormat } from '../lib/dateFormat';
import { getSourceName } from '../lib/newspaperFormat';
import { stripHtml } from '../lib/striphtml';
import { ArticleListProps } from '../model/type';
import { Button } from '@/shared';

export function ArticleList({
  articles,
  selected,
  onToggle,
  canCompare,
  handleCompare,
  isPending,
}: ArticleListProps) {
  return (
    <div className="flex flex-col gap-4 mb-7">
      {articles?.groups.map((group, groupIdx) => (
        <div key={groupIdx} className="flex flex-col gap-2">
          {/* 사건명 헤더 */}
          <p className="text-xs font-medium text-gray-500 px-1">
            {group.topic}
          </p>

          {/* 해당 그룹 기사 목록 */}
          {group.articles.map((article, idx) => {
            const isSelected = selected.some((a) => a.link === article.link);
            return (
              <button
                key={idx}
                onClick={() => onToggle(article, idx)}
                type="button"
                className={`flex items-start gap-3 px-4 py-3 border rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-500' : 'border border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    {getSourceName(article.originallink)} ·{' '}
                    {dateFormat(article.pubDate)}
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {stripHtml(article.title)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ))}

      <div className="flex justify-end mt-1">
        <Button
          onClick={handleCompare}
          type="button"
          disabled={isPending || !canCompare}
          className={`h-9 px-5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            isPending || !canCompare
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isPending ? '분석 중...' : `${selected.length}개 기사 비교 분석 →`}
        </Button>
      </div>
    </div>
  );
}
