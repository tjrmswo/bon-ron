import { parse } from 'tldts';

const extractDomain = (url: string): string => {
  const { domainWithoutSuffix } = parse(url);
  return domainWithoutSuffix ?? new URL(url).hostname;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ siteName: null }, { status: 400 });

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const contentType = response.headers.get('content-type') ?? '';
    const rawHtml = new TextDecoder('utf-8').decode(buffer);
    const isEucKr =
      contentType.toLowerCase().includes('euc-kr') ||
      rawHtml.toLowerCase().includes('charset=euc-kr');

    const html = isEucKr ? new TextDecoder('euc-kr').decode(buffer) : rawHtml;

    const match = html.match(
      /<meta[^>]*property="og:site_name"[^>]*content="([^"]+)"/,
    );
    const raw = match?.[1] ?? null;

    const siteName = raw && !/[-|]/.test(raw) ? raw : extractDomain(url);

    return Response.json({ siteName });
  } catch {
    // fetch 자체 실패 시에도 도메인 fallback
    return Response.json({ siteName: extractDomain(url) });
  }
}
