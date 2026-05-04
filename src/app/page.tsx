'use client';
import { ArticleAnalyzeSection } from '@/features/article-analyze';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900 mb-1">
            본론
          </h1>
          <p className="text-sm text-gray-400">
            같은 사건, 다른 시각 — 30초 안에 구조화해서 나란히 본다
          </p>
        </div>
        <ArticleAnalyzeSection />
      </div>
    </main>
  );
}
