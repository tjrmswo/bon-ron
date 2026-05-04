import { ArticleInput } from './schemas';

export interface ArticleListProps {
  articles: ClusterResult | undefined;
  selected: NewsItem[];
  onToggle: (article: NewsItem, id: number) => void;
  canCompare: boolean;
  handleCompare: () => void;
  isPending: boolean;
  isAnalyzeError: boolean;
}

export interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  originallink: string;
}

export interface NewsResultProps {
  display: number;
  items: NewsItem[];
  lastBuildDate: string;
  start: number;
  total: number;
}

export interface AnalyzeParams {
  articles: ArticleInput[];
  keyword?: string;
}

export type NaverArticle = {
  title: string;
  description: string;
  link: string;
  originallink: string;
  pubDate: string;
};

type ArticleGroup = {
  topic: string;
  articles: NaverArticle[];
};

export type ClusterResult = {
  groups: ArticleGroup[];
};

export type SearchMode = 'flat' | 'cluster';

interface Analysis {
  who: string | null;
  what: string | null;
  why: string | null;
  when_where: string | null;
  keywords: string[];
  tone: '단정 서술' | '주장 인용' | '해석·전망';
  tone_reason: string | null;
}

export interface Article {
  source: string;
  title: string;
  url: string;
  analysis: Analysis;
}

export interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export interface UseNewsSearchOptions {
  onSuccess?: (data: NewsResultProps) => void;
}

export type Mode = 'flat' | 'cluster';
export type EventType =
  | 'deselect'
  | 'compare_start'
  | 'kakao_share'
  | 'original_link_click';

type RowBase = { getVal: (a: Article) => string | null; isDiff: boolean };

export type Row =
  | (RowBase & { key: 'WHO'; field: 'who'; isTone: false })
  | (RowBase & { key: 'WHAT'; field: 'what'; isTone: false })
  | (RowBase & { key: 'WHY'; field: 'why'; isTone: false })
  | (RowBase & { key: 'WHEN'; field: 'when_where'; isTone: false })
  | (RowBase & { key: 'TONE'; field: 'tone'; isTone: true });

interface RecentAnalysisArticle {
  source: string;
}

export interface RecentAnalysis {
  id: string;
  keyword: string | null;
  articles: RecentAnalysisArticle[];
  created_at: string;
}
