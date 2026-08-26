/**
 * Cross-session notebook workspace with sources, summaries, Studio artifacts,
 * model tools, and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */

import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { AgentHandle } from '@deepseek-ai/dsh-agent'
import type { PreStepDecision } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-default-model'
import type {} from '@deepseek-ai/dsh-agent-presets'
import { createUserMessage, freezeMessage } from '@deepseek-ai/dsh-llm'
import type { ContentBlock, UserMessage } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-storage'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  buildAskContext, combineSources, entryKindFromSources, fallbackChatTitle, fallbackTitle,
  fetchNotebookUrl, isAbsoluteHttpUrl, parseGeneratedSummary, previewSummary, selectedSources, studioPrompt,
  truncateForGeneration,
} from './generate.ts'
import { formatNotebookMention, parseNotebookMentions } from './mention.ts'
import { MINDMAP_SYSTEM_PROMPT, REPORT_SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT } from './prompts.ts'
import { defaultSharedSqlitePath, ensurePluginPlatform, legacyNotebooksSqlitePath } from './platform.ts'
import { importLegacyNotebooksIfEmpty } from './migrate.ts'
import { notebooksDomainSpec } from './spec.ts'
import { NotebookId, NotebookSourceId } from './types.ts'
import type {
  NotebookAddSourceRequest, NotebookArtifact, NotebookArtifactKind, NotebookArtifactRequest,
  NotebookCandidateRequest, NotebookCandidateResult, NotebookCreateRequest, NotebookDeleteRequest,
  NotebookDeleteResult, NotebookEntry, NotebookFetchStatus, NotebookGetRequest,
  NotebookGenerateStudioRequest, NotebookJob, NotebookJobKind, NotebookListRequest, NotebookListResult,
  NotebookPutRequest, NotebookRemoveSourceRequest, NotebookRemoveSourceResult, NotebookSaveChatAnswerRequest,
  NotebookSource, NotebookSourceKind, NotebookSourceSelectionRequest, NotebookSummarizeRequest,
  NotebookSummaryRequest,
} from './types.ts'

export type * from './types.ts'
export { NotebookId, NotebookSourceId } from './types.ts'
export { notebookArtifactSchema, notebookEntrySchema, notebookJobSchema, notebookSourceSchema, notebooksDomainSpec } from './spec.ts'
export { formatNotebookMention, parseNotebookMentions } from './mention.ts'
export {
  buildAskContext, combineSources, entryKindFromSources, fallbackChatTitle, fallbackTitle,
  fetchNotebookUrl, jinaReaderUrl, parseGeneratedSummary, parseJinaReaderResponse,
  extractHtmlArticle, extractWebPageTitle, readableFetchText, selectedSources,
} from './generate.ts'
export { defaultSharedSqlitePath, defaultNotebooksSqlitePath, legacyNotebooksSqlitePath } from './platform.ts'
export { importLegacyNotebooksIfEmpty } from './migrate.ts'

/** Required notebook capacity, generation, and content policy. */
export interface Config {
  /** Spawn private Agents to fetch URLs, summarize, and generate Studio artifacts. */
  readonly runnerEnabled: boolean
  /** Working directory recorded on private generation Agents. */
  readonly runnerCwd: string
  readonly maxEntries: number
  readonly maxContentChars: number
  readonly maxSourcesPerEntry: number
  readonly maxSourceChars: number
  readonly maxArtifactChars: number
  /** Override sqlite path when this plugin mounts the backend; tests use a temp file. */
  readonly sqlitePath?: string
}

interface WebLike {
  fetch(request: { url: string }, signal?: AbortSignal): Promise<{ url: string; statusCode: number; body: { kind: string; content: string } }>
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
} as const

interface ActiveGeneration {
  readonly jobId: string
  readonly controller: AbortController
  handle?: AgentHandle
  promise?: Promise<void>
}

