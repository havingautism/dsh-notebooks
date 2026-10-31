/** Conversation node for a clickable notebook badge under citing user bubbles. */

import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import { parseNotebookMentions } from '../mention.ts'
import { NotebookId } from '../types.ts'

export const NOTEBOOKS_PLUGIN_ID = '@deepseek-ai/dsh-notebooks'

/** Renderer payload for one notebook cite chip. */
export interface NotebookCiteData {
  readonly notebookId: string
  readonly title: string
}

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
  interface ChatNodeDataMap {
    /** Clickable notebook badge anchored under a citing user bubble. */
    'notebook-cite': NotebookCiteData
  }
}

interface NotebookCiteState extends NotebookCiteData {
  readonly seq: number
}

function isAppendUserMessage(event: { type: string; surfaceOp?: unknown }): boolean {
  return event.type === 'user/message' && event.surfaceOp === 'append'
}

function textFromContent(content: readonly ContentBlock[]): string {
  return content
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map(block => block.text)
    .join('\n')
}

function readSourceField(source: unknown, key: string): string | undefined {
  if (typeof source !== 'object' || source === null) return undefined
  const value = (source as Record<string, unknown>)[key]
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function citeFromRecallSource(source: unknown, content: readonly ContentBlock[]): NotebookCiteData | null {
  if (readSourceField(source, 'kind') !== 'notebooks-recall') return null
  const notebookId = readSourceField(source, 'notebookId')
  const notebookTitle = readSourceField(source, 'notebookTitle')
  if (notebookId !== undefined) {
    return { notebookId, title: notebookTitle ?? notebookId }
  }
  const text = textFromContent(content)
  const idMatch = text.match(/^Entry ID:\s*(.+)$/m)
  if (idMatch?.[1] === undefined) return null
  const titleMatch = text.match(/^Title:\s*(.+)$/m)
  return { notebookId: idMatch[1].trim(), title: titleMatch?.[1]?.trim() || idMatch[1].trim() }
}

function citeFromUserMessage(content: readonly ContentBlock[]): NotebookCiteData | null {
  const parsed = parseNotebookMentions(textFromContent(content))
  const id = parsed.ids[0]
  if (id === undefined) return null
  const labelMatch = parsed.text.match(/@([^\n]+)/u)
  const title = labelMatch?.[1]?.trim() ?? id
  return { notebookId: id, title }
}

function messageData(data: unknown): { source?: unknown; content?: readonly ContentBlock[] } | null {
  if (typeof data !== 'object' || data === null) return null
  return data as { source?: unknown; content?: readonly ContentBlock[] }
}

/** Extract a notebook cite from one user/message event, or null. */
export function citeFromMessageEvent(event: {
  readonly type: string
  readonly seq?: number
  readonly data?: unknown
}): NotebookCiteData | null {
  if (event.type !== 'user/message') return null
  const data = messageData(event.data)
  if (data === null) return null
  const content = data.content ?? []
  return citeFromRecallSource(data.source, content) ?? citeFromUserMessage(content)
}

/** Fold citing notebook context into one anchored chip under the user bubble. */
export const notebookCiteDefinition: ConversationNodeDefinition<NotebookCiteState> = {
  kind: 'notebook-cite',
  target: 'chat',
  match: (event) => {
    if (!isAppendUserMessage(event)) return null
    const cite = citeFromMessageEvent(event)
    if (cite === null) return null
    return { id: `${cite.notebookId}:${String(event.seq)}`, role: 'start' }
  },
  start: (_context, match) => {
    const cite = citeFromMessageEvent(match.event)
    if (cite === null) throw new Error('notebook-cite requires a notebook mention')
    return { ...cite, seq: match.event.seq }
  },
  update: context => context.state,
  buildViewNode: (context) => {
    if (context.state === undefined) return null
    const seq = context.state.seq
    const sourceKind = readSourceField(messageData(context.start?.event.data)?.source, 'kind')
    return {
      key: context.key,
      kind: 'notebook-cite',
      id: context.id,
      target: 'chat',
      anchorSeq: sourceKind === 'notebooks-recall' ? seq - 0.1 : seq + 0.1,
      location: context.start?.location ?? { kind: 'unresolved' },
      visibility: 'visible',
      data: { notebookId: context.state.notebookId, title: context.state.title },
    }
  },
}

/** Notebook recall source fields carried on injected context messages. */
export interface NotebookRecallSource {
  readonly kind: 'notebooks-recall'
  readonly form: 'recall'
  readonly notebookId: NotebookId
  readonly notebookTitle: string
}
