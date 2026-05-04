'use client';
import { useState } from 'react';

export function SearchBar({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query);
      }}
    >
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="사건명으로 검색 (예: 한국 2002년 월드컵)"
          className="flex-1 h-10 px-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          className="h-10 px-5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          검색
        </button>
      </div>
    </form>
  );
}
