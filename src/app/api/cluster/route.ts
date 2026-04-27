import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── 타입 ──────────────────────────────────────────────────
type NaverArticle = {
  title: string;
  description: string;
  link: string;
  originallink: string;
  pubDate: string;
};

// ── Zod 스키마 ────────────────────────────────────────────
const ClusterRawSchema = z.object({
  groups: z.array(
    z.object({
      topic: z.string().max(20),
      indices: z.array(z.number()),
    }),
  ),
});

// ── 프롬프트 ──────────────────────────────────────────────
function buildPrompt(articles: NaverArticle[]): string {
  const list = articles
    .map(
      (a, i) =>
        `${i}: ${a.title.replace(/<[^>]*>/g, '')} | ${a.description.replace(/<[^>]*>/g, '')}`,
    )
    .join('\n');

  return `아래 뉴스 기사 목록을 같은 사건끼리 묶어줘.

[규칙]
- 같은 사건을 다룬 기사끼리만 같은 그룹으로 묶어
- 사건이 명확히 다르면 별도 그룹으로 분리해
- 그룹이 1개뿐이어도 그냥 1개 그룹으로 반환해
- topic은 해당 사건을 15자 이내로 요약해
- 모든 기사(0~${articles.length - 1})는 반드시 하나의 그룹에 포함돼야 해
- 반드시 아래 JSON 형식만 반환, 설명·마크다운 없이

{"groups":[{"topic":"사건명","indices":[0,2,5]},{"topic":"다른 사건","indices":[1,3,4,6,7,8,9]}]}

[기사 목록]
${list}`;
}

// ── POST ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let items: NaverArticle[];

  try {
    const body = await req.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: '기사 목록이 비어있습니다' },
        { status: 400 },
      );
    }
  } catch {
    return Response.json({ error: '잘못된 요청 형식입니다' }, { status: 400 });
  }

  // Gemini 호출
  let raw: unknown;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: buildPrompt(items) }],
      temperature: 0,
    });

    const content = completion.choices[0].message.content ?? '';
    // 마크다운 코드블록 제거 후 파싱
    const cleaned = content.replace(/```json|```/g, '').trim();
    raw = JSON.parse(cleaned);
  } catch (err) {
    console.error('[클러스터링 API 호출 실패]', err);
    // Gemini 실패 시 전체를 단일 그룹으로 폴백
    return Response.json({
      groups: [
        {
          topic: '검색 결과',
          articles: items,
        },
      ],
    });
  }

  // Zod 검증
  let parsed: z.infer<typeof ClusterRawSchema>;
  try {
    parsed = ClusterRawSchema.parse(raw);
  } catch (err) {
    console.error('[클러스터링 Zod 검증 실패] raw:', raw, err);
    // 검증 실패 시 단일 그룹 폴백
    return Response.json({
      groups: [
        {
          topic: '검색 결과',
          articles: items,
        },
      ],
    });
  }

  // indices → 원본 articles 재조합
  const groups = parsed.groups.map((group) => ({
    topic: group.topic,
    articles: group.indices
      .filter((i) => i >= 0 && i < items.length)
      .map((i) => items[i]),
  }));

  return Response.json({ groups });
}
