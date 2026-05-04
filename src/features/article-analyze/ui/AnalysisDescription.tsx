import { ArticleCard } from './ArticleCard';
import { TONE_STYLE } from '../lib/constants';
import { Article } from '../model/type';

export function AnalysisDescription({
  articles,
  keyword,
}: {
  articles: Article[];
  keyword: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-baseline gap-3 mb-4">
        <div className="text-2xl font-medium tracking-tight">{keyword}</div>
        <div className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
          {articles.length}개 매체 분석
        </div>
      </div>

      {articles.length === 1 ? (
        <div className="text-sm text-gray-500 leading-relaxed">
          {articles[0].title}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {articles.map((a) => {
            const toneStyle =
              TONE_STYLE[a.analysis.tone] ?? TONE_STYLE['단정 서술'];
            return (
              <ArticleCard
                key={a.source}
                source={a.source}
                title={a.title}
                tone={{ ...toneStyle, label: a.analysis.tone }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
