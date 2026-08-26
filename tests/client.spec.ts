import { describe, expect, it, vi } from 'vitest'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { apply } from '../src/client/index.ts'
import { createNotebooksUiStore, readNotebooksRoute } from '../src/client/ui-store.ts'
import {
  clearNotebookInComposer, isNotebookAskBlocked, selectNotebookInComposer,
} from '../src/client/composer-notebook.ts'
import { citeFromMessageEvent } from '../src/client/notebook-cite-definition.ts'
import type { NotebooksViewApi } from '../src/client/view-types.ts'
import { formatNotebookMention } from '../src/mention.ts'
import { NotebookId } from '../src/types.ts'

describe('Notebooks client mount', () => {
  it('registers sidebar and overlay surfaces inside the mounted Remote namespace scope', async () => {
    const list = vi.fn(async () => ({ ok: true as const, value: { entries: [] } }))
    let injectFace: (() => { api: NotebooksViewApi }) | undefined
    const injected: string[] = []
    const disposeEntry = vi.fn()
    const disposeView = vi.fn(async () => undefined)
    const disposeRemote = vi.fn(async () => undefined)
    const view = Object.assign(Promise.resolve(), { dispose: disposeView })
    const remoteCtx = {
      remote: {
        notebooks: { list },
        $on: vi.fn(() => () => undefined),
      },
      slots: {
        inject: (key: string, callback: () => unknown) => {
          injected.push(key)
          callback()
          return disposeEntry
        },
        register: (options: { inject: () => { api: NotebooksViewApi } }) => {
          injectFace = options.inject
          return disposeEntry
        },
      },
    }
    const ctx = {
      remote: {
        $mount: vi.fn(async () => disposeRemote),
        notebooks: { list, candidates: vi.fn(async () => ({ ok: true as const, value: { candidates: [] } })) },
      },
      locale: {
        register: vi.fn(() => vi.fn()),
        bind: vi.fn(() => (key: string) => key),
      },
      sessions: {},
      inputTriggers: {
        registerSource: vi.fn(() => vi.fn()),
      },
      effect: (callback: () => unknown) => callback(),
      get: vi.fn((key: string) => {
        if (key === 'conversationEvents') {
          return { register: vi.fn(() => vi.fn()) }
        }
        return undefined
      }),
      inject: (deps: readonly string[], callback: (scope: typeof remoteCtx) => void) => {
        expect(deps).toEqual(['remote.notebooks', 'slots'])
        callback(remoteCtx)
        return view
      },
    }

    const dispose = await apply(ctx as unknown as ClientContext)
    expect(injected).toEqual([
      'conversation.chat.node',
      'sidebar.footer.action',
      'shell.overlay',
      'conversation.input.left',
      'conversation.input.dock',
    ])
    expect(injectFace).toBeTypeOf('function')
    await expect(injectFace?.().api.list('')).resolves.toEqual([])
    expect(list).toHaveBeenCalledWith({})
    await dispose()
    expect(disposeView).toHaveBeenCalledOnce()
    expect(disposeRemote).toHaveBeenCalledOnce()
  })
})

describe('Notebooks overlay route', () => {
  it('reads library and notebook hashes', () => {
    expect(readNotebooksRoute('')).toEqual({ open: false, notebookId: null })
    expect(readNotebooksRoute('#notes')).toEqual({ open: true, notebookId: null })
    expect(readNotebooksRoute('#notes/note-1')).toEqual({ open: true, notebookId: 'note-1' })
  })

  it('opens the overlay and selects a notebook from setNotebookId', () => {
    const store = createNotebooksUiStore()
    expect(store.getOpen()).toBe(false)
    store.setNotebookId('note-42')
    expect(store.getOpen()).toBe(true)
    expect(store.getNotebookId()).toBe('note-42')
  })

  it('restores the notebook id from the hash when opening the overlay', () => {
    window.location.hash = '#notes/note-from-hash'
    const store = createNotebooksUiStore()
    expect(store.getOpen()).toBe(true)
    expect(store.getNotebookId()).toBe('note-from-hash')
    store.setOpen(false)
    window.location.hash = '#notes/note-from-hash'
    store.setOpen(true)
    expect(store.getOpen()).toBe(true)
    expect(store.getNotebookId()).toBe('note-from-hash')
    window.location.hash = ''
  })

  it('syncs store state when the hash changes externally', () => {
    const store = createNotebooksUiStore()
    window.location.hash = '#notes/note-sync'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(store.getOpen()).toBe(true)
    expect(store.getNotebookId()).toBe('note-sync')
    window.location.hash = ''
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(store.getOpen()).toBe(false)
    expect(store.getNotebookId()).toBe(null)
  })
})

describe('Composer notebook selection', () => {
  it('inserts one notebook mention into the composer shell', () => {
    const mention = formatNotebookMention(NotebookId('note-1'), 'Renderer notes')
    let draft = 'hello'
    let draftRev = 1
    const occurrences: { source: string; offset: number; length: number }[] = []
    const insertReference = vi.fn(() => {
      draft = `${draft} @Renderer notes `
      draftRev += 1
      occurrences.push({ source: 'notebook', offset: 6, length: 16 })
      return true
    })
    const hub = {
      shell: () => ({
        get snapshot() { return { draft, draftRev, occurrences } },
        setDraft(next: string) { draft = next; draftRev += 1 },
        insertReference,
      }),
    }
    expect(selectNotebookInComposer(hub, 'session-1' as never, {
      id: NotebookId('note-1'),
      title: 'Renderer notes',
      mention,
      summary: 'Overview',
      summarizing: false,
    })).toBe(true)
    expect(insertReference).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'notebook', ref: mention, label: 'Renderer notes' }),
      expect.objectContaining({ start: 6, end: 6 }),
    )
    expect(clearNotebookInComposer(hub, 'session-1' as never)).toBe(true)
    expect(draft.startsWith('hello')).toBe(true)
  })

  it('blocks follow-up while an overview is still generating', () => {
    expect(isNotebookAskBlocked({ summarizing: true })).toBe(true)
    expect(isNotebookAskBlocked({ summary: 'Ready', latestJob: { status: 'running' } })).toBe(false)
    expect(isNotebookAskBlocked({ summary: '', latestJob: { status: 'running' } })).toBe(true)
  })
})

describe('Notebook cite extraction', () => {
  it('reads notebookId from the injected plugin source', () => {
    expect(citeFromMessageEvent({
      type: 'user/message',
      data: {
        source: {
          kind: 'plugin',
          plugin: '@deepseek-ai/dsh-notebooks',
          form: 'recall',
          notebookId: 'note-1',
          notebookTitle: 'Renderer notes',
        },
        content: [{ type: 'text', text: '<notebook_context>\nTitle: Renderer notes\nEntry ID: note-1\n' }],
      },
    })).toEqual({ notebookId: 'note-1', title: 'Renderer notes' })
  })

  it('falls back to a composer mention still present on the user message', () => {
    const mention = formatNotebookMention(NotebookId('note-2'), 'Saved idea')
    expect(citeFromMessageEvent({
      type: 'user/message',
      data: {
        source: { kind: 'user' },
        content: [{ type: 'text', text: `See ${mention}` }],
      },
    })).toEqual({ notebookId: 'note-2', title: 'Saved idea' })
  })
})

