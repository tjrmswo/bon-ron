'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const MOCK_ARTICLES = [
  {
    id: 1,
    source: '조선일보',
    time: '2시간 전',
    title: '이란 혁명수비대, 호르무즈 해협서 화물선 2척 나포 영상 공개',
  },
  {
    id: 2,
    source: '한겨레',
    time: '3시간 전',
    title: '이란, 무허가 통행 화물선 억류… 미국 봉쇄 대응 무력시위',
  },
  {
    id: 3,
    source: '연합뉴스',
    time: '4시간 전',
    title: '트럼프 휴전 연장 선언 직후 이란의 첫 선박 나포',
  },
];

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([1, 2]);
  const [pasteText, setPasteText] = useState('');
  const [searched, setSearched] = useState(false);

  const toggleArticle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSearch = () => {
    if (query.trim()) setSearched(true);
  };

  const handleReset = () => {
    setQuery('');
    setSelected([]);
    setPasteText('');
    setSearched(false);
  };

  const { data } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const response = await axios.get('/api/search', {
        params: {
          search: '전쟁',
        },
      });

      console.log(response.data);
      return response.data;
    },
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const canCompare = selected.length >= 2;
  const canAnalyze = pasteText.trim().length > 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* 로고 */}
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900 mb-1">
            본론
          </h1>
          <p className="text-sm text-gray-400">
            같은 사건, 다른 시각 — 30초 안에 구조화해서 나란히 본다
          </p>
        </div>

        {/* 검색 */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="키워드로 기사 검색 (예: 이란 호르무즈)"
            className="flex-1 h-10 px-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
          <button
            onClick={handleSearch}
            className="h-10 px-5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            검색
          </button>
        </div>

        {/* 검색 결과 */}
        {searched && (
          <div className="flex flex-col gap-2 mb-7">
            {MOCK_ARTICLES.map((article) => {
              const isSelected = selected.includes(article.id);
              return (
                <button
                  key={article.id}
                  onClick={() => toggleArticle(article.id)}
                  className={`flex items-start gap-3 px-4 py-3 border rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* 체크박스 */}
                  <div
                    className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border border-gray-300'
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
                      {article.source} · {article.time}
                    </p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {article.title}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* 비교 분석 버튼 */}
            {canCompare && (
              <div className="flex justify-end mt-1">
                <button className="h-9 px-5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  {selected.length}개 기사 비교 분석 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">또는 본문 직접 분석</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* 붙여넣기 영역 */}
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="기사 본문을 여기에 붙여넣으세요…"
          className="w-full min-h-27.5 px-4 py-3 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none leading-relaxed"
        />

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={handleReset}
            className="h-9 px-4 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
          <button
            disabled={!canAnalyze}
            className={`h-9 px-5 text-sm font-medium rounded-lg transition-colors ${
              canAnalyze
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            단독 분석
          </button>
        </div>

        {/* 최근 분석 기록 */}
        <div className="mt-14 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
            최근 분석
          </p>
          <div className="flex flex-col gap-1">
            {[
              {
                label: '비교',
                title: '이란 호르무즈 해협 나포 — 조선 vs 한겨레',
                time: '2h',
              },
              {
                label: '단독',
                title: '반도체 5조 펀드 발표 본문 분석',
                time: '어제',
              },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
              >
                <span className="text-xs text-gray-400 w-6 shrink-0 font-medium">
                  {item.label}
                </span>
                <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
