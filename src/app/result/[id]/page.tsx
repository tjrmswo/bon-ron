import {
  AnalysisDescription,
  Article,
  ArticleAnalyzeHeader,
  buildAnalysisMetadata,
  buildCommonKeywords,
  buildRows,
  getAnalysisById,
  PairAnalysisSection,
  ResultPageProps,
  SingleAnalysisSection,
} from '@/features/article-analyze';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Toast } from '@/shared';
import { AnalysisDisclaimer } from '@/entities/analysis';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getAnalysisById(id);

  if (!data) return { title: '본론' };

  return buildAnalysisMetadata(data.keyword, data.articles, id);
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const { data, error } = await getAnalysisById(id);

  if (error || !data) notFound();

  const articles: Article[] = data.articles;
  const keyword: string = data.keyword ?? '';
  const sources = articles.map((a) => a.source).join(' vs ');
  const rows = buildRows(articles);
  const commonKeywords = buildCommonKeywords(articles);

  return (
    <div className="min-h-screen bg-[#f5f4f0] px-4 py-6 font-sans">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {/* 네비 */}
        <ArticleAnalyzeHeader keyword={keyword} id={id} sources={sources} />

        {/* 면책 문구 */}
        <AnalysisDisclaimer />

        {/* 키워드 + 요약 */}
        <AnalysisDescription articles={articles} keyword={keyword} />

        {/* 분석 결과 */}
        {articles.length === 1 ? (
          <SingleAnalysisSection articles={articles} />
        ) : (
          <PairAnalysisSection
            articles={articles}
            commonKeywords={commonKeywords}
            rows={rows}
          />
        )}
      </div>

      <Toast />
    </div>
  );
}
