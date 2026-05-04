import Link from 'next/link';
import React from 'react';
import { CopyButton } from './CopyButton';
import { KakaoShareButton } from '@/shared';

export function ArticleAnalyzeHeader({ keyword, sources, id }: { keyword: string; sources: string; id: string }) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← 검색으로
      </Link>
      <div className="text-xl font-medium tracking-tight relative translate-x-6">
        본론
      </div>

      <div className="flex flex-row gap-2">
        <CopyButton />
        <KakaoShareButton
          title={`${keyword} — ${sources}`}
          description="같은 사건, 다른 시각 | 본론"
          url={`https://bon-ron.vercel.app/result/${id}`}
        />
      </div>
    </div>
  );
}
