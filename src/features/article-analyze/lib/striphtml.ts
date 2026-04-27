export function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, '') // <b>, </b> 등 HTML 태그 제거
    .replace(/&quot;/g, '"') // &quot; → "
    .replace(/&amp;/g, '&') // &amp; → &
    .replace(/&lt;/g, '<') // &lt; →
    .replace(/&gt;/g, '>') // &gt; → >
    .replace(/&#x27;/g, "'") // &#x27; → '
    .trim();
}
