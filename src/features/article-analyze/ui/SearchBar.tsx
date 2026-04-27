'use client';

import { SearchBarProps } from '../model/type';

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="사건명으로 검색 (예: 이란 2차 협상 무산)"
        className="flex-1 h-10 px-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:bg-white transition-colors"
      />
      <button
        type="submit"
        className="h-10 px-5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        검색
      </button>
    </div>
  );
}
