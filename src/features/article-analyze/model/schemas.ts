import { z } from 'zod';

// nullable 문자열 정제용 헬퍼
const nullableString = z.preprocess((val) => {
  if (val === undefined || val === null) return null;
  if (typeof val !== 'string') return null;
  const cleaned = val
    .replace(/\s*\|\s*null\s*$/i, '') // "| null" 제거
    .trim();
  return cleaned === '' || cleaned.toLowerCase() === 'null' ? null : cleaned;
}, z.string().nullable());

export const AnalysisResultSchema = z.object({
  who: nullableString,
  what: nullableString,
  why: nullableString,
  when_where: nullableString,
  keywords: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim());
    return val;
  }, z.array(z.string()).max(5)),
  tone: z.preprocess(
    (val) => {
      if (typeof val !== 'string') return val;
      // "|" 앞부분만 추출
      const base = val.split('|')[0].trim();
      if (base.includes('단정') || base.includes('사실')) return '단정 서술';
      if (base.includes('주장') || base.includes('인용')) return '주장 인용';
      if (
        base.includes('해석') ||
        base.includes('전망') ||
        base.includes('분석')
      )
        return '해석·전망';
      return base;
    },
    z.enum(['단정 서술', '주장 인용', '해석·전망']),
  ),
  tone_reason: z.preprocess((val) => {
    if (val === undefined || val === null) return null;
    if (typeof val === 'string')
      return val.replace(/\s*\|\s*null\s*$/i, '').trim() || null;
    return null;
  }, z.string().max(80).nullable()),
});

export const ArticleInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  source: z.string().optional(),
  url: z.string().optional(),
  originallink: z.string().optional(),
});

export const AnalyzeRequestSchema = z.object({
  keyword: z.string().optional(),
  articles: z.array(ArticleInputSchema).min(1).max(5),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type ArticleInput = z.infer<typeof ArticleInputSchema>;
