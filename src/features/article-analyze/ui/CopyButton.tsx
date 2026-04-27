'use client';
import { useState } from 'react';

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-400 hover:bg-gray-50 transition-colors"
    >
      {copied ? '✓ 복사됨' : 'url 복사'}
    </button>
  );
}
