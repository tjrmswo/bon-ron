import { create } from 'zustand';
import { NewsItem } from './type';

interface SelectedNewsState {
  selectedNews: NewsItem[];
  addNews: (news: NewsItem) => void;
  removeNews: (link: string) => void;
  clearNews: () => void;
}

export const useSelectedNewsStore = create<SelectedNewsState>((set) => ({
  selectedNews: [],
  addNews: (news) =>
    set((state) => ({
      selectedNews: state.selectedNews.some((n) => n.link === news.link)
        ? state.selectedNews.filter((n) => n.link !== news.link)
        : [...state.selectedNews, news],
    })),
  removeNews: (link) =>
    set((state) => ({
      selectedNews: state.selectedNews.filter((n) => n.link !== link),
    })),
  clearNews: () => set({ selectedNews: [] }),
}));
