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
import { remoteMethods } from '@deepseek-ai/dsh-type-meta'
import Notebooks, { NotebookId } from '../src/index.ts'

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
  })
  return ctx
}

describe('Notebooks extension', () => {
  it('publishes its complete independent Remote and Tool surface', async () => {
    const ctx = await harness()
    expect(ctx.notebooks.typertGateway.namespace).toBe('notebooks')
    expect(remoteMethods(ctx.notebooks).map(marker => marker.method)).toEqual([
      'list', 'get', 'put', 'addSource', 'setSourceSelection', 'removeSource',
      'setSummary', 'setArtifact', 'delete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([
      'notebook_list', 'notebook_write', 'notebook_add_source',
      'notebook_set_summary', 'notebook_set_artifact', 'notebook_delete',
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
})
