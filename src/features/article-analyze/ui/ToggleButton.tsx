import React from 'react';

export function ToggleButton({
  mode,
  toggleMode,
}: {
  mode: string;
  toggleMode: () => void;
}) {
  return (
    <div className="flex justify-end mb-2">
      <button
        type="button"
        onClick={toggleMode}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
      >
        {mode === 'cluster' ? '📋 목록 보기' : '🗂 그룹 보기'}
      </button>
    </div>
  );
}
