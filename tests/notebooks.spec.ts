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
  await ctx.plugin(Notebooks, { maxEntries: 2, maxContentChars: 40 })
  return ctx
}

describe('Notebooks extension', () => {
  it('publishes its Remote namespace and model Tool names without another extension', async () => {
    const ctx = await harness()
    expect(ctx.notebooks.typertGateway.namespace).toBe('notebooks')
    expect(remoteMethods(ctx.notebooks).map(marker => marker.method)).toEqual(['list', 'put', 'delete'])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([
      'notebook_list',
      'notebook_write',
      'notebook_delete',
    ])
  })

  it('creates, searches, updates, and deletes durable entries', async () => {
    const ctx = await harness()
    const created = await ctx.notebooks.put({
      title: 'Renderer decisions',
      content: 'Rows derive state from durable blocks.',
      tags: ['ui', ' replay ', 'ui'],
    })
    expect(created.id).toMatch(/^note-/u)
    expect(created.tags).toEqual(['ui', 'replay'])
    expect(ctx.notebooks.list({ query: 'durable' }).entries).toEqual([created])
    expect(ctx.notebooks.list({ tag: 'REPLAY' }).entries).toEqual([created])

    const updated = await ctx.notebooks.put({
      id: created.id,
      title: 'Renderer contract',
      content: 'Replay uses the same logged block.',
    })
    expect(updated.createdAt).toBe(created.createdAt)
    expect(updated.title).toBe('Renderer contract')
    await expect(ctx.notebooks.delete({ id: created.id })).resolves.toEqual({ deleted: true })
    await expect(ctx.notebooks.delete({ id: created.id })).resolves.toEqual({ deleted: false })
  })

  it('enforces limits before committing a mutation', async () => {
    const ctx = await harness()
    await expect(ctx.notebooks.put({ title: 'Blank', content: '   ' })).rejects.toThrow('content must not be blank')
    await expect(ctx.notebooks.put({ title: 'Long', content: 'x'.repeat(41) })).rejects.toThrow('exceeds 40')
    await ctx.notebooks.put({ title: 'One', content: '1' })
    await ctx.notebooks.put({ title: 'Two', content: '2' })
    await expect(ctx.notebooks.put({ title: 'Three', content: '3' })).rejects.toThrow('entry limit 2')
  })

  it('retains entries across a cold storage restart', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-notebooks-restart-'))
    roots.push(root)
    const first = await harness(root)
    const note = await first.notebooks.put({ title: 'Persistent', content: 'Across contexts' })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.notebooks.list({}).entries.map(entry => entry.id)).toEqual([note.id])
    expect(second.notebooks.list({ query: 'no-match' }).entries).toEqual([])
    expect(second.notebooks.list({ tag: 'no-match' }).entries).toEqual([])
    await expect(second.notebooks.delete({ id: NotebookId('missing') })).resolves.toEqual({ deleted: false })
  })
})
