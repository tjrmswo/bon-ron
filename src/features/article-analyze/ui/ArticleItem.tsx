import { dateFormat } from "../lib/dateFormat";
import { stripHtml } from "../lib/striphtml";
import { useSourceName } from "../lib/useSourceName";
import { NewsItem } from "../model/type";

export function ArticleItem({
  article,
  isSelected,
  onToggle,
  idx,
}: {
  article: NewsItem;
  isSelected: boolean;
  onToggle: (article: NewsItem, idx: number) => void;
  idx: number;
}) {
  const sourceName = useSourceName(article.originallink);

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
          {sourceName} · {dateFormat(article.pubDate)}
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {stripHtml(article.title)}
        </p>
      </div>
    </button>
  );
}
