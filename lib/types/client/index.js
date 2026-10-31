/** Client mount for the notebook Remote contribution. */
import notebooksRemote from '@deepseek-ai/dsh-notebooks/remote';
import { formatNotebookMention } from "../mention.js";
import { NotebookId } from "../types.js";
import { hydrateNotebook } from "./hydrate.js";
import { NS, en, zh } from "./locales.js";
import { createNotebooksUiStore } from "./ui-store.js";
import { NotebooksSidebarEntry } from "./NotebooksSidebarEntry.js";
import { NotebooksOverlay } from "./NotebooksOverlay.js";
import { NotebooksComposerButton } from "./NotebooksComposerButton.js";
import { NotebooksComposerDock } from "./NotebooksComposerDock.js";
import { NotebooksCiteChip } from "./NotebooksCiteChip.js";
import { notebookCiteDefinition } from "./notebook-cite-definition.js";
import { clearNotebookInComposer, selectNotebookInComposer } from "./composer-notebook.js";
/** Required services: Remote client, slots, locale, sessions, conversation nodes, and optional triggers. */
export const inject = ['remote', 'slots', 'locale', 'sessions', 'inputTriggers', 'uiConversation'];
/** Return one successful Remote value or surface the carrier failure. */
function remoteValue(operation, result) {
    if (!result.ok) {
        throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
    }
    return result.value;
}
function createApi(clientRemote, notebooks) {
    return {
        list: async (query) => remoteValue('notebooks.list', await notebooks.list({ ...(query === '' ? {} : { query }) })).entries.map(hydrateNotebook),
        get: async (id) => {
            const entry = remoteValue('notebooks.get', await notebooks.get({ id }));
            return entry === null ? null : hydrateNotebook(entry);
        },
        put: async (request) => hydrateNotebook(remoteValue('notebooks.put', await notebooks.put(request))),
        create: async (request) => hydrateNotebook(remoteValue('notebooks.create', await notebooks.create(request))),
        addSource: async (request) => hydrateNotebook(remoteValue('notebooks.addSource', await notebooks.addSource(request))),
        selectSources: async (id, sourceIds) => hydrateNotebook(remoteValue('notebooks.setSourceSelection', await notebooks.setSourceSelection({ id, sourceIds }))),
        removeSource: async (id, sourceId) => {
            const result = remoteValue('notebooks.removeSource', await notebooks.removeSource({ id, sourceId }));
            return { ...result, entry: hydrateNotebook(result.entry) };
        },
        setSummary: async (id, summary) => hydrateNotebook(remoteValue('notebooks.setSummary', await notebooks.setSummary({ id, summary }))),
        setArtifact: async (request) => hydrateNotebook(remoteValue('notebooks.setArtifact', await notebooks.setArtifact(request))),
        summarize: async (id) => hydrateNotebook(remoteValue('notebooks.summarize', await notebooks.summarize({ id }))),
        generateStudio: async (id, kind) => hydrateNotebook(remoteValue('notebooks.generateStudio', await notebooks.generateStudio({ id, kind }))),
        saveChatAnswer: async (request) => hydrateNotebook(remoteValue('notebooks.saveChatAnswer', await notebooks.saveChatAnswer(request))),
        candidates: async (query) => remoteValue('notebooks.candidates', await notebooks.candidates({ ...(query === '' ? {} : { query }) })).candidates,
        delete: async (id) => remoteValue('notebooks.delete', await notebooks.delete({ id })),
        subscribeProgress: listener => clientRemote.$on('notebooks/progress', (entry) => { listener(hydrateNotebook(entry)); }),
    };
}
function conversationInputHub(ctx) {
    const conversation = ctx.get('conversation');
    return conversation?.input;
}
function registerMentionSource(ctx) {
    const inputTriggers = ctx.inputTriggers;
    if (inputTriggers === undefined)
        return;
    const t = ctx.locale.bind(NS);
    const source = {
        trigger: '@',
        name: 'notebook',
        order: 30,
        showGroupTitle: false,
        async candidates(_session, { query, signal }) {
            const result = await ctx.remote.notebooks.candidates({ ...(query === '' ? {} : { query }) });
            if (signal.aborted || !result.ok)
                return [];
            return result.value.candidates.map(candidate => ({
                name: candidate.title,
                description: candidate.summary,
                section: t('mention.section'),
                value: JSON.stringify({ id: candidate.id, title: candidate.title, mention: candidate.mention }),
            }));
        },
        onPick({ candidate }) {
            const value = parseCandidate(candidate.value);
            if (value === undefined)
                return undefined;
            const mention = value.mention || formatNotebookMention(NotebookId(value.id), value.title);
            return {
                insert: {
                    source: 'notebook',
                    ref: mention,
                    label: value.title,
                    appearance: 'file',
                    clipboardText: mention,
                },
            };
        },
        codec: {
            clipboardText: ref => ref,
            serialize: ref => Promise.resolve(ref),
        },
    };
    ctx.effect(() => inputTriggers.registerSource(source), 'notebooks: @ source');
}
function parseCandidate(value) {
    if (value === undefined)
        return undefined;
    return JSON.parse(value);
}
function registerConversationSurfaces(ctx, slots, face) {
    ctx.uiConversation.events.register(notebookCiteDefinition);
    slots.inject('conversation.chat.node', () => slots.register({
        name: 'conversation.chat.node',
        key: 'notebook-cite',
        locale: NS,
        inject: face,
    }, NotebooksCiteChip));
}
/**
 * Mount the notebook Remote namespace and its global sidebar/overlay surfaces.
 * @param ctx - Web client root carrying Remote, slot, and locale services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    const disposeRemote = await ctx.remote.$mount(notebooksRemote);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'notebooks: dictionaries');
    const store = createNotebooksUiStore();
    registerMentionSource(ctx);
    const view = ctx.inject(['remote.notebooks', 'slots'], (remoteCtx) => {
        const api = createApi(ctx.remote, remoteCtx.remote.notebooks);
        const face = () => ({ store, api });
        const composerFace = () => ({
            store,
            api,
            selectNotebook: (id, candidate) => {
                const hub = conversationInputHub(ctx);
                if (hub === undefined)
                    return false;
                return selectNotebookInComposer(hub, id, candidate);
            },
            clearNotebook: id => {
                const hub = conversationInputHub(ctx);
                if (hub === undefined)
                    return false;
                return clearNotebookInComposer(hub, id);
            },
            openNotebook: notebookId => { store.setNotebookId(notebookId); },
        });
        registerConversationSurfaces(ctx, remoteCtx.slots, face);
        remoteCtx.slots.inject('sidebar.footer.action', () => remoteCtx.slots.register({
            name: 'sidebar.footer.action',
            id: 'notebooks',
            order: 30,
            locale: NS,
            inject: face,
        }, NotebooksSidebarEntry));
        remoteCtx.slots.inject('shell.overlay', () => remoteCtx.slots.register({
            name: 'shell.overlay',
            id: 'notebooks',
            order: 30,
            locale: NS,
            inject: face,
        }, NotebooksOverlay));
        remoteCtx.slots.inject('conversation.input.left', () => remoteCtx.slots.register({
            name: 'conversation.input.left',
            id: 'notebooks',
            order: 30,
            locale: NS,
            inject: (sessionId) => ({ ...composerFace(), sessionId }),
        }, NotebooksComposerButton));
        remoteCtx.slots.inject('conversation.input.dock', () => remoteCtx.slots.register({
            name: 'conversation.input.dock',
            id: 'notebooks',
            order: 25,
            locale: NS,
            inject: (sessionId) => ({ ...composerFace(), sessionId }),
        }, NotebooksComposerDock));
    });
    await view;
    return async () => {
        await view.dispose();
        await disposeRemote();
    };
}
//# sourceMappingURL=index.js.map