/** Fill optional notebook fields after a Remote round-trip. */

import type { NotebookEntry, NotebookSource } from '../types.ts'

function hydrateSource(source: NotebookSource): NotebookSource {
  return {
    ...source,
    url: source.url ?? null,
    mimeType: source.mimeType ?? null,
    selected: source.selected !== false,
    status: source.status ?? 'ready',
    sessionId: source.sessionId ?? null,
    messageId: source.messageId ?? null,
  }
}

/** Normalize a notebook for the workspace renderer. */
export function hydrateNotebook(entry: NotebookEntry): NotebookEntry {
  return {
    ...entry,
    summary: entry.summary ?? '',
    tags: [...(entry.tags ?? [])],
    sourceType: entry.sourceType ?? 'manual',
    sourceUrl: entry.sourceUrl ?? null,
    fetchStatus: entry.fetchStatus ?? 'ready',
    sources: (entry.sources ?? []).map(hydrateSource),
    artifacts: [...(entry.artifacts ?? [])],
    latestJob: entry.latestJob ?? null,
  }
}
