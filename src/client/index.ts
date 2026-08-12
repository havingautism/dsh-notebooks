/** Client mount for the notebook Remote contribution. */

import type { Context } from '@deepseek-ai/cordis'
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote'
import type { TypeRTClientRemote } from '@deepseek-ai/dsh-type-meta'

export type {} from '@deepseek-ai/dsh-notebooks/remote'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Generated Remote namespaces, including notebooks. */
    remote: TypeRTClientRemote
  }
}

/** Required service: the Web profile's typed Remote client. */
export const inject = ['remote']

/**
 * Mount the notebook Remote namespace into the Web client.
 * @param ctx - Client Cordis root carrying the typed Remote service.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx: Context): Promise<() => Promise<void>> {
  return await ctx.remote.$mount(notebooksRemote)
}
