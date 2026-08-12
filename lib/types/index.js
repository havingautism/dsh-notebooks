/**
 * Cross-session notebook storage with model tools and a typed Remote API.
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
import { Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { GatewayService, Remote } from '@deepseek-ai/dsh-type-meta';
import { notebooksDomainSpec } from "./spec.js";
import { NotebookId } from "./types.js";
export { NotebookId } from "./types.js";
export { notebookEntrySchema, notebooksDomainSpec } from "./spec.js";
const ENTRY_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        tags: { type: 'array', required: true, items: { type: 'string' } },
        createdAt: { type: 'number', required: true },
        updatedAt: { type: 'number', required: true },
    },
};
/** Durable notebook service. */
let NotebooksService = (() => {
    let _classSuper = GatewayService;
    let _instanceExtraInitializers = [];
    let _list_decorators;
    let _put_decorators;
    let _delete_decorators;
    return class NotebooksService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _list_decorators = [Remote('list')];
            _put_decorators = [Remote('put')];
            _delete_decorators = [Remote('delete')];
            __esDecorate(this, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _put_decorators, { kind: "method", name: "put", static: false, private: false, access: { has: obj => "put" in obj, get: obj => obj.put }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['storageDomain', 'tools'];
        /** Loader validation for deployment-varying notebook limits. */
        static Config = s.object({
            maxEntries: s.number().step(1).min(1).required(),
            maxContentChars: s.number().step(1).min(1).required(),
        });
        table;
        mutationTail = Promise.resolve();
        /**
         * @param ctx - Host context carrying storage and tool registries.
         * @param config - Capacity and content limits.
         */
        constructor(ctx, config) {
            super(ctx, 'notebooks');
            this.config = config;
        }
        /** Open durable storage and publish the three model tools. */
        async [Service.init]() {
            const domain = await this.ctx.storageDomain.open(notebooksDomainSpec);
            this.ctx.effect(() => () => domain.close(), 'notebooks.domainClose');
            this.table = domain.table('entries');
            this.registerTools();
        }
        /** List entries matching optional text and tag filters. */
        list(request) {
            const query = request.query?.trim().toLocaleLowerCase();
            const tag = request.tag?.trim().toLocaleLowerCase();
            const entries = [...this.requireTable().entries()]
                .map(([, entry]) => snapshot(entry))
                .filter(entry => query === undefined || query === ''
                || `${entry.title}\n${entry.content}\n${entry.tags.join('\n')}`.toLocaleLowerCase().includes(query))
                .filter(entry => tag === undefined || tag === ''
                || entry.tags.some(candidate => candidate.toLocaleLowerCase() === tag))
                .sort((left, right) => right.updatedAt - left.updatedAt);
            return { entries };
        }
        /** Create or replace an entry after validating configured limits. */
        put(request) {
            return this.enqueue(async () => {
                const title = requiredText(request.title, 'title');
                const content = requiredText(request.content, 'content');
                if (content.length > this.config.maxContentChars) {
                    throw new RangeError(`notebooks: content exceeds ${this.config.maxContentChars} characters`);
                }
                const table = this.requireTable();
                const id = request.id ?? NotebookId(`note-${randomUUID()}`);
                const current = table.get(id);
                if (current === undefined && table.size >= this.config.maxEntries) {
                    throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
                }
                const now = Date.now();
                const entry = snapshot({
                    id,
                    title,
                    content,
                    tags: normalizeTags(request.tags ?? []),
                    createdAt: current?.createdAt ?? now,
                    updatedAt: current === undefined ? now : Math.max(now, current.updatedAt),
                });
                await table.put(id, entry);
                return snapshot(entry);
            });
        }
        /** Delete an entry; absence is a successful stable outcome. */
        delete(request) {
            return this.enqueue(async () => {
                const table = this.requireTable();
                const deleted = table.get(request.id) !== undefined;
                if (deleted)
                    await table.delete(request.id);
                return { deleted };
            });
        }
        /** Register model-facing CRUD tools over the same service operations. */
        registerTools() {
            this.ctx.tools.register(defineTool({
                name: 'notebook_list',
                description: 'Search durable cross-session notebook entries before relying on remembered facts.',
                parameters: {
                    query: { type: 'string', description: 'Optional text matched against titles, content, and tags.' },
                    tag: { type: 'string', description: 'Optional exact tag filter.' },
                },
                output: {
                    schema: {
                        type: 'object', additionalProperties: false,
                        properties: { entries: { type: 'array', required: true, items: ENTRY_SCHEMA } },
                    },
                    render: (_args, value) => [{ type: 'text', text: value.entries.length === 0
                                ? 'No notebook entries matched.'
                                : value.entries.map(entry => `- ${entry.title} (${entry.id})\n  ${entry.content}`).join('\n') }],
                },
                execute: args => Promise.resolve(this.list(args)),
                presentCall: args => ({ card: 'generic', kind: 'search', title: 'Search notebooks', rawInput: args.query ?? args.tag }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_write',
                description: 'Create or update a durable notebook entry that remains available across Sessions.',
                parameters: {
                    id: { type: 'string', description: 'Existing notebook id to replace; omit to create.' },
                    title: { type: 'string', required: true, description: 'Short, specific entry title.' },
                    content: { type: 'string', required: true, description: 'Complete note content.' },
                    tags: { type: 'array', items: { type: 'string' }, description: 'Searchable tags.' },
                },
                output: {
                    schema: ENTRY_SCHEMA,
                    render: (_args, value) => [{ type: 'text', text: `Saved notebook entry "${value.title}" (${value.id}).` }],
                },
                execute: async (args) => this.put({
                    title: args.title,
                    content: args.content,
                    ...(args.tags === undefined ? {} : { tags: args.tags }),
                    ...(args.id === undefined ? {} : { id: NotebookId(args.id) }),
                }),
                presentCall: args => ({ card: 'generic', kind: 'edit', title: args.id === undefined ? 'Create note' : 'Update note', rawInput: args.title }),
            }));
            this.ctx.tools.register(defineTool({
                name: 'notebook_delete',
                description: 'Delete one durable notebook entry by its exact id.',
                parameters: { id: { type: 'string', required: true, description: 'Notebook id returned by notebook_list.' } },
                output: {
                    schema: {
                        type: 'object', additionalProperties: false,
                        properties: { deleted: { type: 'boolean', required: true } },
                    },
                    render: (args, value) => [{ type: 'text', text: value.deleted
                                ? `Deleted notebook entry ${args.id}.`
                                : `Notebook entry ${args.id} was already absent.` }],
                },
                execute: async (args) => this.delete({ id: NotebookId(args.id) }),
                presentCall: args => ({ card: 'generic', kind: 'delete', title: 'Delete note', rawInput: args.id }),
            }));
        }
        /** Serialize read-check-write mutations. */
        enqueue(operation) {
            const result = this.mutationTail.then(operation);
            this.mutationTail = result.then(() => undefined, () => undefined);
            return result;
        }
        /** Resolve the initialized table. */
        requireTable() {
            if (this.table === undefined)
                throw new Error('notebooks: durable domain is not initialized');
            return this.table;
        }
    };
})();
export { NotebooksService };
function requiredText(value, field) {
    const text = value.trim();
    if (text === '')
        throw new TypeError(`notebooks: ${field} must not be blank`);
    return text;
}
function normalizeTags(tags) {
    return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag !== ''))];
}
function snapshot(entry) {
    return Object.freeze({ ...entry, tags: [...entry.tags] });
}
export default NotebooksService;
//# sourceMappingURL=index.js.map