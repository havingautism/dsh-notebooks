import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageJson from '@deepseek-ai/dsh-storage-json'
import * as StorageSqlite from '@deepseek-ai/dsh-storage-sqlite'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import Notebooks, { NotebookId } from '../lib/index.js'
import { formatNotebookMention, parseNotebookMentions } from '../lib/types/mention.js'

const contexts: Context[] = []
const roots: string[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function harness(root?: string): Promise<Context> {
  const storageRoot = root ?? await mkdtemp(join(tmpdir(), 'dsh-notebooks-test-'))
  if (root === undefined) roots.push(storageRoot)
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(Tools)
  await ctx.plugin(Storage)
  await ctx.plugin(StorageJson, { root: storageRoot })
  await ctx.plugin(StorageDomain, { backend: 'json' })
  await ctx.plugin(Notebooks, {
    maxEntries: 2,
    maxContentChars: 40,
    maxSourcesPerEntry: 3,
    maxSourceChars: 80,
    maxArtifactChars: 120,
    sqlitePath: join(storageRoot, 'notebooks.sqlite'),
  })
  return ctx
}

describe('Notebooks extension', () => {
  it('publishes its complete independent Remote and Tool surface', async () => {
    const ctx = await harness()
    expect(ctx.notebooks.typertRemote.namespace).toBe('notebooks')
    expect(remoteMethods(ctx.notebooks).map(marker => marker.method)).toEqual([
      'list', 'get', 'candidates', 'put', 'create', 'addSource', 'setSourceSelection', 'removeSource',
      'setSummary', 'setArtifact', 'summarize', 'generateStudio', 'saveChatAnswer', 'delete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([
      'notebook_list', 'notebook_write', 'notebook_add_source',
      'notebook_set_summary', 'notebook_set_artifact', 'notebook_save_chat_answer', 'notebook_delete',
    ])
  })

  it('manages sources, selection, summary, and Studio artifacts', async () => {
    const ctx = await harness()
    const created = await ctx.notebooks.put({
      title: 'Renderer decisions',
      content: 'Rows derive state from durable blocks.',
      tags: ['ui', ' replay ', 'ui'],
    })
    expect(created.tags).toEqual(['ui', 'replay'])
    const withUrl = await ctx.notebooks.addSource({
      id: created.id,
      kind: 'url',
      name: 'Tool UI contract',
      url: 'https://example.test/tool-ui',
      content: 'Presentation derives from logged arguments and results.',
    })
    const withDocument = await ctx.notebooks.addSource({
      id: created.id,
      kind: 'document',
      name: 'Review notes.md',
      content: 'Replay must not read a live catalog.',
    })
    const selected = await ctx.notebooks.setSourceSelection({
      id: created.id,
      sourceIds: [withDocument.sources[2]!.id],
    })
    expect(selected.sources.map(source => source.selected)).toEqual([false, false, true])
    const summarized = await ctx.notebooks.setSummary({ id: created.id, summary: 'Replay is log-derived.' })
    const mapped = await ctx.notebooks.setArtifact({ id: created.id, kind: 'mindmap', content: 'graph TD; Log-->UI' })
    const reported = await ctx.notebooks.setArtifact({ id: created.id, kind: 'report', content: '# Renderer report' })
    expect(summarized.summary).toBe('Replay is log-derived.')
    expect(mapped.artifacts.find(artifact => artifact.kind === 'mindmap')?.content).toContain('graph TD')
    expect(reported.artifacts.find(artifact => artifact.kind === 'report')?.content).toBe('# Renderer report')
    expect(ctx.notebooks.list({ query: 'live catalog' }).entries).toHaveLength(1)
    const removed = await ctx.notebooks.removeSource({ id: created.id, sourceId: withUrl.sources[1]!.id })
    expect(removed.removed).toBe(true)
    expect(removed.entry.sources).toHaveLength(2)
  })

  it('enforces content, source, and entry limits before committing', async () => {
    const ctx = await harness()
    await expect(ctx.notebooks.put({ title: 'Blank', content: '   ' })).rejects.toThrow('content must not be blank')
    await expect(ctx.notebooks.put({ title: 'Long', content: 'x'.repeat(41) })).rejects.toThrow('exceeds 40')
    const first = await ctx.notebooks.put({ title: 'One', content: '1' })
    await ctx.notebooks.addSource({ id: first.id, kind: 'manual', name: 'One', content: '1' })
    await ctx.notebooks.addSource({ id: first.id, kind: 'manual', name: 'Two', content: '2' })
    await expect(ctx.notebooks.addSource({ id: first.id, kind: 'manual', name: 'Three', content: '3' })).rejects.toThrow('source limit 3')
    await ctx.notebooks.put({ title: 'Two', content: '2' })
    await expect(ctx.notebooks.put({ title: 'Three', content: '3' })).rejects.toThrow('entry limit 2')
  })

  it('retains the complete notebook across a cold storage restart', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-notebooks-restart-'))
    roots.push(root)
    const first = await harness(root)
    const note = await first.notebooks.put({ title: 'Persistent', content: 'Across contexts' })
    await first.notebooks.addSource({ id: note.id, kind: 'chat_answer', name: 'Answer', content: 'Durable answer' })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.notebooks.get({ id: note.id })?.sources[1]?.kind).toBe('chat_answer')
    expect(second.notebooks.list({ query: 'durable answer' }).entries.map(entry => entry.id)).toEqual([note.id])
    expect(second.notebooks.get({ id: NotebookId('missing') })).toBeNull()
  })

  it('parses a composer mention into one notebook identity', () => {
    const mention = formatNotebookMention(NotebookId('note-1'), 'Renderer notes')
    expect(mention).toBe('@[Renderer notes](dsh-notebook:note-1)')
    expect(parseNotebookMentions(`See ${mention} please`)).toEqual({
      text: 'See @Renderer notes please',
      ids: ['note-1'],
    })
  })

  it('creates mixed sources and invalidates derived summary after a source change', async () => {
    const ctx = await harness()
    const created = await ctx.notebooks.create({
      title: 'Mixed note',
      content: 'Handwritten seed.',
      urls: ['https://example.test/article'],
      documents: [{ name: 'notes.md', content: 'Document body' }],
    })
    expect(created.sources.map(source => source.kind)).toEqual(['url', 'manual', 'document'])
    expect(created.sources[0]?.status).toBe('pending_fetch')
    expect(created.sourceType).toBe('notebook')
    const summarized = await ctx.notebooks.setSummary({ id: created.id, summary: 'Stale overview.' })
    await ctx.notebooks.setArtifact({ id: created.id, kind: 'report', content: '# Stale' })
    const next = await ctx.notebooks.setSourceSelection({
      id: summarized.id,
      sourceIds: [created.sources[0]!.id],
    })
    expect(next.summary).toBe('')
    expect(next.artifacts).toEqual([])
  })

  it('saves a chat answer as its own notebook and lists mention candidates', async () => {
    const ctx = await harness()
    const saved = await ctx.notebooks.saveChatAnswer({
      questionText: 'What is a notebook?',
      answerText: 'A durable multi-source note.',
    })
    expect(saved.sourceType).toBe('chat_answer')
    expect(saved.sources[0]?.kind).toBe('chat_answer')
    expect(ctx.notebooks.candidates({ query: 'durable' }).candidates[0]?.mention).toContain('dsh-notebook:')
  })

  it('refuses Studio generation while the runner is disabled', async () => {
    const ctx = await harness()
    const created = await ctx.notebooks.put({ title: 'Quiet', content: 'No runner' })
    await expect(ctx.notebooks.generateStudio({ id: created.id, kind: 'mindmap' })).rejects.toThrow('generation runner is disabled')
  })

  it('mounts sqlite itself when the host has not', async () => {
    const ctx = await harness()
    expect(ctx.storage.backend.names()).toContain('sqlite')
    const created = await ctx.notebooks.put({ title: 'Stored', content: 'On sqlite' })
    expect(ctx.notebooks.get({ id: created.id })?.content).toBe('On sqlite')
  })

  it('reuses an already mounted sqlite backend', async () => {
    const storageRoot = await mkdtemp(join(tmpdir(), 'dsh-notebooks-share-'))
    roots.push(storageRoot)
    const ctx = new Context()
    contexts.push(ctx)
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(Tools)
    await ctx.plugin(Storage)
    await ctx.plugin(StorageJson, { root: storageRoot })
    await ctx.plugin(StorageSqlite, { path: join(storageRoot, 'shared.sqlite') })
    await ctx.plugin(StorageDomain, { backend: 'json' })
    await ctx.plugin(Notebooks, {
      maxEntries: 2,
      maxContentChars: 40,
      maxSourcesPerEntry: 3,
      maxSourceChars: 80,
      maxArtifactChars: 120,
      sqlitePath: join(storageRoot, 'unused.sqlite'),
    })
    expect(ctx.storage.backend.names().filter(name => name === 'sqlite')).toEqual(['sqlite'])
    const created = await ctx.notebooks.put({ title: 'Shared', content: 'Existing backend' })
    expect(ctx.notebooks.get({ id: created.id })?.title).toBe('Shared')
  })
})