/** Durable notebook service. */
export class NotebooksService extends TypertRemoteService {
  static inject = ['storage', 'storageDomain', 'tools']

  static Config: s<Config> = s.object({
    runnerEnabled: s.boolean().default(false),
    runnerCwd: s.string().default(process.cwd()),
    maxEntries: s.number().step(1).min(1).required(),
    maxContentChars: s.number().step(1).min(1).required(),
    maxSourcesPerEntry: s.number().step(1).min(1).required(),
    maxSourceChars: s.number().step(1).min(1).required(),
    maxArtifactChars: s.number().step(1).min(1).required(),
    sqlitePath: s.string(),
  })

  private table?: KvTable<NotebookId, NotebookEntry>
  private mutationTail: Promise<void> = Promise.resolve()
  private readonly activeJobs = new Map<NotebookId, ActiveGeneration>()

  /** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and generation limits. */
  constructor(ctx: Context, private readonly config: Config) { super(ctx, 'notebooks') }

  protected async [Service.init](): Promise<void> {
    const sqlitePath = this.config.sqlitePath?.trim() || defaultSharedSqlitePath()
    await ensurePluginPlatform(this.ctx, { domain: 'notebooks', sqlitePath })
    const domain = await this.ctx.storageDomain.open(notebooksDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'notebooks.domainClose')
    this.table = domain.table('entries')
    await importLegacyNotebooksIfEmpty(legacyNotebooksSqlitePath(sqlitePath), sqlitePath, this.table)
    this.registerTools()
    this.ctx.on('agent/pre-step', async ({ signal }, next): Promise<PreStepDecision> => {
      const decision = await next()
      if (decision.kind === 'reject') return decision
      return { kind: 'enter', messages: await this.injectMentions(decision.messages, signal) }
    }, { prepend: true })
    this.ctx.effect(() => async () => {
      const runs = [...this.activeJobs.values()]
      for (const run of runs) {
        run.controller.abort()
        run.handle?.agent.cancel({ kind: 'disposed' })
      }
      await Promise.allSettled(runs.map(run => run.promise))
    }, 'notebooks.runnerDrain')
  }

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

  @Remote('get')
  get(request: NotebookGetRequest): NotebookEntry | null {
    const entry = this.requireTable().get(request.id)
    return entry === undefined ? null : snapshot(entry)
  }

