import { describe, expect, it } from 'vitest'
import {
  extractHtmlArticle, extractWebPageTitle, fetchNotebookUrl, jinaReaderUrl,
  parseJinaReaderResponse, readableFetchText,
} from '../src/generate.ts'

describe('Jina Reader helpers', () => {
  it('builds the Codemini-style Jina Reader proxy URL', () => {
    expect(jinaReaderUrl('https://example.com/post')).toBe('https://r.jina.ai/http://example.com/post')
  })

  it('parses title and markdown body from a Jina Reader response', () => {
    const parsed = parseJinaReaderResponse(
      [
        'Title: Real article title',
        '',
        'URL Source: http://example.com/post',
        '',
        'Published Time: 123456',
        '',
        'Warning: cached snapshot',
        '',
        'Markdown Content:',
        'First paragraph.',
        '',
        'Second paragraph.',
      ].join('\n'),
      'https://example.com/post',
    )
    expect(parsed.title).toBe('Real article title')
    expect(parsed.text).toContain('First paragraph.')
    expect(parsed.text).toContain('Second paragraph.')
    expect(parsed.text).not.toContain('Warning: cached snapshot')
  })

  it('falls back to ctx.web.fetch when Jina returns empty content', async () => {
    const fetchImpl = async () => ({
      ok: true,
      text: async () => '',
    }) as Response
    const web = {
      fetch: async () => ({
        url: 'https://example.com/post',
        statusCode: 200,
        body: { kind: 'text', content: 'Fallback body' },
      }),
    }
    const page = await fetchNotebookUrl('https://example.com/post', { fetchImpl, web })
    expect(page.content).toBe('Fallback body')
    expect(page.title).toBe('example.com')
  })

  it('extracts Codemini-style body text from an HTML fallback page', () => {
    const html = `
      <html><head><title>Real article title</title>
      <meta property="og:title" content="Real article title" />
      </head><body>
      <nav>Skip me</nav>
      <div class="article-content"><p>First paragraph.</p><p>Second paragraph.</p></div>
      <article><p>Footer promo only</p></article>
      </body></html>
    `
    expect(extractWebPageTitle(html)).toBe('Real article title')
    const text = readableFetchText(html)
    expect(text).toContain('First paragraph.')
    expect(text).toContain('Second paragraph.')
    expect(text).toContain('Skip me')
    expect(text).toContain('Footer promo only')
    expect(text).not.toContain('<p>')

    const extracted = extractHtmlArticle(html, 'https://developer.aliyun.com/article/1')
    expect(extracted.title).toBe('Real article title')
    expect(extracted.content).toBe(text)
  })
})
