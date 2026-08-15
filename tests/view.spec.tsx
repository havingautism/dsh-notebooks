// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NotebooksView } from '../src/client/NotebooksView.tsx'
import type { NotebooksViewApi } from '../src/client/view-types.ts'

describe('Notebooks view', () => {
  it('submits a new note through the mounted API', async () => {
    const put = vi.fn<NotebooksViewApi['put']>(() => new Promise<never>(() => undefined))
    const api = {
      list: vi.fn(async () => []),
      put,
    } as unknown as NotebooksViewApi

    render(<NotebooksView {...api as Parameters<typeof NotebooksView>[0]} />)
    fireEvent.click((await screen.findAllByRole('button', { name: /新建笔记/ }))[0]!)
    fireEvent.change(screen.getByPlaceholderText('写下背景、目标或第一条资料…'), { target: { value: '今天的灵感' } })
    fireEvent.click(screen.getByRole('button', { name: '创建笔记' }))

    await waitFor(() => { expect(put).toHaveBeenCalledOnce() })
    expect(put).toHaveBeenCalledWith(expect.objectContaining({ content: '今天的灵感' }))
  })
})
