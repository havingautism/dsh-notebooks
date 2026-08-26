// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NotebooksView } from '../src/client/NotebooksView.tsx'
import { zh, type NotebooksKey } from '../src/client/locales.ts'
import type { NotebooksViewApi } from '../src/client/view-types.ts'

const t = (key: NotebooksKey, params?: Record<string, unknown>) => {
  let text = zh[key]
  if (params !== undefined) {
    for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value))
  }
  return text
}

describe('Notebooks view', () => {
  it('submits a new note through the mounted API', async () => {
    const create = vi.fn<NotebooksViewApi['create']>(() => new Promise<never>(() => undefined))
    const api = {
      list: vi.fn(async () => []),
      create,
    } as unknown as NotebooksViewApi

    render(<NotebooksView t={t} {...api} />)
    fireEvent.click((await screen.findAllByRole('button', { name: t('action.new') }))[0]!)
    fireEvent.change(screen.getByPlaceholderText(t('composer.contentPlaceholder')), { target: { value: '今天的灵感' } })
    fireEvent.click(screen.getByRole('button', { name: t('action.create') }))

    await waitFor(() => { expect(create).toHaveBeenCalledOnce() })
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ content: '今天的灵感' }))
  })
})

describe('Notebooks composer picker', () => {
  it('lists notes and selects one into the composer', async () => {
    const selectNotebook = vi.fn(() => true)
    const openNotebook = vi.fn()
    const api = {
      candidates: vi.fn(async () => [{
        id: 'note-1',
        title: 'Renderer notes',
        mention: '@[Renderer notes](dsh-notebook:note-1)',
        summary: 'Replay is log-derived.',
        summarizing: false,
      }]),
    } as unknown as NotebooksViewApi
    const { NotebooksComposerButton } = await import('../src/client/NotebooksComposerButton.tsx')
    const { createNotebooksUiStore } = await import('../src/client/ui-store.ts')

    render(
      <NotebooksComposerButton
        sessionId={'session-1' as never}
        t={t}
        api={api}
        store={createNotebooksUiStore()}
        selectNotebook={selectNotebook}
        openNotebook={openNotebook}
        input={{
          draft: '',
          imageIds: [],
          draftRev: 1,
          phase: 'plain',
          occurrences: [],
          queue: [],
        } as never}
        session={{} as never}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: t('picker.title') }))
    expect(await screen.findByText('Renderer notes')).toBeTruthy()
    fireEvent.click(screen.getByText('Renderer notes'))
    expect(selectNotebook).toHaveBeenCalledWith('session-1', expect.objectContaining({ id: 'note-1' }))
  })
})

describe('Notebooks cite chip', () => {
  it('opens the notebook overlay when the badge is clicked', async () => {
    const { NotebooksCiteChip } = await import('../src/client/NotebooksCiteChip.tsx')
    const { createNotebooksUiStore } = await import('../src/client/ui-store.ts')
    const store = createNotebooksUiStore()
    const api = {} as NotebooksViewApi

    render(
      <NotebooksCiteChip
        t={t}
        api={api}
        store={store}
        node={{
          key: 'notebook-cite:1',
          kind: 'notebook-cite',
          data: { notebookId: 'note-42', title: 'Renderer notes' },
        } as never}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: `${t('cite.open')}: Renderer notes` }))
    expect(store.getOpen()).toBe(true)
    expect(store.getNotebookId()).toBe('note-42')
  })
})

