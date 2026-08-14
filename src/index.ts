/**
 * Cross-session notebook workspace with sources, summaries, Studio artifacts,
 * model tools, and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */

import { randomUUID } from 'node:crypto'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { notebooksDomainSpec } from './spec.ts'
import { NotebookId, NotebookSourceId } from './types.ts'
import type {
  NotebookAddSourceRequest,
  NotebookArtifact,
  NotebookArtifactRequest,
  NotebookDeleteRequest,
  NotebookDeleteResult,
  NotebookEntry,
  NotebookGetRequest,
  NotebookListRequest,
  NotebookListResult,
  NotebookPutRequest,
  NotebookRemoveSourceRequest,
  NotebookRemoveSourceResult,
  NotebookSource,
  NotebookSourceSelectionRequest,
  NotebookSummaryRequest,
} from './types.ts'

export type * from './types.ts'
export { NotebookId, NotebookSourceId } from './types.ts'
export { notebookArtifactSchema, notebookEntrySchema, notebookSourceSchema, notebooksDomainSpec } from './spec.ts'

/** Required notebook capacity and content policy. */
export interface Config {
  /** Maximum durable notebook entries. */
  readonly maxEntries: number
  /** Maximum characters in the primary note body. */
  readonly maxContentChars: number
  /** Maximum attached sources in one notebook, including the primary note. */
  readonly maxSourcesPerEntry: number
  /** Maximum captured characters in one attached source. */
  readonly maxSourceChars: number
  /** Maximum characters in one Studio artifact. */
  readonly maxArtifactChars: number
}

declare module '@deepseek-ai/cordis' {
  interface Context { notebooks: NotebooksService }
}

const ENTRY_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    tags: { type: 'array', required: true, items: { type: 'string' } },
    sources: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
      id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['manual', 'url', 'document', 'chat_answer'] },
      name: { type: 'string', required: true }, url: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
      mimeType: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] }, content: { type: 'string', required: true },
      selected: { type: 'boolean', required: true }, createdAt: { type: 'number', required: true },
    } } },
    artifacts: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
      kind: { type: 'string', required: true, enum: ['mindmap', 'report'] }, content: { type: 'string', required: true }, updatedAt: { type: 'number', required: true },
    } } },
    createdAt: { type: 'number', required: true },
    updatedAt: { type: 'number', required: true },
  },
} as const

/** Durable notebook service. */
export class NotebooksService extends TypertRemoteService {
  static inject = ['storageDomain', 'tools']

  /** Loader validation for deployment-varying notebook limits. */
  static Config: s<Config> = s.object({
    maxEntries: s.number().step(1).min(1).required(),
    maxContentChars: s.number().step(1).min(1).required(),
    maxSourcesPerEntry: s.number().step(1).min(1).required(),
    maxSourceChars: s.number().step(1).min(1).required(),
    maxArtifactChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<NotebookId, NotebookEntry>
  private mutationTail: Promise<void> = Promise.resolve()

  /** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and content limits. */
  constructor(ctx: Context, private readonly config: Config) { super(ctx, 'notebooks') }

  /** Open durable storage and publish notebook Tools. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(notebooksDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'notebooks.domainClose')
    this.table = domain.table('entries')
    this.registerTools()
  }

  /**
   * List entries matching optional text, tag, and source filters.
   * @param request - optional notebook filters.
   * @returns matching entries ordered by newest edit.
   */
  @Remote('list')
  list(request: NotebookListRequest): NotebookListResult {
    const query = request.query?.trim().toLocaleLowerCase()
    const tag = request.tag?.trim().toLocaleLowerCase()
    const entries = [...this.requireTable().entries()]
      .map(([, entry]) => snapshot(entry))
      .filter(entry => query === undefined || query === '' || searchableText(entry).includes(query))
      .filter(entry => tag === undefined || tag === '' || entry.tags.some(candidate => candidate.toLocaleLowerCase() === tag))
      .filter(entry => request.sourceKind === undefined || entry.sources.some(source => source.kind === request.sourceKind))
      .sort((left, right) => right.updatedAt - left.updatedAt)
    return { entries }
  }

  /**
   * Read one exact notebook.
   * @param request - notebook identity to read.
   * @returns detached notebook data, or null when absent.
   */
  @Remote('get')
  get(request: NotebookGetRequest): NotebookEntry | null {
    const entry = this.requireTable().get(request.id)
    return entry === undefined ? null : snapshot(entry)
  }

  /**
   * Create or replace a notebook after validating configured limits.
   * @param request - complete notebook write request.
   * @returns the detached stored notebook.
   */
  @Remote('put')
  put(request: NotebookPutRequest): Promise<NotebookEntry> {
    return this.enqueue(async () => {
      const title = requiredText(request.title, 'title')
      const content = requiredText(request.content, 'content')
      this.assertLength(content, this.config.maxContentChars, 'content')
      const table = this.requireTable()
      const id = request.id ?? NotebookId(`note-${randomUUID()}`)
      const current = table.get(id)
      if (current === undefined && table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`)
      const now = Date.now()
      const entry = snapshot({
        id, title, content,
        summary: request.summary?.trim() ?? current?.summary ?? '',
        tags: normalizeTags(request.tags ?? current?.tags ?? []),
        sources: current?.sources ?? [manualSource(title, content, now)],
        artifacts: current?.artifacts ?? [],
        createdAt: current?.createdAt ?? now,
        updatedAt: current === undefined ? now : Math.max(now, current.updatedAt + 1),
      })
      await table.put(id, entry)
      return snapshot(entry)
    })
  }

  /**
   * Attach a selected source to a notebook.
   * @param request - source content and owning notebook identity.
   * @returns the updated detached notebook.
   */
  @Remote('addSource')
  addSource(request: NotebookAddSourceRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      if (entry.sources.length >= this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`)
      const content = requiredText(request.content, 'source content')
      this.assertLength(content, this.config.maxSourceChars, 'source content')
      const source: NotebookSource = {
        id: NotebookSourceId(`source-${randomUUID()}`), kind: request.kind,
        name: requiredText(request.name, 'source name'), url: optionalText(request.url),
        mimeType: optionalText(request.mimeType), content, selected: true, createdAt: Date.now(),
      }
      return { ...entry, sources: [...entry.sources, source] }
    })
  }

  /**
   * Replace the source selection used for summaries and Studio artifacts.
   * @param request - owning notebook and selected source identities.
   * @returns the updated detached notebook.
   */
  @Remote('setSourceSelection')
  setSourceSelection(request: NotebookSourceSelectionRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      const selected = new Set(request.sourceIds)
      const known = new Set(entry.sources.map(source => source.id))
      for (const id of selected) if (!known.has(id)) throw new Error(`notebooks: source ${id} not found`)
      return { ...entry, sources: entry.sources.map(source => ({ ...source, selected: selected.has(source.id) })) }
    })
  }

