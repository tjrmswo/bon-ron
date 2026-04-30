'use client';

import { useToastMessageStore } from '@/features/article-analyze';
import { useEffect } from 'react';

export function Toast() {
  const { message, clearToastMessage } = useToastMessageStore();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clearToastMessage, 3000);
    return () => clearTimeout(timer);
  }, [message, clearToastMessage]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
