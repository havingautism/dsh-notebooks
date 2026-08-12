/** Client mount for the notebook Remote contribution. */
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote';
import { NotebooksView } from "./NotebooksView.js";
/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots'];
/**
 * Mount the notebook Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    const disposeRemote = await ctx.remote.$mount(notebooksRemote);
    ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'notebooks',
        order: 20,
        label: () => '随手记',
        inject: () => ({
            list: async (query) => (await ctx.remote.notebooks.list({ ...(query === '' ? {} : { query }) })).entries,
            put: async (request) => await ctx.remote.notebooks.put(request),
            delete: async (id) => await ctx.remote.notebooks.delete({ id }),
        }),
    }, NotebooksView));
    return disposeRemote;
}
//# sourceMappingURL=index.js.map