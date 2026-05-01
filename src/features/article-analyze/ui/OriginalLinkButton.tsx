'use client';
import { useExperimentLog } from '../api/useExperimentLog';
import { Article } from '../model/type';

export function OriginalLinkButton({ articles }: { articles: Article[] }) {
  const { log } = useExperimentLog();

  return (
    <div className="grid grid-cols-2 gap-3">
      {articles.map((a) => (
        <a
          key={a.source}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            log({
              eventType: 'original_link_click',
              articleLink: a.url,
            })
          }
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-400 hover:bg-gray-50 transition-colors"
        >
          {a.source} 원문 보기 →
        </a>
      ))}
    </div>
  );
}
