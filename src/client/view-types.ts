/** Operations injected into the notebook conversation view. */

import type {
  NotebookAddSourceRequest, NotebookArtifactRequest, NotebookDeleteResult, NotebookEntry,
  NotebookId, NotebookPutRequest, NotebookRemoveSourceResult, NotebookSourceId,
} from '../types.ts'

/** Notebook workspace operations over the package-owned Remote namespace. */
export interface NotebooksViewApi {
  readonly list: (query: string) => Promise<readonly NotebookEntry[]>
  readonly get: (id: NotebookId) => Promise<NotebookEntry | null>
  readonly put: (request: NotebookPutRequest) => Promise<NotebookEntry>
  readonly addSource: (request: NotebookAddSourceRequest) => Promise<NotebookEntry>
  readonly selectSources: (id: NotebookId, sourceIds: NotebookSourceId[]) => Promise<NotebookEntry>
  readonly removeSource: (id: NotebookId, sourceId: NotebookSourceId) => Promise<NotebookRemoveSourceResult>
  readonly setSummary: (id: NotebookId, summary: string) => Promise<NotebookEntry>
  readonly setArtifact: (request: NotebookArtifactRequest) => Promise<NotebookEntry>
  readonly delete: (id: NotebookId) => Promise<NotebookDeleteResult>
}
