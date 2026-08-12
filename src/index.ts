/**
 * Cross-session notebook storage with model tools and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */

import { randomUUID } from 'node:crypto'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { GatewayService, Remote } from '@deepseek-ai/dsh-type-meta'
import { notebooksDomainSpec } from './spec.ts'
import { NotebookId } from './types.ts'
import type {
  NotebookDeleteRequest,
  NotebookDeleteResult,
  NotebookEntry,
  NotebookListRequest,
  NotebookListResult,
  NotebookPutRequest,
} from './types.ts'

export type * from './types.ts'
export { NotebookId } from './types.ts'
export { notebookEntrySchema, notebooksDomainSpec } from './spec.ts'

/** Required notebook capacity and entry-size policy. */
export interface Config {
  readonly maxEntries: number
  readonly maxContentChars: number
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    notebooks: NotebooksService
  }
}

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
} as const

/** Durable notebook service. */
export class NotebooksService extends GatewayService {
  static inject = ['storageDomain', 'tools']

  /** Loader validation for deployment-varying notebook limits. */
  static Config: s<Config> = s.object({
    maxEntries: s.number().step(1).min(1).required(),
    maxContentChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<NotebookId, NotebookEntry>
  private mutationTail: Promise<void> = Promise.resolve()

  /**
   * @param ctx - Host context carrying storage and tool registries.
   * @param config - Capacity and content limits.
   */
  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'notebooks')
  }

  /** Open durable storage and publish the three model tools. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(notebooksDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'notebooks.domainClose')
    this.table = domain.table('entries')
    this.registerTools()
  }

  /** List entries matching optional text and tag filters. */
  @Remote('list')
  list(request: NotebookListRequest): NotebookListResult {
    const query = request.query?.trim().toLocaleLowerCase()
    const tag = request.tag?.trim().toLocaleLowerCase()
    const entries = [...this.requireTable().entries()]
      .map(([, entry]) => snapshot(entry))
      .filter(entry => query === undefined || query === ''
        || `${entry.title}\n${entry.content}\n${entry.tags.join('\n')}`.toLocaleLowerCase().includes(query))
      .filter(entry => tag === undefined || tag === ''
        || entry.tags.some(candidate => candidate.toLocaleLowerCase() === tag))
      .sort((left, right) => right.updatedAt - left.updatedAt)
    return { entries }
  }

  /** Create or replace an entry after validating configured limits. */
  @Remote('put')
  put(request: NotebookPutRequest): Promise<NotebookEntry> {
    return this.enqueue(async () => {
      const title = requiredText(request.title, 'title')
      const content = requiredText(request.content, 'content')
      if (content.length > this.config.maxContentChars) {
        throw new RangeError(`notebooks: content exceeds ${this.config.maxContentChars} characters`)
      }
      const table = this.requireTable()
      const id = request.id ?? NotebookId(`note-${randomUUID()}`)
      const current = table.get(id)
      if (current === undefined && table.size >= this.config.maxEntries) {
        throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`)
      }
      const now = Date.now()
      const entry = snapshot({
        id,
        title,
        content,
        tags: normalizeTags(request.tags ?? []),
        createdAt: current?.createdAt ?? now,
        updatedAt: current === undefined ? now : Math.max(now, current.updatedAt),
      })
      await table.put(id, entry)
      return snapshot(entry)
    })
  }

  /** Delete an entry; absence is a successful stable outcome. */
  @Remote('delete')
  delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const deleted = table.get(request.id) !== undefined
      if (deleted) await table.delete(request.id)
      return { deleted }
    })
  }

  /** Register model-facing CRUD tools over the same service operations. */
  private registerTools(): void {
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
    }))

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
      execute: async args => this.put({
        title: args.title,
        content: args.content,
        ...(args.tags === undefined ? {} : { tags: args.tags }),
        ...(args.id === undefined ? {} : { id: NotebookId(args.id) }),
      }),
      presentCall: args => ({ card: 'generic', kind: 'edit', title: args.id === undefined ? 'Create note' : 'Update note', rawInput: args.title }),
    }))

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
      execute: async args => this.delete({ id: NotebookId(args.id) }),
      presentCall: args => ({ card: 'generic', kind: 'delete', title: 'Delete note', rawInput: args.id }),
    }))
  }

  /** Serialize read-check-write mutations. */
  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationTail.then(operation)
    this.mutationTail = result.then(() => undefined, () => undefined)
    return result
  }

  /** Resolve the initialized table. */
  private requireTable(): KvTable<NotebookId, NotebookEntry> {
    if (this.table === undefined) throw new Error('notebooks: durable domain is not initialized')
    return this.table
  }
}

function requiredText(value: string, field: string): string {
  const text = value.trim()
  if (text === '') throw new TypeError(`notebooks: ${field} must not be blank`)
  return text
}

function normalizeTags(tags: readonly string[]): string[] {
  return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag !== ''))]
}

function snapshot(entry: NotebookEntry): NotebookEntry {
  return Object.freeze({ ...entry, tags: [...entry.tags] })
}

export default NotebooksService