  /**
   * Remove one source and report whether it existed.
   * @param request - notebook and source identities.
   * @returns the removal outcome and updated notebook.
   */
  @Remote('removeSource')
  removeSource(request: NotebookRemoveSourceRequest): Promise<NotebookRemoveSourceResult> {
    let removed = false
    return this.update(request.id, entry => {
      const sources = entry.sources.filter(source => source.id !== request.sourceId)
      removed = sources.length !== entry.sources.length
      return { ...entry, sources }
    }).then(entry => ({ removed, entry }))
  }

  /**
   * Replace the overview synthesized from selected sources.
   * @param request - notebook identity and new overview.
   * @returns the updated detached notebook.
   */
  @Remote('setSummary')
  setSummary(request: NotebookSummaryRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => ({ ...entry, summary: requiredText(request.summary, 'summary') }))
  }

  /**
   * Create or replace a report or Mermaid mind-map artifact.
   * @param request - notebook identity and Studio artifact content.
   * @returns the updated detached notebook.
   */
  @Remote('setArtifact')
  setArtifact(request: NotebookArtifactRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      const content = requiredText(request.content, `${request.kind} content`)
      this.assertLength(content, this.config.maxArtifactChars, `${request.kind} content`)
      const artifact: NotebookArtifact = { kind: request.kind, content, updatedAt: Date.now() }
      return { ...entry, artifacts: [...entry.artifacts.filter(item => item.kind !== request.kind), artifact] }
    })
  }

  /**
   * Delete an entry; absence is a successful stable outcome.
   * @param request - notebook identity to delete.
   * @returns whether the notebook existed.
   */
  @Remote('delete')
  delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const deleted = table.get(request.id) !== undefined
      if (deleted) await table.delete(request.id)
      return { deleted }
    })
  }

  private registerTools(): void {
    this.ctx.tools.register(defineTool({
      name: 'notebook_list', description: 'Search durable notebooks, their summaries, and attached source text.',
      parameters: { query: { type: 'string' }, tag: { type: 'string' } },
      output: { schema: { type: 'object', additionalProperties: false, properties: { entries: { type: 'array', required: true, items: ENTRY_SCHEMA } } }, render: (_args, value) => [{ type: 'text', text: value.entries.length === 0 ? 'No notebooks matched.' : value.entries.map(entry => `- ${entry.title} (${entry.id})\n  ${entry.summary || entry.content}`).join('\n') }] },
      execute: args => Promise.resolve(this.list(args)), presentCall: args => ({ card: 'generic', kind: 'search', title: 'Search notebooks', rawInput: args.query ?? args.tag }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_write', description: 'Create or update a durable notebook entry.',
      parameters: { id: { type: 'string' }, title: { type: 'string', required: true }, content: { type: 'string', required: true }, summary: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } },
      output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Saved notebook "${value.title}" (${value.id}).` }] },
      execute: args => this.put({ title: args.title, content: args.content, ...(args.summary === undefined ? {} : { summary: args.summary }), ...(args.tags === undefined ? {} : { tags: args.tags }), ...(args.id === undefined ? {} : { id: NotebookId(args.id) }) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: args.id === undefined ? 'Create notebook' : 'Update notebook', rawInput: args.title }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_add_source', description: 'Attach source text after reading a URL, document, conversation answer, or manual note.',
      parameters: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['manual', 'url', 'document', 'chat_answer'] }, name: { type: 'string', required: true }, url: { type: 'string' }, mimeType: { type: 'string' }, content: { type: 'string', required: true } },
      output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Notebook ${value.id} now has ${value.sources.length} sources.` }] },
      execute: args => this.addSource({ ...args, id: NotebookId(args.id) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Add notebook source', rawInput: args.name }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_set_summary', description: 'Save an evidence-grounded overview of the notebook selected sources.',
      parameters: { id: { type: 'string', required: true }, summary: { type: 'string', required: true } },
      output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Updated summary for ${value.id}.` }] },
      execute: args => this.setSummary({ id: NotebookId(args.id), summary: args.summary }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update notebook summary', rawInput: args.id }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_set_artifact', description: 'Save a Markdown report or Mermaid mind map derived from selected notebook sources.',
      parameters: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['mindmap', 'report'] }, content: { type: 'string', required: true } },
      output: { schema: ENTRY_SCHEMA, render: (args, value) => [{ type: 'text', text: `Saved ${args.kind} for ${value.id}.` }] },
      execute: args => this.setArtifact({ id: NotebookId(args.id), kind: args.kind, content: args.content }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update notebook Studio', rawInput: args.kind }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_delete', description: 'Delete one durable notebook by exact id.', parameters: { id: { type: 'string', required: true } },
      output: { schema: { type: 'object', additionalProperties: false, properties: { deleted: { type: 'boolean', required: true } } }, render: (args, value) => [{ type: 'text', text: value.deleted ? `Deleted notebook ${args.id}.` : `Notebook ${args.id} was already absent.` }] },
      execute: args => this.delete({ id: NotebookId(args.id) }), presentCall: args => ({ card: 'generic', kind: 'delete', title: 'Delete notebook', rawInput: args.id }),
    }))
  }

  private update(id: NotebookId, mutate: (entry: NotebookEntry) => NotebookEntry): Promise<NotebookEntry> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const current = table.get(id)
      if (current === undefined) throw new Error(`notebooks: entry ${id} not found`)
      const entry = snapshot({ ...mutate(snapshot(current)), updatedAt: Math.max(Date.now(), current.updatedAt + 1) })
      await table.put(id, entry)
      return snapshot(entry)
    })
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationTail.then(operation)
    this.mutationTail = result.then(() => undefined, () => undefined)
    return result
  }

  private requireTable(): KvTable<NotebookId, NotebookEntry> {
    if (this.table === undefined) throw new Error('notebooks: durable domain is not initialized')
    return this.table
  }

  private assertLength(value: string, limit: number, field: string): void {
    if (value.length > limit) throw new RangeError(`notebooks: ${field} exceeds ${limit} characters`)
  }
}

function requiredText(value: string, field: string): string { const text = value.trim(); if (text === '') throw new TypeError(`notebooks: ${field} must not be blank`); return text }
function optionalText(value: string | undefined): string | null { const text = value?.trim(); return text === undefined || text === '' ? null : text }
function normalizeTags(tags: readonly string[]): string[] { return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag !== ''))] }
function searchableText(entry: NotebookEntry): string { return [entry.title, entry.content, entry.summary, ...entry.tags, ...entry.sources.flatMap(source => [source.name, source.url ?? '', source.content])].join('\n').toLocaleLowerCase() }
function manualSource(title: string, content: string, createdAt: number): NotebookSource { return { id: NotebookSourceId(`source-${randomUUID()}`), kind: 'manual', name: title, url: null, mimeType: 'text/plain', content, selected: true, createdAt } }
function snapshot(entry: NotebookEntry): NotebookEntry { return Object.freeze({ ...entry, tags: [...entry.tags], sources: entry.sources.map(source => Object.freeze({ ...source })), artifacts: entry.artifacts.map(artifact => Object.freeze({ ...artifact })) }) }

export default NotebooksService
