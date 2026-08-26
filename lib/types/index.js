/**
 * Cross-session notebook workspace with sources, summaries, Studio artifacts,
 * model tools, and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { createUserMessage, freezeMessage } from '@deepseek-ai/dsh-llm';
import { SessionId } from '@deepseek-ai/dsh-session';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { buildAskContext, combineSources, entryKindFromSources, fallbackChatTitle, fallbackTitle, fetchNotebookUrl, isAbsoluteHttpUrl, parseGeneratedSummary, previewSummary, selectedSources, studioPrompt, truncateForGeneration, } from "./generate.js";
import { formatNotebookMention, parseNotebookMentions } from "./mention.js";
import { MINDMAP_SYSTEM_PROMPT, REPORT_SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT } from "./prompts.js";
import { defaultSharedSqlitePath, ensurePluginPlatform, legacyNotebooksSqlitePath } from "./platform.js";
import { importLegacyNotebooksIfEmpty } from "./migrate.js";
import { notebooksDomainSpec } from "./spec.js";
import { NotebookId, NotebookSourceId } from "./types.js";
export { NotebookId, NotebookSourceId } from "./types.js";
export { notebookArtifactSchema, notebookEntrySchema, notebookJobSchema, notebookSourceSchema, notebooksDomainSpec } from "./spec.js";
export { formatNotebookMention, parseNotebookMentions } from "./mention.js";
export { buildAskContext, combineSources, entryKindFromSources, fallbackChatTitle, fallbackTitle, fetchNotebookUrl, jinaReaderUrl, parseGeneratedSummary, parseJinaReaderResponse, extractHtmlArticle, selectedSources, } from "./generate.js";
export { defaultSharedSqlitePath, defaultNotebooksSqlitePath, legacyNotebooksSqlitePath } from "./platform.js";
export { importLegacyNotebooksIfEmpty } from "./migrate.js";
const ENTRY_SCHEMA = {
    type: 'object', additionalProperties: false,
    properties: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        summary: { type: 'string', required: true },
        tags: { type: 'array', required: true, items: { type: 'string' } },
        sourceType: { type: 'string', required: true },
        sourceUrl: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
        fetchStatus: { type: 'string', required: true },
        sources: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
                    id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['manual', 'url', 'document', 'chat_answer'] },
                    name: { type: 'string', required: true }, url: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
                    mimeType: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] }, content: { type: 'string', required: true },
                    selected: { type: 'boolean', required: true }, status: { type: 'string', required: true },
                    sessionId: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
                    messageId: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
                    createdAt: { type: 'number', required: true },
                } } },
        artifacts: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
                    kind: { type: 'string', required: true, enum: ['mindmap', 'report'] }, content: { type: 'string', required: true }, updatedAt: { type: 'number', required: true },
                } } },
        latestJob: { required: true, oneOf: [{ type: 'null' }, {
                    type: 'object', additionalProperties: false,
                    properties: {
                        id: { type: 'string', required: true },
                        kind: { type: 'string', required: true, enum: ['summary', 'mindmap', 'report'] },
                        status: { type: 'string', required: true, enum: ['pending', 'running', 'completed', 'failed'] },
                        stage: { type: 'string', required: true, enum: ['fetch', 'generate'] },
                        partialText: { type: 'string', required: true },
                        errorText: { type: 'string', required: true },
                        updatedAt: { type: 'number', required: true },
                    },
                }] },
        createdAt: { type: 'number', required: true },
        updatedAt: { type: 'number', required: true },
    },
};
/** Durable notebook service. */
let NotebooksService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _list_decorators;
    let _get_decorators;
    let _candidates_decorators;
    let _put_decorators;
    let _create_decorators;
    let _addSource_decorators;
    let _setSourceSelection_decorators;
    let _removeSource_decorators;
    let _setSummary_decorators;
    let _setArtifact_decorators;
    let _summarize_decorators;
    let _generateStudio_decorators;
    let _saveChatAnswer_decorators;
    let _delete_decorators;
    return class NotebooksService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _list_decorators = [Remote('list')];
            _get_decorators = [Remote('get')];
            _candidates_decorators = [Remote('candidates')];
            _put_decorators = [Remote('put')];
            _create_decorators = [Remote('create')];
            _addSource_decorators = [Remote('addSource')];
            _setSourceSelection_decorators = [Remote('setSourceSelection')];
            _removeSource_decorators = [Remote('removeSource')];
            _setSummary_decorators = [Remote('setSummary')];
            _setArtifact_decorators = [Remote('setArtifact')];
            _summarize_decorators = [Remote('summarize')];
            _generateStudio_decorators = [Remote('generateStudio')];
            _saveChatAnswer_decorators = [Remote('saveChatAnswer')];
            _delete_decorators = [Remote('delete')];
            __esDecorate(this, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_decorators, { kind: "method", name: "get", static: false, private: false, access: { has: obj => "get" in obj, get: obj => obj.get }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _candidates_decorators, { kind: "method", name: "candidates", static: false, private: false, access: { has: obj => "candidates" in obj, get: obj => obj.candidates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _put_decorators, { kind: "method", name: "put", static: false, private: false, access: { has: obj => "put" in obj, get: obj => obj.put }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _addSource_decorators, { kind: "method", name: "addSource", static: false, private: false, access: { has: obj => "addSource" in obj, get: obj => obj.addSource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setSourceSelection_decorators, { kind: "method", name: "setSourceSelection", static: false, private: false, access: { has: obj => "setSourceSelection" in obj, get: obj => obj.setSourceSelection }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _removeSource_decorators, { kind: "method", name: "removeSource", static: false, private: false, access: { has: obj => "removeSource" in obj, get: obj => obj.removeSource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setSummary_decorators, { kind: "method", name: "setSummary", static: false, private: false, access: { has: obj => "setSummary" in obj, get: obj => obj.setSummary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setArtifact_decorators, { kind: "method", name: "setArtifact", static: false, private: false, access: { has: obj => "setArtifact" in obj, get: obj => obj.setArtifact }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _summarize_decorators, { kind: "method", name: "summarize", static: false, private: false, access: { has: obj => "summarize" in obj, get: obj => obj.summarize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _generateStudio_decorators, { kind: "method", name: "generateStudio", static: false, private: false, access: { has: obj => "generateStudio" in obj, get: obj => obj.generateStudio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _saveChatAnswer_decorators, { kind: "method", name: "saveChatAnswer", static: false, private: false, access: { has: obj => "saveChatAnswer" in obj, get: obj => obj.saveChatAnswer }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['storage', 'storageDomain', 'tools'];
        static Config = s.object({
            runnerEnabled: s.boolean().default(false),
            runnerCwd: s.string().default(process.cwd()),
            maxEntries: s.number().step(1).min(1).required(),
            maxContentChars: s.number().step(1).min(1).required(),
            maxSourcesPerEntry: s.number().step(1).min(1).required(),
            maxSourceChars: s.number().step(1).min(1).required(),
            maxArtifactChars: s.number().step(1).min(1).required(),
            sqlitePath: s.string(),
        });
        table;
        mutationTail = Promise.resolve();
        activeJobs = new Map();
        /** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and generation limits. */
        constructor(ctx, config) {
            super(ctx, 'notebooks');
            this.config = config;
        }
        async [Service.init]() {
            const sqlitePath = this.config.sqlitePath?.trim() || defaultSharedSqlitePath();
            await ensurePluginPlatform(this.ctx, { domain: 'notebooks', sqlitePath });
            const domain = await this.ctx.storageDomain.open(notebooksDomainSpec);
            this.ctx.effect(() => () => domain.close(), 'notebooks.domainClose');
            this.table = domain.table('entries');
            await importLegacyNotebooksIfEmpty(legacyNotebooksSqlitePath(sqlitePath), sqlitePath, this.table);
            this.registerTools();
            this.ctx.on('agent/pre-step', async ({ signal }, next) => {
                const decision = await next();
                if (decision.kind === 'reject')
                    return decision;
                return { kind: 'enter', messages: await this.injectMentions(decision.messages, signal) };
            }, { prepend: true });
            this.ctx.effect(() => async () => {
                const runs = [...this.activeJobs.values()];
                for (const run of runs) {
                    run.controller.abort();
                    run.handle?.agent.cancel({ kind: 'disposed' });
                }
                await Promise.allSettled(runs.map(run => run.promise));
            }, 'notebooks.runnerDrain');
        }
        list(request) {
            const query = request.query?.trim().toLocaleLowerCase();
            const tag = request.tag?.trim().toLocaleLowerCase();
            const entries = [...this.requireTable().entries()]
                .map(([, entry]) => snapshot(entry))
                .filter(entry => query === undefined || query === '' || searchableText(entry).includes(query))
                .filter(entry => tag === undefined || tag === '' || entry.tags.some(candidate => candidate.toLocaleLowerCase() === tag))
                .filter(entry => request.sourceKind === undefined || entry.sources.some(source => source.kind === request.sourceKind))
                .sort((left, right) => right.updatedAt - left.updatedAt);
            return { entries };
        }
        get(request) {
            const entry = this.requireTable().get(request.id);
            return entry === undefined ? null : snapshot(entry);
        }
        candidates(request) {
            const query = request.query?.trim().toLocaleLowerCase() ?? '';
            const candidates = this.list({ query }).entries.slice(0, 20).map(entry => ({
                id: entry.id,
                title: entry.title,
                mention: formatNotebookMention(entry.id, entry.title || entry.id),
                summary: previewSummary(entry),
                summarizing: entry.summary.trim() === ''
                    && (entry.latestJob?.status === 'pending' || entry.latestJob?.status === 'running'),
            }));
            return { candidates };
        }
        put(request) {
            return this.enqueue(async () => {
                const title = requiredText(request.title, 'title');
                const content = requiredText(request.content, 'content');
                this.assertLength(content, this.config.maxContentChars, 'content');
                const table = this.requireTable();
                const id = request.id ?? NotebookId(`note-${randomUUID()}`);
                const current = table.get(id);
                if (current === undefined && table.size >= this.config.maxEntries)
                    throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
                const now = Date.now();
                const sources = current?.sources ?? [this.manualSource(title, content, now)];
                const entry = snapshot({
                    id, title, content,
                    summary: request.summary?.trim() ?? current?.summary ?? '',
                    tags: normalizeTags(request.tags ?? current?.tags ?? []),
                    sourceType: entryKindFromSources(sources),
                    sourceUrl: sources.find(source => source.url !== null)?.url ?? current?.sourceUrl ?? null,
                    fetchStatus: sources.some(source => source.status === 'pending_fetch') ? 'pending_fetch' : 'ready',
                    sources, artifacts: current?.artifacts ?? [], latestJob: current?.latestJob ?? null,
                    createdAt: current?.createdAt ?? now,
                    updatedAt: current === undefined ? now : Math.max(now, current.updatedAt + 1),
                });
                await table.put(id, entry);
                this.emitProgress(entry);
                if (current === undefined)
                    this.launchSummary(id);
                return snapshot(entry);
            });
        }
        create(request) {
            return this.enqueue(async () => {
                const sources = this.buildCreateSources(request);
                if (sources.length === 0)
                    throw new TypeError('notebooks: notebook requires at least one source');
                const table = this.requireTable();
                if (table.size >= this.config.maxEntries)
                    throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
                const now = Date.now();
                const first = sources[0];
                const title = request.title?.trim() || first.name;
                const id = NotebookId(`note-${randomUUID()}`);
                const pending = sources.some(source => source.status === 'pending_fetch');
                const entry = snapshot({
                    id, title, content: first.content,
                    summary: '', tags: normalizeTags(request.tags ?? []),
                    sourceType: entryKindFromSources(sources),
                    sourceUrl: sources.find(source => source.url !== null)?.url ?? null,
                    fetchStatus: pending ? 'pending_fetch' : 'ready',
                    sources, artifacts: [], latestJob: null, createdAt: now, updatedAt: now,
                });
                await table.put(id, entry);
                this.emitProgress(entry);
                this.launchSummary(id);
                return snapshot(entry);
            });
        }
        addSource(request) {
            return this.update(request.id, entry => {
                if (entry.sources.length >= this.config.maxSourcesPerEntry)
                    throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`);
                const source = this.buildSource(request);
                return this.withInvalidatedDerived({ ...entry, sources: [...entry.sources, source] });
            }).then(entry => { this.launchSummary(entry.id); return entry; });
        }
        setSourceSelection(request) {
            return this.update(request.id, entry => {
                const selected = new Set(request.sourceIds);
                const known = new Set(entry.sources.map(source => source.id));
                for (const id of selected)
                    if (!known.has(id))
                        throw new Error(`notebooks: source ${id} not found`);
                if (![...entry.sources].some(source => selected.has(source.id)))
                    throw new Error('notebooks: select at least one source');
                return this.withInvalidatedDerived({ ...entry, sources: entry.sources.map(source => ({ ...source, selected: selected.has(source.id) })) });
            }).then(entry => { this.launchSummary(entry.id); return entry; });
        }
        removeSource(request) {
            let removed = false;
            return this.update(request.id, entry => {
                const sources = entry.sources.filter(source => source.id !== request.sourceId);
                removed = sources.length !== entry.sources.length;
                return this.withInvalidatedDerived({ ...entry, sources });
            }).then(entry => {
                if (removed && entry.sources.length > 0)
                    this.launchSummary(entry.id);
                return { removed, entry };
            });
        }
        setSummary(request) {
            return this.update(request.id, entry => ({ ...entry, summary: requiredText(request.summary, 'summary') }));
        }
        setArtifact(request) {
            return this.update(request.id, entry => {
                const content = requiredText(request.content, `${request.kind} content`);
                this.assertLength(content, this.config.maxArtifactChars, `${request.kind} content`);
                const artifact = { kind: request.kind, content, updatedAt: Date.now() };
                return { ...entry, artifacts: [...entry.artifacts.filter(item => item.kind !== request.kind), artifact] };
            });
        }
        summarize(request) {
            const entry = this.requireEntry(request.id);
            this.launchSummary(entry.id);
            return Promise.resolve(snapshot(this.requireEntry(entry.id)));
        }
        generateStudio(request) {
            if (!this.config.runnerEnabled)
                return Promise.reject(new Error('notebooks: generation runner is disabled'));
            const entry = this.requireEntry(request.id);
            this.launchStudio(entry.id, request.kind);
            return Promise.resolve(snapshot(this.requireEntry(entry.id)));
        }
        saveChatAnswer(request) {
            const answerText = requiredText(request.answerText, 'answer');
            this.assertLength(answerText, this.config.maxSourceChars, 'answer');
            const title = request.title?.trim() || fallbackChatTitle(request.questionText ?? '', answerText);
            return this.enqueue(async () => {
                const table = this.requireTable();
                if (table.size >= this.config.maxEntries)
                    throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
                const now = Date.now();
                const id = NotebookId(`note-${randomUUID()}`);
                const source = this.createSource({
                    kind: 'chat_answer', name: title, content: answerText,
                    sessionId: optionalText(request.sessionId), messageId: optionalText(request.messageId), createdAt: now,
                });
                const entry = snapshot({
                    id, title, content: answerText, summary: '', tags: normalizeTags(request.tags ?? []),
                    sourceType: 'chat_answer', sourceUrl: null, fetchStatus: 'ready',
                    sources: [source], artifacts: [], latestJob: null, createdAt: now, updatedAt: now,
                });
                await table.put(id, entry);
                this.emitProgress(entry);
                this.launchSummary(id);
                return snapshot(entry);
            });
        }
        delete(request) {
            return this.enqueue(async () => {
                this.stopJob(request.id);
                const table = this.requireTable();
                const deleted = table.get(request.id) !== undefined;
                if (deleted)
                    await table.delete(request.id);
                return { deleted };
            });
        }
        registerTools() {
            this.ctx.tools.register(defineTool({
                name: 'notebook_list', description: 'Search durable notebooks, their summaries, and attached source text.',
                parameters: { query: { type: 'string' }, tag: { type: 'string' } },
                output: { schema: { type: 'object', additionalProperties: false, properties: { entries: { type: 'array', required: true, items: ENTRY_SCHEMA } } }, render: (_args, value) => [{ type: 'text', text: value.entries.length === 0 ? 'No notebooks matched.' : value.entries.map(entry => `- ${entry.title} (${entry.id})\n  ${entry.summary || entry.content}`).join('\n') }] },
                execute: args => Promise.resolve(this.list(args)), presentCall: args => ({ card: 'generic', kind: 'search', title: 'Search notebooks', rawInput: args.query ?? args.tag }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_write', description: 'Create or update a durable notebook entry.',
                parameters: { id: { type: 'string' }, title: { type: 'string', required: true }, content: { type: 'string', required: true }, summary: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } },
                output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Saved notebook "${value.title}" (${value.id}).` }] },
                execute: args => this.put({ title: args.title, content: args.content, ...(args.summary === undefined ? {} : { summary: args.summary }), ...(args.tags === undefined ? {} : { tags: args.tags }), ...(args.id === undefined ? {} : { id: NotebookId(args.id) }) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: args.id === undefined ? 'Create notebook' : 'Update notebook', rawInput: args.title }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_add_source', description: 'Attach source text after reading a URL, document, conversation answer, or manual note.',
                parameters: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['manual', 'url', 'document', 'chat_answer'] }, name: { type: 'string', required: true }, url: { type: 'string' }, mimeType: { type: 'string' }, content: { type: 'string' } },
                output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Notebook ${value.id} now has ${value.sources.length} sources.` }] },
                execute: args => this.addSource({ ...args, id: NotebookId(args.id) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Add notebook source', rawInput: args.name }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_set_summary', description: 'Save an evidence-grounded overview of the notebook selected sources.',
                parameters: { id: { type: 'string', required: true }, summary: { type: 'string', required: true } },
                output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Updated summary for ${value.id}.` }] },
                execute: args => this.setSummary({ id: NotebookId(args.id), summary: args.summary }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update notebook summary', rawInput: args.id }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_set_artifact', description: 'Save a Markdown report or Mermaid mind map derived from selected notebook sources.',
                parameters: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['mindmap', 'report'] }, content: { type: 'string', required: true } },
                output: { schema: ENTRY_SCHEMA, render: (args, value) => [{ type: 'text', text: `Saved ${args.kind} for ${value.id}.` }] },
                execute: args => this.setArtifact({ id: NotebookId(args.id), kind: args.kind, content: args.content }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update notebook Studio', rawInput: args.kind }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_save_chat_answer', description: 'Save a conversation answer as a durable notebook for later follow-up.',
                parameters: { title: { type: 'string' }, answerText: { type: 'string', required: true }, questionText: { type: 'string' }, sessionId: { type: 'string' }, messageId: { type: 'string' } },
                output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Saved chat answer as notebook "${value.title}" (${value.id}).` }] },
                execute: args => this.saveChatAnswer(args), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Save chat answer', rawInput: args.title ?? args.answerText.slice(0, 32) }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_delete', description: 'Delete one durable notebook by exact id.', parameters: { id: { type: 'string', required: true } },
                output: { schema: { type: 'object', additionalProperties: false, properties: { deleted: { type: 'boolean', required: true } } }, render: (args, value) => [{ type: 'text', text: value.deleted ? `Deleted notebook ${args.id}.` : `Notebook ${args.id} was already absent.` }] },
                execute: args => this.delete({ id: NotebookId(args.id) }), presentCall: args => ({ card: 'generic', kind: 'delete', title: 'Delete notebook', rawInput: args.id }),
            }));
        }
        async injectMentions(messages, signal) {
            const prepared = await Promise.all(messages.map(async (message) => {
                if (message.source.kind !== 'user')
                    return [message];
                const ids = [];
                const content = message.content.map((block) => {
                    if (block.type !== 'text')
                        return block;
                    const parsed = parseNotebookMentions(block.text);
                    ids.push(...parsed.ids);
                    return { type: 'text', text: parsed.text };
                });
                const id = ids[0];
                if (id === undefined)
                    return [message];
                signal.throwIfAborted();
                const entry = this.requireTable().get(id);
                if (entry === undefined)
                    return [freezeMessage({ ...message, content })];
                const summary = entry.summary.trim() || previewSummary(entry);
                const context = createUserMessage({
                    content: [{ type: 'text', text: buildAskContext(entry, summary) }],
                    source: {
                        kind: 'plugin',
                        plugin: '@deepseek-ai/dsh-notebooks',
                        form: 'recall',
                        notebookId: entry.id,
                        notebookTitle: entry.title || entry.id,
                    },
                });
                return [freezeMessage({ ...message, content }), context];
            }));
            return prepared.flat();
        }
        launchSummary(id) {
            if (!this.config.runnerEnabled)
                return;
            this.launchJob(id, 'summary', async (run, entry) => {
                const pending = entry.sources.filter(source => source.kind === 'url' && source.content === '' && source.url !== null);
                if (pending.length > 0) {
                    await this.patchJob(id, run.jobId, {
                        status: 'running', stage: 'fetch',
                        partialText: pending[0].name || pending[0].url || '',
                    });
                }
                const fetched = await this.fetchPendingSources(entry, run.controller.signal, run.jobId);
                await this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: '' });
                const active = selectedSources(fetched);
                const contentText = truncateForGeneration(combineSources(active) || fetched.content);
                const generated = parseGeneratedSummary(await this.complete({
                    run, system: SUMMARY_SYSTEM_PROMPT,
                    user: ['Please write a detailed note summary for future follow-up questions.', contentText].join('\n\n'),
                    onDraft: text => { void this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: text }); },
                }));
                const title = generated.title || fallbackTitle({ title: fetched.title, sourceUrl: fetched.sourceUrl, contentText });
                const summary = generated.summary;
                if (summary === '')
                    throw new Error('Empty note summary');
                await this.update(id, current => ({
                    ...current, title, content: contentText || current.content, summary,
                    sources: fetched.sources, fetchStatus: contentText || current.content ? 'ready' : current.fetchStatus,
                    latestJob: job(run.jobId, 'summary', 'completed', summary, ''),
                }));
            });
        }
        launchStudio(id, kind) {
            if (!this.config.runnerEnabled)
                throw new Error('notebooks: generation runner is disabled');
            this.launchJob(id, kind, async (run, entry) => {
                const sourceText = combineSources(selectedSources(entry));
                if (sourceText === '')
                    throw new Error('No selected source content is available');
                const content = (await this.complete({
                    run, system: kind === 'mindmap' ? MINDMAP_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT,
                    user: studioPrompt(kind) + '\n\n' + sourceText,
                    onDraft: text => { void this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: text }); },
                })).trim();
                if (content === '')
                    throw new Error('Model returned empty content');
                this.assertLength(content, this.config.maxArtifactChars, `${kind} content`);
                const artifact = { kind, content, updatedAt: Date.now() };
                await this.update(id, current => ({
                    ...current,
                    artifacts: [...current.artifacts.filter(item => item.kind !== kind), artifact],
                    latestJob: job(run.jobId, kind, 'completed', content, ''),
                }));
            });
        }
        launchJob(id, kind, work) {
            this.stopJob(id);
            const jobId = `notejob-${randomUUID()}`;
            const run = { jobId, controller: new AbortController() };
            this.activeJobs.set(id, run);
            void this.update(id, entry => ({ ...entry, latestJob: job(jobId, kind, 'pending', '', '', kind === 'summary' ? 'fetch' : 'generate') }));
            run.promise = (async () => {
                try {
                    await this.update(id, entry => ({
                        ...entry,
                        latestJob: job(jobId, kind, 'running', '', '', kind === 'summary' ? 'fetch' : 'generate'),
                    }));
                    const entry = this.requireEntry(id);
                    if (this.activeJobs.get(id)?.jobId !== jobId)
                        return;
                    await work(run, entry);
                }
                catch (error) {
                    if (run.controller.signal.aborted)
                        return;
                    const message = error instanceof Error ? error.message : String(error);
                    await this.update(id, entry => ({ ...entry, latestJob: job(jobId, kind, 'failed', entry.latestJob?.partialText ?? '', message) })).catch(() => undefined);
                }
                finally {
                    if (this.activeJobs.get(id)?.jobId === jobId)
                        this.activeJobs.delete(id);
                }
            })();
        }
        async fetchPendingSources(entry, signal, jobId) {
            const sources = [...entry.sources];
            const pendingIndexes = sources
                .map((source, index) => source.kind === 'url' && source.content === '' && source.url !== null ? index : -1)
                .filter(index => index >= 0);
            let fetchedCount = 0;
            for (let index = 0; index < sources.length; index += 1) {
                const source = sources[index];
                if (source.kind !== 'url' || source.content !== '' || source.url === null)
                    continue;
                fetchedCount += 1;
                if (jobId !== undefined) {
                    await this.patchJob(entry.id, jobId, {
                        status: 'running',
                        stage: 'fetch',
                        partialText: `${String(fetchedCount)}/${String(pendingIndexes.length)} ${source.name || source.url}`,
                    });
                }
                try {
                    const fetched = await this.fetchUrl(source.url, signal);
                    sources[index] = {
                        ...source, name: fetched.title || source.name, content: fetched.content,
                        status: fetched.content === '' ? 'failed' : 'ready',
                    };
                }
                catch {
                    sources[index] = { ...source, status: 'failed' };
                }
            }
            const content = selectedSources({ ...entry, sources }).map(source => source.content).find(text => text !== '') ?? entry.content;
            const fetchStatus = sources.some(source => source.status === 'pending_fetch')
                ? 'pending_fetch'
                : sources.some(source => source.status === 'failed') && content === '' ? 'failed' : 'ready';
            const next = { ...entry, sources, content, fetchStatus, sourceUrl: sources.find(source => source.url !== null)?.url ?? entry.sourceUrl };
            await this.update(entry.id, current => ({ ...current, sources: next.sources, content: next.content, fetchStatus: next.fetchStatus, sourceUrl: next.sourceUrl }));
            return this.requireEntry(entry.id);
        }
        async fetchUrl(url, signal) {
            const web = this.ctx.get('web');
            return web === undefined
                ? fetchNotebookUrl(url, { signal })
                : fetchNotebookUrl(url, { signal, web });
        }
        async complete(spec) {
            const agents = this.ctx.get('agents');
            const agentDefaultModel = this.ctx.get('agentDefaultModel');
            const agentPresets = this.ctx.get('agentPresets');
            if (agents === undefined || agentDefaultModel === undefined || agentPresets === undefined) {
                throw new Error('notebooks: generation agents are not available');
            }
            const selection = agentDefaultModel.currentSelection();
            const handle = await agents.create({
                sessionId: SessionId(`notebooks-run-${randomUUID()}`),
                meta: { cwd: resolve(this.config.runnerCwd), origin: 'subagent', delegationDepth: 1 },
                agentOptions: { provider: selection.provider, model: selection.model },
                signal: spec.run.controller.signal,
                setup: async (agentCtx) => {
                    await agentPresets.mount(agentCtx, 'standard');
                    agentCtx.tools.restrict({ allow: [] });
                    agentCtx.systemPrompt.section({ name: 'notebooks:runner', order: 10_000, text: spec.system });
                },
            });
            spec.run.handle = handle;
            const stopDraft = watchDraft(handle, spec.onDraft);
            try {
                if (spec.run.controller.signal.aborted)
                    return '';
                handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: spec.user }], source: { kind: 'user' } }));
                await handle.agent.whenIdle();
                return lastAssistantText(handle);
            }
            finally {
                stopDraft();
                await handle.dispose();
                delete spec.run.handle;
            }
        }
        async patchJob(id, jobId, patch) {
            await this.update(id, entry => {
                if (entry.latestJob?.id !== jobId)
                    return entry;
                return { ...entry, latestJob: { ...entry.latestJob, ...patch, updatedAt: Date.now() } };
            }).catch(() => undefined);
        }
        stopJob(id) {
            const run = this.activeJobs.get(id);
            if (run === undefined)
                return;
            run.controller.abort();
            run.handle?.agent.cancel({ kind: 'user' });
            this.activeJobs.delete(id);
        }
        buildCreateSources(request) {
            const now = Date.now();
            const sources = [];
            for (const raw of request.urls ?? []) {
                const url = raw.trim();
                if (url === '')
                    continue;
                if (!isAbsoluteHttpUrl(url))
                    throw new TypeError('notebooks: source URL requires an absolute http or https URL');
                sources.push(this.createSource({ kind: 'url', name: hostname(url), url, content: '', status: 'pending_fetch', createdAt: now }));
            }
            const content = request.content?.trim() ?? '';
            if (content !== '') {
                this.assertLength(content, this.config.maxContentChars, 'content');
                sources.push(this.manualSource(request.title?.trim() || 'Manual note', content, now));
            }
            for (const document of request.documents ?? []) {
                const body = requiredText(document.content, 'document content');
                this.assertLength(body, this.config.maxSourceChars, 'document content');
                sources.push(this.createSource({ kind: 'document', name: requiredText(document.name, 'document name'), mimeType: document.mimeType || 'text/plain', content: body, createdAt: now }));
            }
            if (sources.length > this.config.maxSourcesPerEntry)
                throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`);
            return sources;
        }
        buildSource(request) {
            const url = optionalText(request.url);
            const content = request.content?.trim() ?? '';
            if (request.kind === 'url') {
                const href = url ?? '';
                if (!isAbsoluteHttpUrl(href))
                    throw new TypeError('notebooks: source URL requires an absolute http or https URL');
                return this.createSource({
                    kind: 'url', name: requiredText(request.name, 'source name'), url: href, content,
                    status: content === '' ? 'pending_fetch' : 'ready',
                });
            }
            if (content === '')
                throw new TypeError('notebooks: source content is required');
            this.assertLength(content, this.config.maxSourceChars, 'source content');
            return this.createSource({
                kind: request.kind, name: requiredText(request.name, 'source name'), url,
                mimeType: optionalText(request.mimeType), content,
                sessionId: optionalText(request.sessionId), messageId: optionalText(request.messageId),
            });
        }
        createSource(payload) {
            return {
                id: NotebookSourceId(`source-${randomUUID()}`), kind: payload.kind, name: payload.name,
                url: payload.url ?? null, mimeType: payload.mimeType ?? (payload.kind === 'manual' ? 'text/plain' : null),
                content: payload.content, selected: payload.selected !== false,
                status: payload.status ?? 'ready', sessionId: payload.sessionId ?? null, messageId: payload.messageId ?? null,
                createdAt: payload.createdAt ?? Date.now(),
            };
        }
        manualSource(title, content, createdAt) {
            return this.createSource({ kind: 'manual', name: title, mimeType: 'text/plain', content, createdAt });
        }
        withInvalidatedDerived(entry) {
            return {
                ...entry,
                summary: '',
                artifacts: [],
                sourceType: entryKindFromSources(entry.sources),
                sourceUrl: entry.sources.find(source => source.url !== null)?.url ?? null,
                fetchStatus: entry.sources.some(source => source.status === 'pending_fetch') ? 'pending_fetch' : 'ready',
            };
        }
        update(id, mutate) {
            return this.enqueue(async () => {
                const table = this.requireTable();
                const current = table.get(id);
                if (current === undefined)
                    throw new Error(`notebooks: entry ${id} not found`);
                const entry = snapshot({ ...mutate(snapshot(current)), updatedAt: Math.max(Date.now(), current.updatedAt + 1) });
                await table.put(id, entry);
                this.emitProgress(entry);
                return snapshot(entry);
            });
        }
        enqueue(operation) {
            const result = this.mutationTail.then(operation);
            this.mutationTail = result.then(() => undefined, () => undefined);
            return result;
        }
        requireTable() {
            if (this.table === undefined)
                throw new Error('notebooks: durable domain is not initialized');
            return this.table;
        }
        requireEntry(id) {
            const entry = this.requireTable().get(id);
            if (entry === undefined)
                throw new Error(`notebooks: entry ${id} not found`);
            return snapshot(entry);
        }
        emitProgress(entry) {
            this.ctx.emit('notebooks/progress', snapshot(entry));
        }
        assertLength(value, limit, field) {
            if (value.length > limit)
                throw new RangeError(`notebooks: ${field} exceeds ${limit} characters`);
        }
    };
})();
export { NotebooksService };
function requiredText(value, field) { const text = value.trim(); if (text === '')
    throw new TypeError(`notebooks: ${field} must not be blank`); return text; }
function optionalText(value) { const text = value?.trim(); return text === undefined || text === '' ? null : text; }
function normalizeTags(tags) { return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag !== ''))]; }
function searchableText(entry) { return [entry.title, entry.content, entry.summary, ...entry.tags, ...entry.sources.flatMap(source => [source.name, source.url ?? '', source.content])].join('\n').toLocaleLowerCase(); }
function hostname(value) { try {
    return new URL(value).hostname.replace(/^www\./u, '');
}
catch {
    return value || '网页资料';
} }
function job(id, kind, status, partialText, errorText, stage = 'generate') {
    return { id, kind, status, stage, partialText, errorText, updatedAt: Date.now() };
}
function snapshot(entry) {
    return Object.freeze({
        ...entry, tags: [...entry.tags],
        sources: entry.sources.map(source => Object.freeze({ ...source })),
        artifacts: entry.artifacts.map(artifact => Object.freeze({ ...artifact })),
        latestJob: entry.latestJob === null ? null : Object.freeze({ ...entry.latestJob }),
    });
}
function lastAssistantText(handle) {
    const agent = handle.agent;
    const messages = Array.isArray(agent.messages) ? agent.messages : Array.isArray(agent.session?.messages) ? agent.session.messages : [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const message = messages[index];
        if (message.role !== 'assistant')
            continue;
        const text = messageText(message.content);
        if (text !== '')
            return text;
    }
    return '';
}
function messageText(content) {
    if (typeof content === 'string')
        return content;
    if (!Array.isArray(content))
        return '';
    return content.map(block => typeof block === 'string' ? block : String(block.text ?? '')).join('');
}
function watchDraft(handle, onDraft) {
    let last = '';
    let streamed = '';
    let timer;
    const push = (text) => {
        const next = text.trim();
        if (next === '' || next === last)
            return;
        last = next;
        onDraft(next.slice(0, 12000));
    };
    const emit = () => { push(streamed || lastAssistantText(handle)); };
    const schedule = () => {
        if (timer !== undefined)
            return;
        timer = setTimeout(() => { timer = undefined; emit(); }, 80);
    };
    const ctx = handle.agent.ctx;
    const offChunk = ctx?.on?.('assistant/chunk', payload => {
        const chunk = payload?.chunk;
        if (chunk?.type === 'text-delta' && chunk.text) {
            const first = streamed === '';
            streamed += chunk.text;
            if (first)
                emit();
            else
                schedule();
        }
    });
    const offMessage = ctx?.on?.('assistant/message', payload => {
        const text = messageText(payload?.message?.content);
        if (text !== '') {
            streamed = text;
            emit();
        }
    });
    const poll = setInterval(emit, 200);
    emit();
    return () => {
        if (timer !== undefined)
            clearTimeout(timer);
        clearInterval(poll);
        offChunk?.();
        offMessage?.();
    };
}
export default NotebooksService;
//# sourceMappingURL=index.js.map