  @Remote('candidates')
  candidates(request: NotebookCandidateRequest): NotebookCandidateResult {
    const query = request.query?.trim().toLocaleLowerCase() ?? ''
    const candidates = this.list({ query }).entries.slice(0, 20).map(entry => ({
      id: entry.id,
      title: entry.title,
      mention: formatNotebookMention(entry.id, entry.title || entry.id),
      summary: previewSummary(entry),
      summarizing: entry.summary.trim() === ''
        && (entry.latestJob?.status === 'pending' || entry.latestJob?.status === 'running'),
    }))
    return { candidates }
  }

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
      const sources = current?.sources ?? [this.manualSource(title, content, now)]
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
      })
      await table.put(id, entry)
      this.emitProgress(entry)
      if (current === undefined) this.launchSummary(id)
      return snapshot(entry)
    })
  }

  @Remote('create')
  create(request: NotebookCreateRequest): Promise<NotebookEntry> {
    return this.enqueue(async () => {
      const sources = this.buildCreateSources(request)
      if (sources.length === 0) throw new TypeError('notebooks: notebook requires at least one source')
      const table = this.requireTable()
      if (table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`)
      const now = Date.now()
      const first = sources[0]!
      const title = request.title?.trim() || first.name
      const id = NotebookId(`note-${randomUUID()}`)
      const pending = sources.some(source => source.status === 'pending_fetch')
      const entry = snapshot({
        id, title, content: first.content,
        summary: '', tags: normalizeTags(request.tags ?? []),
        sourceType: entryKindFromSources(sources),
        sourceUrl: sources.find(source => source.url !== null)?.url ?? null,
        fetchStatus: pending ? 'pending_fetch' : 'ready',
        sources, artifacts: [], latestJob: null, createdAt: now, updatedAt: now,
      })
      await table.put(id, entry)
      this.emitProgress(entry)
      this.launchSummary(id)
      return snapshot(entry)
    })
  }

  @Remote('addSource')
  addSource(request: NotebookAddSourceRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      if (entry.sources.length >= this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`)
      const source = this.buildSource(request)
      return this.withInvalidatedDerived({ ...entry, sources: [...entry.sources, source] })
    }).then(entry => { this.launchSummary(entry.id); return entry })
  }

  @Remote('setSourceSelection')
  setSourceSelection(request: NotebookSourceSelectionRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      const selected = new Set(request.sourceIds)
      const known = new Set(entry.sources.map(source => source.id))
      for (const id of selected) if (!known.has(id)) throw new Error(`notebooks: source ${id} not found`)
      if (![...entry.sources].some(source => selected.has(source.id))) throw new Error('notebooks: select at least one source')
      return this.withInvalidatedDerived({ ...entry, sources: entry.sources.map(source => ({ ...source, selected: selected.has(source.id) })) })
    }).then(entry => { this.launchSummary(entry.id); return entry })
  }

  @Remote('removeSource')
  removeSource(request: NotebookRemoveSourceRequest): Promise<NotebookRemoveSourceResult> {
    let removed = false
    return this.update(request.id, entry => {
      const sources = entry.sources.filter(source => source.id !== request.sourceId)
      removed = sources.length !== entry.sources.length
      return this.withInvalidatedDerived({ ...entry, sources })
    }).then(entry => {
      if (removed && entry.sources.length > 0) this.launchSummary(entry.id)
      return { removed, entry }
    })
  }

  @Remote('setSummary')
  setSummary(request: NotebookSummaryRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => ({ ...entry, summary: requiredText(request.summary, 'summary') }))
  }

  @Remote('setArtifact')
  setArtifact(request: NotebookArtifactRequest): Promise<NotebookEntry> {
    return this.update(request.id, entry => {
      const content = requiredText(request.content, `${request.kind} content`)
      this.assertLength(content, this.config.maxArtifactChars, `${request.kind} content`)
      const artifact: NotebookArtifact = { kind: request.kind, content, updatedAt: Date.now() }
      return { ...entry, artifacts: [...entry.artifacts.filter(item => item.kind !== request.kind), artifact] }
    })
  }

  @Remote('summarize')
  summarize(request: NotebookSummarizeRequest): Promise<NotebookEntry> {
    const entry = this.requireEntry(request.id)
    this.launchSummary(entry.id)
    return Promise.resolve(snapshot(this.requireEntry(entry.id)))
  }

  @Remote('generateStudio')
  generateStudio(request: NotebookGenerateStudioRequest): Promise<NotebookEntry> {
    if (!this.config.runnerEnabled) return Promise.reject(new Error('notebooks: generation runner is disabled'))
    const entry = this.requireEntry(request.id)
    this.launchStudio(entry.id, request.kind)
    return Promise.resolve(snapshot(this.requireEntry(entry.id)))
  }

  @Remote('saveChatAnswer')
  saveChatAnswer(request: NotebookSaveChatAnswerRequest): Promise<NotebookEntry> {
    const answerText = requiredText(request.answerText, 'answer')
    this.assertLength(answerText, this.config.maxSourceChars, 'answer')
    const title = request.title?.trim() || fallbackChatTitle(request.questionText ?? '', answerText)
    return this.enqueue(async () => {
      const table = this.requireTable()
      if (table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`)
      const now = Date.now()
      const id = NotebookId(`note-${randomUUID()}`)
      const source = this.createSource({
        kind: 'chat_answer', name: title, content: answerText,
        sessionId: optionalText(request.sessionId), messageId: optionalText(request.messageId), createdAt: now,
      })
      const entry = snapshot({
        id, title, content: answerText, summary: '', tags: normalizeTags(request.tags ?? []),
        sourceType: 'chat_answer', sourceUrl: null, fetchStatus: 'ready',
        sources: [source], artifacts: [], latestJob: null, createdAt: now, updatedAt: now,
      })
      await table.put(id, entry)
      this.emitProgress(entry)
      this.launchSummary(id)
      return snapshot(entry)
    })
  }

  @Remote('delete')
  delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult> {
    return this.enqueue(async () => {
      this.stopJob(request.id)
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
      parameters: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['manual', 'url', 'document', 'chat_answer'] }, name: { type: 'string', required: true }, url: { type: 'string' }, mimeType: { type: 'string' }, content: { type: 'string' } },
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
      name: 'notebook_save_chat_answer', description: 'Save a conversation answer as a durable notebook for later follow-up.',
      parameters: { title: { type: 'string' }, answerText: { type: 'string', required: true }, questionText: { type: 'string' }, sessionId: { type: 'string' }, messageId: { type: 'string' } },
      output: { schema: ENTRY_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Saved chat answer as notebook "${value.title}" (${value.id}).` }] },
      execute: args => this.saveChatAnswer(args), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Save chat answer', rawInput: args.title ?? args.answerText.slice(0, 32) }),
    }))
    this.ctx.tools.register(defineTool({
      name: 'notebook_delete', description: 'Delete one durable notebook by exact id.', parameters: { id: { type: 'string', required: true } },
      output: { schema: { type: 'object', additionalProperties: false, properties: { deleted: { type: 'boolean', required: true } } }, render: (args, value) => [{ type: 'text', text: value.deleted ? `Deleted notebook ${args.id}.` : `Notebook ${args.id} was already absent.` }] },
      execute: args => this.delete({ id: NotebookId(args.id) }), presentCall: args => ({ card: 'generic', kind: 'delete', title: 'Delete notebook', rawInput: args.id }),
    }))
  }

  private async injectMentions(messages: readonly UserMessage[], signal: AbortSignal): Promise<UserMessage[]> {
    const prepared = await Promise.all(messages.map(async (message): Promise<UserMessage[]> => {
      if (message.source.kind !== 'user') return [message]
      const ids: ReturnType<typeof NotebookId>[] = []
      const content = message.content.map((block): ContentBlock => {
        if (block.type !== 'text') return block
        const parsed = parseNotebookMentions(block.text)
        ids.push(...parsed.ids)
        return { type: 'text', text: parsed.text }
      })
      const id = ids[0]
      if (id === undefined) return [message]
      signal.throwIfAborted()
      const entry = this.requireTable().get(id)
      if (entry === undefined) return [freezeMessage({ ...message, content })]
      const summary = entry.summary.trim() || previewSummary(entry)
      const context = createUserMessage({
        content: [{ type: 'text', text: buildAskContext(entry, summary) }],
        source: {
          kind: 'plugin',
          plugin: '@deepseek-ai/dsh-notebooks',
          form: 'recall',
          notebookId: entry.id,
          notebookTitle: entry.title || entry.id,
        },
      })
      return [freezeMessage({ ...message, content }), context]
    }))
    return prepared.flat()
  }

  private launchSummary(id: NotebookId): void {
    if (!this.config.runnerEnabled) return
    this.launchJob(id, 'summary', async (run, entry) => {
      const pending = entry.sources.filter(source => source.kind === 'url' && source.content === '' && source.url !== null)
      if (pending.length > 0) {
        await this.patchJob(id, run.jobId, {
          status: 'running', stage: 'fetch',
          partialText: pending[0]!.name || pending[0]!.url || '',
        })
      }
      const fetched = await this.fetchPendingSources(entry, run.controller.signal, run.jobId)
      await this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: '' })
      const active = selectedSources(fetched)
      const contentText = truncateForGeneration(combineSources(active) || fetched.content)
      const generated = parseGeneratedSummary(await this.complete({
        run, system: SUMMARY_SYSTEM_PROMPT,
        user: ['Please write a detailed note summary for future follow-up questions.', contentText].join('\n\n'),
        onDraft: text => { void this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: text }) },
      }))
      const title = generated.title || fallbackTitle({ title: fetched.title, sourceUrl: fetched.sourceUrl, contentText })
      const summary = generated.summary
      if (summary === '') throw new Error('Empty note summary')
      await this.update(id, current => ({
        ...current, title, content: contentText || current.content, summary,
        sources: fetched.sources, fetchStatus: contentText || current.content ? 'ready' : current.fetchStatus,
        latestJob: job(run.jobId, 'summary', 'completed', summary, ''),
      }))
    })
  }

  private launchStudio(id: NotebookId, kind: NotebookArtifactKind): void {
    if (!this.config.runnerEnabled) throw new Error('notebooks: generation runner is disabled')
    this.launchJob(id, kind, async (run, entry) => {
      const sourceText = combineSources(selectedSources(entry))
      if (sourceText === '') throw new Error('No selected source content is available')
      const content = (await this.complete({
        run, system: kind === 'mindmap' ? MINDMAP_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT,
        user: studioPrompt(kind) + '\n\n' + sourceText,
        onDraft: text => { void this.patchJob(id, run.jobId, { status: 'running', stage: 'generate', partialText: text }) },
      })).trim()
      if (content === '') throw new Error('Model returned empty content')
      this.assertLength(content, this.config.maxArtifactChars, `${kind} content`)
      const artifact: NotebookArtifact = { kind, content, updatedAt: Date.now() }
      await this.update(id, current => ({
        ...current,
        artifacts: [...current.artifacts.filter(item => item.kind !== kind), artifact],
        latestJob: job(run.jobId, kind, 'completed', content, ''),
      }))
    })
  }

  private launchJob(id: NotebookId, kind: NotebookJobKind, work: (run: ActiveGeneration, entry: NotebookEntry) => Promise<void>): void {
    this.stopJob(id)
    const jobId = `notejob-${randomUUID()}`
    const run: ActiveGeneration = { jobId, controller: new AbortController() }
    this.activeJobs.set(id, run)
    void this.update(id, entry => ({ ...entry, latestJob: job(jobId, kind, 'pending', '', '', kind === 'summary' ? 'fetch' : 'generate') }))
    run.promise = (async () => {
      try {
        await this.update(id, entry => ({
          ...entry,
          latestJob: job(jobId, kind, 'running', '', '', kind === 'summary' ? 'fetch' : 'generate'),
        }))
        const entry = this.requireEntry(id)
        if (this.activeJobs.get(id)?.jobId !== jobId) return
        await work(run, entry)
      } catch (error) {
        if (run.controller.signal.aborted) return
        const message = error instanceof Error ? error.message : String(error)
        await this.update(id, entry => ({ ...entry, latestJob: job(jobId, kind, 'failed', entry.latestJob?.partialText ?? '', message) })).catch(() => undefined)
      } finally {
        if (this.activeJobs.get(id)?.jobId === jobId) this.activeJobs.delete(id)
      }
    })()
  }

  private async fetchPendingSources(entry: NotebookEntry, signal: AbortSignal, jobId?: string): Promise<NotebookEntry> {
    const sources = [...entry.sources]
    const pendingIndexes = sources
      .map((source, index) => source.kind === 'url' && source.content === '' && source.url !== null ? index : -1)
      .filter(index => index >= 0)
    let fetchedCount = 0
    for (let index = 0; index < sources.length; index += 1) {
      const source = sources[index]!
      if (source.kind !== 'url' || source.content !== '' || source.url === null) continue
      fetchedCount += 1
      if (jobId !== undefined) {
        await this.patchJob(entry.id, jobId, {
          status: 'running',
          stage: 'fetch',
          partialText: `${String(fetchedCount)}/${String(pendingIndexes.length)} ${source.name || source.url}`,
        })
      }
      try {
        const fetched = await this.fetchUrl(source.url, signal)
        sources[index] = {
          ...source, name: fetched.title || source.name, content: fetched.content,
          status: fetched.content === '' ? 'failed' : 'ready',
        }
      } catch {
        sources[index] = { ...source, status: 'failed' }
      }
    }
    const content = selectedSources({ ...entry, sources }).map(source => source.content).find(text => text !== '') ?? entry.content
    const fetchStatus: NotebookFetchStatus = sources.some(source => source.status === 'pending_fetch')
      ? 'pending_fetch'
      : sources.some(source => source.status === 'failed') && content === '' ? 'failed' : 'ready'
    const next = { ...entry, sources, content, fetchStatus, sourceUrl: sources.find(source => source.url !== null)?.url ?? entry.sourceUrl }
    await this.update(entry.id, current => ({ ...current, sources: next.sources, content: next.content, fetchStatus: next.fetchStatus, sourceUrl: next.sourceUrl }))
    return this.requireEntry(entry.id)
  }

  private async fetchUrl(url: string, signal: AbortSignal): Promise<{ title: string; content: string }> {
    const web = this.ctx.get('web') as WebLike | undefined
    return web === undefined
      ? fetchNotebookUrl(url, { signal })
      : fetchNotebookUrl(url, { signal, web })
  }

  private async complete(spec: { run: ActiveGeneration; system: string; user: string; onDraft: (text: string) => void }): Promise<string> {
    const agents = this.ctx.get('agents')
    const agentDefaultModel = this.ctx.get('agentDefaultModel')
    const agentPresets = this.ctx.get('agentPresets')
    if (agents === undefined || agentDefaultModel === undefined || agentPresets === undefined) {
      throw new Error('notebooks: generation agents are not available')
    }
    const selection = agentDefaultModel.currentSelection()
    const handle = await agents.create({
      sessionId: SessionId(`notebooks-run-${randomUUID()}`),
      meta: { cwd: resolve(this.config.runnerCwd), origin: 'subagent', delegationDepth: 1 },
      agentOptions: { provider: selection.provider, model: selection.model },
      signal: spec.run.controller.signal,
      setup: async (agentCtx) => {
        await agentPresets.mount(agentCtx, 'standard')
        agentCtx.tools.restrict({ allow: [] })
        agentCtx.systemPrompt.section({ name: 'notebooks:runner', order: 10_000, text: spec.system })
      },
    })
    spec.run.handle = handle
    const stopDraft = watchDraft(handle, spec.onDraft)
    try {
      if (spec.run.controller.signal.aborted) return ''
      handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: spec.user }], source: { kind: 'user' } }))
      await handle.agent.whenIdle()
      return lastAssistantText(handle)
    } finally {
      stopDraft()
      await handle.dispose()
      delete spec.run.handle
    }
  }

  private async patchJob(id: NotebookId, jobId: string, patch: Partial<NotebookJob>): Promise<void> {
    await this.update(id, entry => {
      if (entry.latestJob?.id !== jobId) return entry
      return { ...entry, latestJob: { ...entry.latestJob, ...patch, updatedAt: Date.now() } }
    }).catch(() => undefined)
  }

  private stopJob(id: NotebookId): void {
    const run = this.activeJobs.get(id)
    if (run === undefined) return
    run.controller.abort()
    run.handle?.agent.cancel({ kind: 'user' })
    this.activeJobs.delete(id)
  }

  private buildCreateSources(request: NotebookCreateRequest): NotebookSource[] {
    const now = Date.now()
    const sources: NotebookSource[] = []
    for (const raw of request.urls ?? []) {
      const url = raw.trim()
      if (url === '') continue
      if (!isAbsoluteHttpUrl(url)) throw new TypeError('notebooks: source URL requires an absolute http or https URL')
      sources.push(this.createSource({ kind: 'url', name: hostname(url), url, content: '', status: 'pending_fetch', createdAt: now }))
    }
    const content = request.content?.trim() ?? ''
    if (content !== '') {
      this.assertLength(content, this.config.maxContentChars, 'content')
      sources.push(this.manualSource(request.title?.trim() || 'Manual note', content, now))
    }
    for (const document of request.documents ?? []) {
      const body = requiredText(document.content, 'document content')
      this.assertLength(body, this.config.maxSourceChars, 'document content')
      sources.push(this.createSource({ kind: 'document', name: requiredText(document.name, 'document name'), mimeType: document.mimeType || 'text/plain', content: body, createdAt: now }))
    }
    if (sources.length > this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`)
    return sources
  }

  private buildSource(request: NotebookAddSourceRequest): NotebookSource {
    const url = optionalText(request.url)
    const content = request.content?.trim() ?? ''
    if (request.kind === 'url') {
      const href = url ?? ''
      if (!isAbsoluteHttpUrl(href)) throw new TypeError('notebooks: source URL requires an absolute http or https URL')
      return this.createSource({
        kind: 'url', name: requiredText(request.name, 'source name'), url: href, content,
        status: content === '' ? 'pending_fetch' : 'ready',
      })
    }
    if (content === '') throw new TypeError('notebooks: source content is required')
    this.assertLength(content, this.config.maxSourceChars, 'source content')
    return this.createSource({
      kind: request.kind, name: requiredText(request.name, 'source name'), url,
      mimeType: optionalText(request.mimeType), content,
      sessionId: optionalText(request.sessionId), messageId: optionalText(request.messageId),
    })
  }

  private createSource(payload: {
    kind: NotebookSourceKind; name: string; url?: string | null; mimeType?: string | null; content: string
    selected?: boolean; status?: NotebookFetchStatus; sessionId?: string | null; messageId?: string | null; createdAt?: number
  }): NotebookSource {
    return {
      id: NotebookSourceId(`source-${randomUUID()}`), kind: payload.kind, name: payload.name,
      url: payload.url ?? null, mimeType: payload.mimeType ?? (payload.kind === 'manual' ? 'text/plain' : null),
      content: payload.content, selected: payload.selected !== false,
      status: payload.status ?? 'ready', sessionId: payload.sessionId ?? null, messageId: payload.messageId ?? null,
      createdAt: payload.createdAt ?? Date.now(),
    }
  }

  private manualSource(title: string, content: string, createdAt: number): NotebookSource {
    return this.createSource({ kind: 'manual', name: title, mimeType: 'text/plain', content, createdAt })
  }

  private withInvalidatedDerived(entry: NotebookEntry): NotebookEntry {
    return {
      ...entry,
      summary: '',
      artifacts: [],
      sourceType: entryKindFromSources(entry.sources),
      sourceUrl: entry.sources.find(source => source.url !== null)?.url ?? null,
      fetchStatus: entry.sources.some(source => source.status === 'pending_fetch') ? 'pending_fetch' : 'ready',
    }
  }

  private update(id: NotebookId, mutate: (entry: NotebookEntry) => NotebookEntry): Promise<NotebookEntry> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const current = table.get(id)
      if (current === undefined) throw new Error(`notebooks: entry ${id} not found`)
      const entry = snapshot({ ...mutate(snapshot(current)), updatedAt: Math.max(Date.now(), current.updatedAt + 1) })
      await table.put(id, entry)
      this.emitProgress(entry)
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

  private requireEntry(id: NotebookId): NotebookEntry {
    const entry = this.requireTable().get(id)
    if (entry === undefined) throw new Error(`notebooks: entry ${id} not found`)
    return snapshot(entry)
  }

  private emitProgress(entry: NotebookEntry): void {
    this.ctx.emit('notebooks/progress', snapshot(entry))
  }

  private assertLength(value: string, limit: number, field: string): void {
    if (value.length > limit) throw new RangeError(`notebooks: ${field} exceeds ${limit} characters`)
  }
}

function requiredText(value: string, field: string): string { const text = value.trim(); if (text === '') throw new TypeError(`notebooks: ${field} must not be blank`); return text }
function optionalText(value: string | undefined): string | null { const text = value?.trim(); return text === undefined || text === '' ? null : text }
function normalizeTags(tags: readonly string[]): string[] { return [...new Set(tags.map(tag => tag.trim()).filter(tag => tag !== ''))] }
function searchableText(entry: NotebookEntry): string { return [entry.title, entry.content, entry.summary, ...entry.tags, ...entry.sources.flatMap(source => [source.name, source.url ?? '', source.content])].join('\n').toLocaleLowerCase() }
function hostname(value: string): string { try { return new URL(value).hostname.replace(/^www\./u, '') } catch { return value || '网页资料' } }
function job(
  id: string,
  kind: NotebookJobKind,
  status: NotebookJob['status'],
  partialText: string,
  errorText: string,
  stage: NotebookJob['stage'] = 'generate',
): NotebookJob {
  return { id, kind, status, stage, partialText, errorText, updatedAt: Date.now() }
}
function snapshot(entry: NotebookEntry): NotebookEntry {
  return Object.freeze({
    ...entry, tags: [...entry.tags],
    sources: entry.sources.map(source => Object.freeze({ ...source })),
    artifacts: entry.artifacts.map(artifact => Object.freeze({ ...artifact })),
    latestJob: entry.latestJob === null ? null : Object.freeze({ ...entry.latestJob }),
  })
}

function lastAssistantText(handle: AgentHandle): string {
  const agent = handle.agent as { messages?: unknown; session?: { messages?: unknown } }
  const messages = Array.isArray(agent.messages) ? agent.messages : Array.isArray(agent.session?.messages) ? agent.session.messages : []
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index] as { role?: string; content?: unknown }
    if (message.role !== 'assistant') continue
    const text = messageText(message.content)
    if (text !== '') return text
  }
  return ''
}

function messageText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.map(block => typeof block === 'string' ? block : String((block as { text?: string }).text ?? '')).join('')
}

function watchDraft(handle: AgentHandle, onDraft: (text: string) => void): () => void {
  let last = ''
  let streamed = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  const push = (text: string) => {
    const next = text.trim()
    if (next === '' || next === last) return
    last = next
    onDraft(next.slice(0, 12000))
  }
  const emit = () => { push(streamed || lastAssistantText(handle)) }
  const schedule = () => {
    if (timer !== undefined) return
    timer = setTimeout(() => { timer = undefined; emit() }, 80)
  }
  const ctx = handle.agent.ctx as { on?: (event: string, listener: (payload?: unknown) => void) => () => void } | undefined
  const offChunk = ctx?.on?.('assistant/chunk', payload => {
    const chunk = (payload as { chunk?: { type?: string; text?: string } } | undefined)?.chunk
    if (chunk?.type === 'text-delta' && chunk.text) {
      const first = streamed === ''
      streamed += chunk.text
      if (first) emit()
      else schedule()
    }
  })
  const offMessage = ctx?.on?.('assistant/message', payload => {
    const text = messageText((payload as { message?: { content?: unknown } } | undefined)?.message?.content)
    if (text !== '') { streamed = text; emit() }
  })
  const poll = setInterval(emit, 200)
  emit()
  return () => {
    if (timer !== undefined) clearTimeout(timer)
    clearInterval(poll)
    offChunk?.()
    offMessage?.()
  }
}

export default NotebooksService
