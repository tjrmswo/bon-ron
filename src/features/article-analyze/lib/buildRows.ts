import { Article } from '../model/type';
import { ANALYSIS_ROW_KEYS } from './constants';

export function buildRows(articles: Article[]) {
  return ANALYSIS_ROW_KEYS.map((row) => ({
    ...row,
    getVal: (a: Article) => a.analysis[row.field],
    isDiff:
      articles[0].analysis[row.field] !== articles[1]?.analysis[row.field],
  }));
}

export function buildCommonKeywords(articles: Article[]) {
  return articles[0].analysis.keywords.filter((k) =>
    articles[1]?.analysis.keywords.includes(k),
  );
}
