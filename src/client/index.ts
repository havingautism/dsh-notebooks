/** Client mount for the notebook Remote contribution. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote'
import type { RemoteResult, TypertClientRemote } from '@deepseek-ai/dsh-typert-protocol'
import type { NotebookDeleteResult, NotebookEntry, NotebookPutRequest, NotebookRemoveSourceResult } from '../types.ts'
import { NotebooksView } from './NotebooksView.tsx'
import type { NotebooksViewApi } from './view-types.ts'

export type {} from '@deepseek-ai/dsh-notebooks/remote'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Generated Remote namespaces, including notebooks. */
    remote: TypertClientRemote
  }
}

/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots']

/** Return one successful Remote value or surface the carrier failure. */
function remoteValue<T>(operation: string, result: RemoteResult<T>): T {
  if (!result.ok) {
    throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`)
  }
  return result.value
}

/**
 * Mount the notebook Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(notebooksRemote)
  const view = ctx.inject(['remote.notebooks'], (remoteCtx) => {
    remoteCtx.slots.inject('conversation.view', () => remoteCtx.slots.register({
      name: 'conversation.view',
      id: 'notebooks',
      order: 20,
      label: () => '随手记',
      inject: (): NotebooksViewApi => ({
        list: async query => remoteValue('notebooks.list', await remoteCtx.remote.notebooks.list({ ...(query === '' ? {} : { query }) })).entries,
        get: async id => remoteValue('notebooks.get', await remoteCtx.remote.notebooks.get({ id })),
        put: async (request: NotebookPutRequest): Promise<NotebookEntry> => remoteValue('notebooks.put', await remoteCtx.remote.notebooks.put(request)),
        addSource: async request => remoteValue('notebooks.addSource', await remoteCtx.remote.notebooks.addSource(request)),
        selectSources: async (id, sourceIds) => remoteValue('notebooks.setSourceSelection', await remoteCtx.remote.notebooks.setSourceSelection({ id, sourceIds })),
        removeSource: async (id, sourceId): Promise<NotebookRemoveSourceResult> => remoteValue('notebooks.removeSource', await remoteCtx.remote.notebooks.removeSource({ id, sourceId })),
        setSummary: async (id, summary) => remoteValue('notebooks.setSummary', await remoteCtx.remote.notebooks.setSummary({ id, summary })),
        setArtifact: async request => remoteValue('notebooks.setArtifact', await remoteCtx.remote.notebooks.setArtifact(request)),
        delete: async (id): Promise<NotebookDeleteResult> => remoteValue('notebooks.delete', await remoteCtx.remote.notebooks.delete({ id })),
      }),
    }, NotebooksView))
  })
  await view
  return async () => {
    await view.dispose()
    await disposeRemote()
  }
}
