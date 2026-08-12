/** Client mount for the notebook Remote contribution. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote'
import type { TypeRTClientRemote } from '@deepseek-ai/dsh-type-meta'
import type { NotebookDeleteResult, NotebookEntry, NotebookPutRequest } from '../types.ts'
import { NotebooksView } from './NotebooksView.tsx'
import type { NotebooksViewApi } from './view-types.ts'

export type {} from '@deepseek-ai/dsh-notebooks/remote'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Generated Remote namespaces, including notebooks. */
    remote: TypeRTClientRemote
  }
}

/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots']

/**
 * Mount the notebook Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(notebooksRemote)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'notebooks',
    order: 20,
    label: () => '随手记',
    inject: (): NotebooksViewApi => ({
      list: async query => (await ctx.remote.notebooks.list({ ...(query === '' ? {} : { query }) })).entries,
      put: async (request: NotebookPutRequest): Promise<NotebookEntry> => await ctx.remote.notebooks.put(request),
      delete: async (id): Promise<NotebookDeleteResult> => await ctx.remote.notebooks.delete({ id }),
    }),
  }, NotebooksView))
  return disposeRemote
}
