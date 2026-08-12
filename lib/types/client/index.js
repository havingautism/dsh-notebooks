/** Client mount for the notebook Remote contribution. */
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote';
/** Required service: the Web profile's typed Remote client. */
export const inject = ['remote'];
/**
 * Mount the notebook Remote namespace into the Web client.
 * @param ctx - Client Cordis root carrying the typed Remote service.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    return await ctx.remote.$mount(notebooksRemote);
}
//# sourceMappingURL=index.js.map