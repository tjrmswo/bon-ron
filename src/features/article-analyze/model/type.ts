import { ArticleInput } from './schemas';

export interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ArticleListProps {
  articles: ClusterResult | undefined;
  selected: NewsItem[];
  onToggle: (article: NewsItem, id: number) => void;
  canCompare: boolean;
  handleCompare: () => void;
  isPending: boolean;
  isAnalyzeError: boolean;
}

export interface PasteSectionProps {
  value: string;
  onChange: (v: string) => void;
  canAnalyze: boolean;
  onReset: () => void;
  handleAnalyze: () => void;
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

// 기존 — 네이버 API 응답 그대로
export type NaverArticle = {
  title: string;
  description: string;
  link: string;
  originallink: string;
  pubDate: string;
}

// 신규 — 클러스터링 결과
type ArticleGroup = {
  topic: string;        // AI가 추출한 사건명 (예: "이란 2차 협상 무산")
  articles: NaverArticle[];
}

export type ClusterResult = {
  groups: ArticleGroup[];
}

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
