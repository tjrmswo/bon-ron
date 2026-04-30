import { create } from 'zustand';

interface ToastMessageState {
  message: string;
  show: boolean;
  setToastMessage: (message: string) => void;
  clearToastMessage: () => void;
}

export const useToastMessageStore = create<ToastMessageState>((set) => ({
  message: '',
  show: false,
  setToastMessage: (message) => {
    set({ message, show: true });
    setTimeout(() => set({ show: false }), 3000); // 3초 후에 자동으로 사라지도록
  },
  clearToastMessage: () => set({ message: '', show: false }),
}));
