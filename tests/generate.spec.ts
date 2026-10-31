import { describe, expect, it } from 'vitest'
import {
  buildSummaryUserPrompt, extractHtmlArticle, extractWebPageTitle, fetchNotebookUrl, jinaReaderUrl,
  parseGeneratedSummary, parseJinaReaderResponse, readableFetchText,
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

describe('summary prompts', () => {
  it('builds Codemini-aligned summary user prompts', () => {
    const prompt = buildSummaryUserPrompt({
      title: 'Test note',
      sourceUrl: 'https://example.com/post',
      contentText: 'Body text',
    })
    expect(prompt).toContain('Title: Test note')
    expect(prompt).toContain('Source URL: https://example.com/post')
    expect(prompt).toContain('Please write a detailed note summary')
    expect(prompt).toContain('Body text')
  })

  it('falls back to raw text when parsed summary is empty', () => {
    const parsed = parseGeneratedSummary('Title: 📝 Only title')
    expect(parsed.summary).toBe('Title: 📝 Only title')
  })
})

describe('assistant session text', () => {
  it('reads assembled assistant text from deriveMessages', async () => {
    const { assistantTextFromSession } = await import('../src/assistant-text.ts')
    const text = assistantTextFromSession({
      id: 's1',
      deriveMessages: () => [
        { role: 'user', content: [{ type: 'text', text: 'summarize' }] },
        { role: 'assistant', content: [{ type: 'text', text: 'Title: 📝 Note\nSummary:\nBody' }] },
      ],
    })
    expect(text).toContain('Summary:')
  })

  it('reads in-flight chunks when deriveMessages is still empty', async () => {
    const { assistantTextFromSession } = await import('../src/assistant-text.ts')
    const text = assistantTextFromSession({ id: 's1', deriveMessages: () => [] }, [
      { type: 'step/start', data: { turn: 1, step: 1 } },
      { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: 'Title: ' } } },
      { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: 'Note' } } },
    ])
    expect(text).toBe('Title: Note')
  })

  it('ignores reasoning content blocks', async () => {
    const { assistantTextFromSession } = await import('../src/assistant-text.ts')
    const text = assistantTextFromSession({
      id: 's1',
      deriveMessages: () => [
        { role: 'assistant', content: [
          { type: 'reasoning', text: 'The user wants a mindmap' },
          { type: 'text', text: '```mermaid\nmindmap\n  Root\n```' },
        ] },
      ],
    })
    expect(text).toContain('```mermaid')
    expect(text).not.toContain('The user wants')
  })
})

describe('mermaid extraction', () => {
  it('keeps a fenced mermaid block and drops planning prose', async () => {
    const { extractMermaidFence } = await import('../src/studio-mermaid.ts')
    const extracted = extractMermaidFence([
      'The user wants a concise Mermaid mindmap.',
      '',
      '```mermaid',
      'mindmap',
      '  Browser',
      '    Engine',
      '```',
    ].join('\n'))
    expect(extracted).toContain('mindmap')
    expect(extracted).toContain('```mermaid')
    expect(extracted).not.toContain('The user wants')
  })

  it('returns empty when the model only wrote planning prose', async () => {
    const { extractMermaidFence } = await import('../src/studio-mermaid.ts')
    expect(extractMermaidFence('The user wants a concise Mermaid mindmap grounded only in the provided source.')).toBe('')
  })

  it('unwraps the inner mermaid source for rendering', async () => {
    const { mermaidSourceFromArtifact } = await import('../src/studio-mermaid.ts')
    expect(mermaidSourceFromArtifact('```mermaid\nmindmap\n  Browser\n```')).toBe('mindmap\n  Browser')
  })

  it('parses an indented mermaid mindmap into a tree', async () => {
    const { parseMindmapTree } = await import('../src/studio-mermaid.ts')
    const tree = parseMindmapTree([
      '```mermaid',
      'mindmap',
      '  root((浏览器结构))',
      '    用户界面',
      '    浏览器引擎',
      '      渲染引擎',
      '```',
    ].join('\n'))
    expect(tree?.label).toBe('浏览器结构')
    expect(tree?.children.map(child => child.label)).toEqual(['用户界面', '浏览器引擎'])
    expect(tree?.children[1]?.children.map(child => child.label)).toEqual(['渲染引擎'])
  })
})
