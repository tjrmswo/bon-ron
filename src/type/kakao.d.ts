declare global {
  interface Window {
    Kakao?: {
      init: (key: string | undefined) => void;
      isInitialized: () => boolean; // ← 추가
      Share: {
        sendDefault: (settings: object) => void;
      };
    };
  }
}

export {};
