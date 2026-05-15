import type { Metadata } from 'next';
import { Article } from '../model/type';


export function buildAnalysisMetadata(
  keyword: string,
  articles: Article[],
  id: string,
): Metadata {
  const sources = articles
    .map((a: { source: string }) => a.source)
    .join(' vs ');

  return {
    title: `${keyword} — ${sources} | 본론`,
    description: `같은 사건, 다른 시각. ${keyword}에 대한 ${sources} 보도 방식을 비교합니다.`,
    openGraph: {
      title: `${keyword} — ${sources}`,
      description: `같은 사건, 다른 시각 | 본론`,
      url: `https://bon-ron.vercel.app/result/${id}`,
      images: ['/og-image.png'],
      siteName: '본론',
      type: 'article',
    },
  };
}
