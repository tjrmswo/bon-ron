'use client';

import { useState } from 'react';
import { KakaoShareButtonProps } from '../model/type';

export function KakaoShareButton({
  title,
  description,
  url,
}: KakaoShareButtonProps) {
  const [log, setLog] = useState('');

  const handleShare = () => {
    if (!window.Kakao) {
      setLog('Kakao SDK 미로드');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    if (!window.Kakao.isInitialized()) {
      setLog('초기화 실패: ' + process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: 'https://bon-ron.vercel.app/og-image.png',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      });
      setLog('sendDefault 호출 완료');
    } catch (e) {
      setLog('공유 실패: ' + String(e));
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 text-xs text-yellow-700 hover:bg-yellow-100 transition-colors"
      >
        카카오톡 공유
      </button>
      {log && <div className="mt-2 text-xs text-red-500 break-all">{log}</div>}
    </div>
  );
}
