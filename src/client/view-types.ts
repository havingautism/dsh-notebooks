/** Operations injected into the notebook conversation view. */

import type { NotebookDeleteResult, NotebookEntry, NotebookId, NotebookPutRequest } from '../types.ts'

/** Notebook page operations over the package-owned Remote namespace. */
export interface NotebooksViewApi {
  readonly list: (query: string) => Promise<readonly NotebookEntry[]>
  readonly put: (request: NotebookPutRequest) => Promise<NotebookEntry>
  readonly delete: (id: NotebookId) => Promise<NotebookDeleteResult>
}
