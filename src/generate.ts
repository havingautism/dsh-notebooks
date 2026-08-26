/** Pure notebook generation helpers shared by the service and tests. */

import type { NotebookArtifactKind, NotebookEntry, NotebookEntryKind, NotebookSource } from './types.ts'

const TITLE_PATTERN = /^(?:#{1,6}\s*)?(?:\*\*)?Title(?:\*\*)?:\s*(?:\*\*)?\s*/i
const SUMMARY_PATTERN = /^(?:#{1,6}\s*)?(?:\*\*)?Summary(?:\*\*)?:\s*(?:\*\*)?\s*$/i

/** Sources currently selected for summary and Studio work. */
export function selectedSources(entry: NotebookEntry): NotebookSource[] {
  return entry.sources.filter(source => source.selected)
}

/** Combine selected source bodies into one bounded generation input. */
export function combineSources(sources: readonly NotebookSource[], maxChars = 24000): string {
  let remaining = maxChars
  const sections: string[] = []
  for (const source of sources) {
    if (remaining <= 0) break
    const body = source.content.trim()
    if (body === '') continue
    const clipped = body.slice(0, remaining)
    sections.push([
      `## Source: ${source.name || source.url || 'Untitled'}`,
      source.url === null ? '' : `URL: ${source.url}`,
      clipped,
    ].filter(part => part !== '').join('\n'))
    remaining -= clipped.length
  }
  return sections.join('\n\n---\n\n')
}

/** Parse a model summary that starts with Title/Summary markers. */
export function parseGeneratedSummary(rawResult: string): { title: string; summary: string } {
  const raw = rawResult.trim()
  if (raw === '') return { title: '', summary: '' }
  const lines = raw.split(/\r?\n/)
  const titleIndex = lines.findIndex(line => TITLE_PATTERN.test(line.trim()))
  const summaryIndex = lines.findIndex(line => SUMMARY_PATTERN.test(line.trim()))
  const title = titleIndex >= 0
    ? normalizeGeneratedTitle(lines[titleIndex]!.trim().replace(TITLE_PATTERN, ''))
    : ''
  let summary = raw
  if (summaryIndex >= 0) summary = lines.slice(summaryIndex + 1).join('\n').trim()
  else if (titleIndex >= 0) summary = lines.filter((_, index) => index !== titleIndex).join('\n').trim()
  return { title, summary }
}

/** Ensure a generated title has an emoji and stays short. */
export function normalizeGeneratedTitle(rawTitle: string): string {
  let title = rawTitle.replace(/^#+\s*/u, '').replace(/\*\*/gu, '').replace(/\s+/gu, ' ').trim()
  if (title === '') return ''
  if (!/\p{Extended_Pictographic}/u.test(title)) title = `📝 ${title}`
  return Array.from(title).slice(0, 64).join('').trim()
}

/** Fallback title when the model omits one. */
export function fallbackTitle(input: { title?: string; sourceUrl?: string | null; contentText?: string }): string {
  const explicit = input.title?.trim() ?? ''
  const sourceUrl = input.sourceUrl?.trim() ?? ''
  if (explicit !== '' && explicit !== sourceUrl) return normalizeGeneratedTitle(explicit)
  const firstContentLine = (input.contentText ?? '')
    .split(/\r?\n/)
    .map(line => line.replace(/^#+\s*/u, '').trim())
    .find(line => line !== '')
  if (firstContentLine !== undefined) return normalizeGeneratedTitle(Array.from(firstContentLine).slice(0, 36).join(''))
  try {
    return normalizeGeneratedTitle(new URL(sourceUrl).hostname.replace(/^www\./u, ''))
  } catch {
    return normalizeGeneratedTitle(sourceUrl)
  }
}

/** Fallback title for a saved chat answer. */
export function fallbackChatTitle(questionText: string, answerText: string): string {
  const question = questionText.trim()
  if (question !== '') return normalizeGeneratedTitle(Array.from(question).slice(0, 36).join(''))
  const firstAnswerLine = answerText
    .split(/\r?\n/)
    .map(line => line.replace(/^#+\s*/u, '').trim())
    .find(line => line !== '')
  return firstAnswerLine === undefined
    ? '📝 Chat answer'
    : normalizeGeneratedTitle(Array.from(firstAnswerLine).slice(0, 36).join(''))
}

/** Library card kind derived from attached sources. */
export function entryKindFromSources(sources: readonly NotebookSource[]): NotebookEntryKind {
  if (sources.length > 1) return 'notebook'
  return sources[0]?.kind ?? 'manual'
}

/** Follow-up context injected beside a citing user message. */
export function buildAskContext(entry: NotebookEntry, summary: string): string {
  const sources = selectedSources(entry)
  const lines = [
    '<notebook_context>',
    'The user previously saved and read the following multi-source note.',
    'Treat its synthesized summary and source list as user-provided reading context.',
    '',
    `Title: ${entry.title || '(untitled)'}`,
    `Entry ID: ${entry.id}`,
  ]
  if (entry.sourceUrl !== null) lines.push(`Source URL: ${entry.sourceUrl}`)
  if (sources.length > 0) {
    lines.push(`Selected sources (${String(sources.length)}):`)
    for (const source of sources) {
      lines.push(`- ${source.name || source.url || 'Untitled source'}${source.url === null ? '' : ` — ${source.url}`}`)
    }
  }
  lines.push('', 'Summary:', summary === '' ? 'No summary available yet.' : summary, '</notebook_context>')
  return lines.join('\n')
}

/** Whether a URL can be fetched as a notebook source. */
export function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//iu.test(value.trim())
}

const JINA_TIMEOUT_MS = 8_000

function jinaSignal(userSignal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(JINA_TIMEOUT_MS)
  if (userSignal === undefined) return timeout
  const any = (AbortSignal as { any?: (signals: AbortSignal[]) => AbortSignal }).any
  return any === undefined ? timeout : any([userSignal, timeout])
}

/**
 * Pull a readable title and body out of a web-fetch HTML fallback.
 * Jina already returns markdown; this only runs when the fallback stored a page.
 */
export function extractHtmlArticle(html: string, sourceUrl = ''): { title: string; content: string } {
  const raw = html.trim()
  if (raw === '' || !/<(?:html|head|body|article|div|meta|title)\b/i.test(raw)) {
    return { title: '', content: raw }
  }
  const ogTitle = raw.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]
    ?? raw.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1]
  const titleTag = raw.match(/<title[^>]*>([^<]+)/i)?.[1]
  const title = decodeHtmlEntities((ogTitle ?? titleTag ?? '').trim())
  const article = raw.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    ?? raw.match(/class=["'][^"']*article-content[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section|article)>/i)?.[1]
    ?? raw.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    ?? raw
  const content = decodeHtmlEntities(article
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim())
  return { title: title || hostnameOf(sourceUrl), content }
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function hostnameOf(value: string): string {
  try { return new URL(value).hostname.replace(/^www\./u, '') } catch { return value }
}

/** Jina Reader proxy URL for one source page, matching Codemini scrapbook. */
export function jinaReaderUrl(sourceUrl: string): string {
  return `https://r.jina.ai/http://${sourceUrl.trim().replace(/^https?:\/\//iu, '')}`
}

/** Parsed Jina Reader markdown: article title plus cleaned body. */
export interface ParsedJinaReader {
  readonly title: string
  readonly text: string
}

/**
 * Parse a Jina Reader response into title and markdown body.
 * Strips Title/URL/Published/Warning metadata lines, matching Codemini.
 */
export function parseJinaReaderResponse(text: string, sourceUrl = ''): ParsedJinaReader {
  const raw = text.trim()
  if (raw === '') return { title: sourceUrl.trim(), text: '' }
  const titleMatch = raw.match(/^Title:\s*(.+)$/m)
  const markdownMatch = raw.match(/(?:^|\n)Markdown Content:\s*\n([\s\S]*)$/)
  const markdownBody = markdownMatch?.[1] ?? raw
  const cleaned = markdownBody
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line =>
      line !== ''
      && !/^Warning:/i.test(line)
      && !/^URL Source:/i.test(line)
      && !/^Published Time:/i.test(line)
      && !/^Title:/i.test(line),
    )
    .join('\n')
    .trim()
  return { title: (titleMatch?.[1] ?? sourceUrl).trim(), text: cleaned }
}

/** Optional `ctx.web` fetch used after Jina fails. */
export interface NotebookWebFetch {
  fetch(request: { url: string }, signal?: AbortSignal): Promise<{
    url: string
    statusCode: number
    body: { kind: string; content: string }
  }>
}

/** Title plus body from Jina Reader or a web-fetch fallback. */
export interface NotebookFetchedPage {
  readonly title: string
  readonly content: string
}

/**
 * Fetch one notebook URL the Codemini way: Jina Reader first, then `ctx.web.fetch`.
 * Jina does not require `web-fetch-http`; the fallback does.
 */
export async function fetchNotebookUrl(
  url: string,
  options: {
    signal?: AbortSignal
    fetchImpl?: typeof fetch
    web?: NotebookWebFetch
    userAgent?: string
  } = {},
): Promise<NotebookFetchedPage> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch
  try {
    const response = await fetchImpl(jinaReaderUrl(url), {
      headers: { 'user-agent': options.userAgent ?? 'dsh-notebooks scrapbook-fetch' },
      signal: jinaSignal(options.signal),
    })
    if (response.ok) {
      const text = (await response.text()).trim()
      if (text !== '') {
        const parsed = parseJinaReaderResponse(text, url)
        if (parsed.text !== '') return { title: parsed.title, content: parsed.text }
      }
    }
  } catch {
    // Codemini swallows Jina errors and falls through to web fetch.
  }
  const web = options.web
  if (web === undefined) throw new Error('notebooks: web fetch is not available')
  const result = await web.fetch({ url }, options.signal)
  const extracted = extractHtmlArticle(result.body.content.trim(), result.url || url)
  let title = extracted.title
  if (title === '') {
    try { title = new URL(result.url || url).hostname.replace(/^www\./u, '') } catch { title = url }
  }
  return { title, content: extracted.content }
}

/** Clip generation input and mark truncation. */
export function truncateForGeneration(text: string, maxChars = 12000): string {
  const normalized = text.trim()
  if (normalized.length <= maxChars) return normalized
  return `${normalized.slice(0, maxChars).trimEnd()}\n\n[truncated]`
}

/** Resolve Studio system prompt text. */
export function studioPrompt(kind: NotebookArtifactKind): string {
  return kind === 'mindmap'
    ? 'Create a concise Mermaid mindmap grounded only in the provided sources. Return exactly one fenced mermaid block using Mermaid mindmap syntax. Use a short root label and 2-4 levels. Keep node labels concise and avoid punctuation that breaks Mermaid.'
    : 'Write a polished research report grounded only in the provided sources. Use Markdown with an executive summary, key findings, evidence grouped by source, and conclusions. Call out disagreements or uncertainty instead of inventing facts.'
}

/** Compact preview used when a summary is still missing. */
export function previewSummary(entry: NotebookEntry): string {
  const base = (entry.summary || entry.content || entry.title || entry.sourceUrl || '').trim()
  if (base === '') return 'No summary available yet.'
  return base.length > 280 ? `${base.slice(0, 277).trimEnd()}...` : base
}
