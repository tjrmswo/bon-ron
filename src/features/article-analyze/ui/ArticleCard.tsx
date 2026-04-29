'use client';

import { useEffect, useRef, useState } from 'react';

// ArticleCard를 인라인으로 쓸 수 없으니 별도 컴포넌트로 분리
export function ArticleCard({
  source,
  tone,
  title,
}: {
  source: string;
  tone: { bg: string; text: string; border: string; label: string };
  title: string;
}) {
 const [expanded, setExpanded] = useState(false);
 const [isClamped, setIsClamped] = useState(false);
 const textRef = useRef<HTMLParagraphElement>(null);

 useEffect(() => {
   const el = textRef.current;
   if (el) setIsClamped(el.scrollHeight > el.clientHeight);
 }, [title]);

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      {/* 매체명 + tone 배지 */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{source}</div>
        <div
          className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${tone.bg} ${tone.text} ${tone.border}`}
        >
          {tone.label}
        </div>
      </div>

      {/* 제목 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-40' : 'max-h-[2.6rem]'}`}
      >
        <p
          ref={textRef}
          className={`text-xs text-gray-500 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}
        >
          {title}
        </p>
      </div>

      {/* 더보기 버튼 */}
      {isClamped && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {expanded ? '접기 ↑' : '더보기 ↓'}
        </button>
      )}
    </div>
  );
}