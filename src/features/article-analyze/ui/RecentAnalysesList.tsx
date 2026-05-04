'use client';

import Link from 'next/link';
import { useRecentAnalyses } from '../api/useRecentAnalyses';
import { dateFormat } from '../lib/dateFormat';
import { RecentAnalysis } from '../model/type';
import { Loader } from '@/shared';

export function RecentAnalysesList() {
  const { data, isLoading } = useRecentAnalyses();

  if (isLoading) return <Loader />;
  if (!data?.length) return null;

  return (
    <div className="mt-8">
      <p className="text-xs text-gray-400 mb-3">최근 분석</p>
      <div className="flex flex-col gap-2">
        {data.map((item: RecentAnalysis) => {
          if (!item.keyword || item.keyword === '붙여넣기 분석') return null;

          const isCompare = item.articles.length >= 2;
          const sources = item.articles
            .map((a) => a.source)
            .filter(Boolean)
            .join(' vs ');

          return (
            <Link
              key={item.id}
              href={`/result/${item.id}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 shrink-0">
                  {isCompare ? '비교' : '단독'}
                </span>
                <span className="text-sm text-gray-700">
                  {item.keyword}
                  {sources ? ` — ${sources}` : ''}
                </span>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {dateFormat(item.created_at)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
