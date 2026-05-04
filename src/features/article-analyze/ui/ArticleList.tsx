'use client';
import { ArticleListProps } from '../model/type';
import { Button } from '@/shared';
import { ArticleItem } from './ArticleItem';

export function ArticleList({
  articles,
  selected,
  onToggle,
  canCompare,
  handleCompare,
  isPending,
  isAnalyzeError
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
              <ArticleItem
                key={idx}
                article={article}
                isSelected={isSelected}
                onToggle={onToggle}
                idx={idx}
              />
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

        {isAnalyzeError && (
          <p className="text-xs text-red-400 text-center mt-2">
            분석 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
