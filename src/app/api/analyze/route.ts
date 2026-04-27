import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  AnalyzeRequestSchema,
  AnalysisResultSchema,
  type ArticleInput,
} from '@/features/article-analyze/model/schemas';
import { createClient } from '@/shared/lib/supabase/server';
import { ZodError } from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const openai = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
// });

const MAX_CHARS = 3000;
function truncate(text: string) {
  if (text.length <= MAX_CHARS) return text;
  const half = MAX_CHARS / 2;
  return text.slice(0, half) + '\n...(중략)...\n' + text.slice(-half);
}

const SYSTEM_PROMPT = `당신은 한국 뉴스 기사를 구조화된 데이터로 변환하는 시스템입니다.

[규칙]
1. 본문에 명시된 사실만 사용하세요. 추측 금지.
2. 본문에 해당 정보가 없으면 반드시 null을 반환하세요.
3. 모든 응답은 한국어로 작성하세요.
4. 반드시 아래 JSON 스키마로만 응답하세요. 다른 텍스트 금지.

[출력 스키마]
{
  "who": "60자 이내 (행위의 주체) | null",
  "what": "80자 이내 (일어난 일) | null",
  "why": "100자 이내, 가장 직접적인 이유 하나만 | null",
  "when_where": "60자 이내, 사건 발생 시점·장소만 (발표 장소 제외) | null",
  "keywords": "정확히 5개, 각 10자 이내. 본문의 고유명사·사건명·수치 중심. 기자의 해석·평가가 담긴 단어 제외",
  "tone": "단정 서술 | 주장 인용 | 해석·전망",
  "tone_reason": "40자 이내, 판단 근거를 인용 출처나 문장 구조로 설명"
}

[어조 분류 기준]
- 단정 서술: 사건/수치/발표 등을 사실처럼 단정지어 전달하는 방식 (내용의 사실 여부와 무관)
- 주장 인용: 특정 인물·집단의 주장을 중심으로 전달하는 방식
- 해석·전망: 사실 위에 해석·평가·전망이 더해진 방식

⚠️ 이 분류는 기사의 작성 방식을 나타냅니다. 내용의 사실 여부를 검증하지 않습니다.`;

async function analyzeArticle(article: ArticleInput) {
  const text = truncate(`제목: ${article.title}\n\n${article.content}`);

  let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;

  try {
    completion = await openai.chat.completions.create({
      // model: 'gemini-2.5-flash',
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });
  } catch (err) {
    console.error('[Gemini API 호출 실패]', err);
    throw new Error('Gemini API 호출에 실패했습니다');
  }

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('Gemini API 응답이 비어있습니다');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    console.error('[JSON 파싱 실패] content:', content);
    throw new Error('AI 응답을 JSON으로 파싱할 수 없습니다');
  }

  try {
    return AnalysisResultSchema.parse(raw);
  } catch (err) {
    console.error('[Zod 검증 실패] raw:', raw);
    throw err; // ZodError 그대로 throw → POST에서 ZodError로 잡힘
  }
}

export async function POST(req: NextRequest) {
  // 1. 요청 검증
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: '요청 본문을 파싱할 수 없습니다' },
      { status: 400 },
    );
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { articles, keyword } = parsed.data;

  // 2. OpenAI 병렬 분석
  let results: Awaited<ReturnType<typeof analyzeArticle>> extends infer T
    ? {
        source: string | null;
        url: string | null;
        title: string;
        analysis: T;
      }[]
    : never;

  try {
    results = await Promise.all(
      articles.map(async (article) => ({
        source: article.source ?? null,
        url: article.originallink ?? article.url ?? null,
        title: article.title,
        analysis: await analyzeArticle(article),
      })),
    );
  } catch (err) {
    console.error('[OpenAI 분석 실패]', err);

    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'AI 응답 형식이 올바르지 않습니다', detail: err.flatten() },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다' },
      { status: 502 },
    );
  }

  // 3. Supabase 저장
  const supabase = await createClient();

  const { data, error: dbError } = await supabase
    .from('analyses')
    .insert({ keyword: keyword ?? null, articles: results })
    .select('id')
    .single();

  if (dbError) {
    console.error('[Supabase 저장 실패]', dbError);
    return NextResponse.json(
      { error: '분석 결과 저장에 실패했습니다', detail: dbError.message },
      { status: 503 },
    );
  }

  // 4. id 반환
  return NextResponse.json({ id: data.id });
}
