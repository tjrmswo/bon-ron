import {
  ANALYSIS_ROW_KEYS,
  Article,
  ArticleCard,
  CopyButton,
  OriginalLinkButton,
  ResultPageProps,
  TONE_STYLE,
} from '@/features/article-analyze';
import { createClient } from '@/shared/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { KakaoShareButton, Toast } from '@/shared';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('analyses')
    .select('keyword, articles')
    .eq('id', id)
    .single();

  if (!data) {
    return { title: '본론' };
  }

  const sources = data.articles
    .map((a: { source: string }) => a.source)
    .join(' vs ');

  return {
    title: `${data.keyword} — ${sources} | 본론`,
    description: `같은 사건, 다른 시각. ${data.keyword}에 대한 ${sources} 보도 방식을 비교합니다.`,
    openGraph: {
      title: `${data.keyword} — ${sources}`,
      description: `같은 사건, 다른 시각 | 본론`,
      url: `https://bon-ron.vercel.app/result/${id}`,
      siteName: '본론',
      type: 'article',
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) notFound();

  const articles: Article[] = data.articles;
  const keyword: string = data.keyword ?? '';

  const commonKeywords = articles[0].analysis.keywords.filter((k) =>
    articles[1]?.analysis.keywords.includes(k),
  );

  // console.log(articles);

  const rows = ANALYSIS_ROW_KEYS.map((row) => ({
    ...row,
    getVal: (a: Article) => a.analysis[row.field],
    isDiff:
      articles[0].analysis[row.field] !== articles[1]?.analysis[row.field],
  }));

  const sources = articles.map((a) => a.source).join(' vs ');

  return (
    <div className="min-h-screen bg-[#f5f4f0] px-4 py-6 font-sans">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {/* 네비 */}
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

        {/* 면책 문구 */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-sm">⚠️</span>
          <span className="text-xs text-amber-800 leading-relaxed">
            보도 방식을 분류한 것으로, 내용의 사실 여부와 무관합니다
          </span>
        </div>

        {/* 키워드 + 요약 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-baseline gap-3 mb-4">
            <div className="text-2xl font-medium tracking-tight">{keyword}</div>
            <div className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
              {articles.length}개 매체 분석
            </div>
          </div>

          {articles.length === 1 ? (
            // 단독 — 제목만 한 줄로
            <div className="text-sm text-gray-500 leading-relaxed">
              {articles[0].title}
            </div>
          ) : (
            // 비교 — 기존 grid 유지
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

        {/* 분석 결과 — articles 수에 따라 분기 */}
        {articles.length === 1 ? (
          <>
            {/* ── 단독 분석 카드 ── */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* 헤더 */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  분석 결과
                </div>
                {(() => {
                  const tone =
                    TONE_STYLE[articles[0].analysis.tone] ??
                    TONE_STYLE['단정 서술'];
                  return (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tone.bg} ${tone.text} ${tone.border} `}
                    >
                      {articles[0].analysis.tone}
                    </span>
                  );
                })()}
              </div>

              {/* 행 */}
              {[
                { label: 'WHO', value: articles[0].analysis.who },
                { label: 'WHAT', value: articles[0].analysis.what },
                { label: 'WHY', value: articles[0].analysis.why },
                { label: 'WHEN/WHERE', value: articles[0].analysis.when_where },
              ].map((row, ri, arr) => (
                <div
                  key={row.label}
                  className={`flex gap-4 px-6 py-4 ${ri < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-24 shrink-0 text-xs font-medium text-gray-400 uppercase tracking-widest pt-0.5">
                    {row.label}
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {row.value ?? '—'}
                  </div>
                </div>
              ))}
            </div>

            {/* ── 단독 키워드 ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                키워드
              </div>
              <div className="flex flex-wrap gap-2">
                {articles[0].analysis.keywords.map((k) => (
                  <div
                    key={k}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
                  >
                    {k}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 단독 원문 링크 ── */}
            <a
              href={articles[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-400 hover:bg-gray-50 transition-colors"
            >
              {articles[0].source} 원문 보기 →
            </a>
          </>
        ) : (
          <>
            {/* ── 비교 테이블 (기존 유지) ── */}
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
                  const tone =
                    TONE_STYLE[a.analysis.tone] ?? TONE_STYLE['단정 서술'];
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
                        <div className="text-xs text-amber-500 font-medium">
                          차이
                        </div>
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

            {/* ── 비교 키워드 (기존 유지) ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                키워드
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />두
                  매체 공통
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

              {/* ── 비교 원문 링크 (기존 유지) ── */}
              {/* <div className="grid grid-cols-2 gap-3">
                {articles.map((a) => (
                  <a
                    key={a.source}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      log({
                        query,
                        eventType: 'original_link_click',
                        articleLink: article.link,
                      })
                    }
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    {a.source} 원문 보기 →
                  </a>
                ))}
              </div> */}
              <OriginalLinkButton articles={articles} />
          </>
        )}
      </div>

      <Toast />
    </div>
  );
}
