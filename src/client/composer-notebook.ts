/** Composer helpers: insert or clear one notebook reference occurrence. */

import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { ReferenceInsert, TokenSpan } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import type { NotebookMentionCandidate } from '../types.ts'

interface InputShell {
  readonly snapshot: {
    readonly draft: string
    readonly draftRev: number
    readonly occurrences: readonly {
      readonly source: string
      readonly offset: number
      readonly length: number
    }[]
  }
  setDraft(text: string): void
  insertReference(reference: ReferenceInsert, span: TokenSpan): boolean
}

interface ConversationInputHub {
  shell(sessionId: SessionId): InputShell
}

/** Remove the notebook occurrence, if any, and return the next insertion offset. */
function clearNotebookOccurrence(shell: InputShell): number {
  const occurrence = shell.snapshot.occurrences.find(item => item.source === 'notebook')
  if (occurrence === undefined) return shell.snapshot.draft.length
  shell.setDraft(
    shell.snapshot.draft.slice(0, occurrence.offset)
    + shell.snapshot.draft.slice(occurrence.offset + occurrence.length),
  )
  return occurrence.offset
}

/** Insert one notebook mention occurrence at the composer caret tail. */
export function selectNotebookInComposer(
  hub: ConversationInputHub,
  sessionId: SessionId,
  candidate: NotebookMentionCandidate,
): boolean {
  const shell = hub.shell(sessionId)
  let offset = clearNotebookOccurrence(shell)
  let snapshot = shell.snapshot
  if (offset > 0 && snapshot.draft[offset - 1] !== ' ' && snapshot.draft[offset - 1] !== '\n') {
    shell.setDraft(`${snapshot.draft.slice(0, offset)} ${snapshot.draft.slice(offset)}`)
    offset += 1
    snapshot = shell.snapshot
  }
  const span: TokenSpan = {
    start: offset,
    end: offset,
    draftRev: snapshot.draftRev,
  }
  const mention = candidate.mention
  return shell.insertReference({
    source: 'notebook',
    ref: mention,
    label: candidate.title,
    appearance: 'file',
    clipboardText: mention,
  }, span)
}

/** Clear the selected notebook occurrence from one composer draft. */
export function clearNotebookInComposer(hub: ConversationInputHub, sessionId: SessionId): boolean {
  const shell = hub.shell(sessionId)
  const had = shell.snapshot.occurrences.some(item => item.source === 'notebook')
  if (!had) return false
  clearNotebookOccurrence(shell)
  return true
}

/** Whether a notebook can be cited while its overview is still generating. */
export function isNotebookAskBlocked(entry: {
  summary?: string
  summarizing?: boolean
  latestJob?: { status?: string; resultSummary?: string } | null
}): boolean {
  if (entry.summarizing === true) return true
  const summary = (entry.summary?.trim() ?? '') || (entry.latestJob?.resultSummary?.trim() ?? '')
  if (summary !== '') return false
  const status = entry.latestJob?.status ?? ''
  return status === 'pending' || status === 'running'
}
