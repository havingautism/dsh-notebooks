/** Client mount for the notebook Remote contribution. */
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote';
import { NotebooksView } from "./NotebooksView.js";
/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots'];
/** Return one successful Remote value or surface the carrier failure. */
function remoteValue(operation, result) {
    if (!result.ok) {
        throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
    }
    return result.value;
}
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
            list: async (query) => remoteValue('notebooks.list', await ctx.remote.notebooks.list({ ...(query === '' ? {} : { query }) })).entries,
            get: async (id) => remoteValue('notebooks.get', await ctx.remote.notebooks.get({ id })),
            put: async (request) => remoteValue('notebooks.put', await ctx.remote.notebooks.put(request)),
            addSource: async (request) => remoteValue('notebooks.addSource', await ctx.remote.notebooks.addSource(request)),
            selectSources: async (id, sourceIds) => remoteValue('notebooks.setSourceSelection', await ctx.remote.notebooks.setSourceSelection({ id, sourceIds })),
            removeSource: async (id, sourceId) => remoteValue('notebooks.removeSource', await ctx.remote.notebooks.removeSource({ id, sourceId })),
            setSummary: async (id, summary) => remoteValue('notebooks.setSummary', await ctx.remote.notebooks.setSummary({ id, summary })),
            setArtifact: async (request) => remoteValue('notebooks.setArtifact', await ctx.remote.notebooks.setArtifact(request)),
            delete: async (id) => remoteValue('notebooks.delete', await ctx.remote.notebooks.delete({ id })),
        }),
    }, NotebooksView));
    return disposeRemote;
}
//# sourceMappingURL=index.js.map