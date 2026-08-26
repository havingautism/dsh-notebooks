/** Codemini-style notebook picker launched from the composer tool row. */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import {
  IconListPenOutline16 as IconNote, IconSearchOutline16 as IconSearch,
  IconRightUpOutline14 as IconExternalLink,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { NotebookMentionCandidate } from '../types.ts'
import type { NotebooksComposerFace } from './client-face.ts'
import type { NotebooksKey } from './locales.ts'
import { isNotebookAskBlocked } from './composer-notebook.ts'
import css from './composer-picker.module.css'

const PAGE_SIZE = 12
const VIEWPORT_MARGIN = 12

type NotebooksComposerButtonProps =
  PropsRuntime<'conversation.input.left'>
  & PropsLocale<'notebooks'>
  & NotebooksComposerFace
  & { readonly sessionId: SessionId }

/** Render the notebook launcher button and searchable picker popover. */
export function NotebooksComposerButton({
  sessionId, input, t, api, selectNotebook, openNotebook,
}: NotebooksComposerButtonProps) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<readonly NotebookMentionCandidate[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [error, setError] = useState('')
  const [fixedPos, setFixedPos] = useState<{ left: number; top: number } | null>(null)

  const locked = input.phase === 'adjudicating' || input.phase === 'submitting' || input.phase === 'claimed'
  const activeOccurrence = input.occurrences.find(item => item.source === 'notebook')

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    if (needle === '') return entries
    return entries.filter(entry => [
      entry.title, entry.summary, entry.mention,
    ].join('\n').toLocaleLowerCase().includes(needle))
  }, [entries, query])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visible.length

  const loadEntries = useCallback(async () => {
    setLoading(true)
    try {
      setEntries(await api.candidates(''))
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    if (!open) return
    void loadEntries()
  }, [open, loadEntries])

  useLayoutEffect(() => {
    if (!open) {
      setFixedPos(null)
      return
    }
    const place = () => {
      const anchor = anchorRef.current?.getBoundingClientRect()
      if (anchor === undefined) return
      const panel = panelRef.current
      const width = panel?.offsetWidth ?? 384
      const height = panel?.offsetHeight ?? 320
      let left = anchor.left
      let top = anchor.top - height - 8
      left = Math.min(Math.max(left, VIEWPORT_MARGIN), window.innerWidth - width - VIEWPORT_MARGIN)
      top = Math.min(Math.max(top, VIEWPORT_MARGIN), window.innerHeight - height - VIEWPORT_MARGIN)
      setFixedPos({ left, top })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, loading, filtered.length, visible.length])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (anchorRef.current?.contains(event.target)) return
      if (panelRef.current?.contains(event.target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pickEntry = (entry: NotebookMentionCandidate) => {
    if (isNotebookAskBlocked(entry)) {
      setError(t('picker.summaryPending' as NotebooksKey))
      return
    }
    const ok = selectNotebook(sessionId, entry)
    if (!ok) {
      setError(t('picker.selectFailed' as NotebooksKey))
      return
    }
    setError('')
    setOpen(false)
  }

  const panel = (
    <div
      ref={panelRef}
      className={css.composerPicker}
      role="dialog"
      aria-label={t('picker.title' as NotebooksKey)}
      style={fixedPos === null ? { visibility: 'hidden', position: 'fixed', left: 0, top: 0 } : {
        position: 'fixed',
        left: fixedPos.left,
        top: fixedPos.top,
        zIndex: 120,
      }}
    >
      <div className={css.header}>
        <div className={css.headerRow}>
          <div className={css.title}>{t('picker.title' as NotebooksKey)}</div>
          <span className={css.count}>{filtered.length}</span>
        </div>
        <p className={css.help}>{t('picker.help' as NotebooksKey)}</p>
        <label className={css.search}>
          <IconSearch size={14} />
          <input
            className={css.searchInput}
            type="search"
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder={t('picker.search' as NotebooksKey)}
            aria-label={t('picker.search' as NotebooksKey)}
          />
        </label>
      </div>
      <div className={css.list}>
        {loading ? (
          <div className={css.loading}>{t('picker.loading' as NotebooksKey)}</div>
        ) : filtered.length === 0 ? (
          <div className={css.empty}>{t('picker.empty' as NotebooksKey)}</div>
        ) : (
          <>
            {visible.map(entry => {
              const blocked = isNotebookAskBlocked(entry)
              const active = activeOccurrence?.clipboardText === entry.mention
                || activeOccurrence?.ref === entry.mention
              return (
                <div
                  key={entry.id}
                  className={active ? `${css.entry} ${css.entryActive}` : css.entry}
                >
                  <button
                    type="button"
                    className={css.entryPick}
                    disabled={blocked}
                    onClick={() => { pickEntry(entry) }}
                  >
                    <div className={css.entryTop}>
                      <span className={css.entryTitle}>{entry.title}</span>
                      {active ? (
                        <span className={css.badge}>{t('picker.active' as NotebooksKey)}</span>
                      ) : blocked ? (
                        <span className={css.badge}>{t('picker.summarizing' as NotebooksKey)}</span>
                      ) : null}
                    </div>
                    <span className={css.entryPreview}>{entry.summary}</span>
                  </button>
                  <button
                    type="button"
                    className={css.entryOpen}
                    title={t('cite.open' as NotebooksKey)}
                    aria-label={`${t('cite.open' as NotebooksKey)}: ${entry.title}`}
                    onClick={() => { openNotebook(entry.id); setOpen(false) }}
                  >
                    <IconExternalLink size={15} />
                  </button>
                </div>
              )
            })}
            {hasMore ? (
              <button
                type="button"
                className={css.more}
                onClick={() => { setVisibleCount(count => count + PAGE_SIZE) }}
              >
                {t('picker.showMore' as NotebooksKey, { count: String(filtered.length - visible.length) })}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={css.toolButton}
        title={t('picker.title' as NotebooksKey)}
        aria-label={t('picker.title' as NotebooksKey)}
        aria-expanded={open}
        disabled={locked}
        onClick={() => {
          if (locked) return
          setOpen(value => !value)
          if (!open) {
            setQuery('')
            setVisibleCount(PAGE_SIZE)
            setError('')
          }
        }}
      >
        <IconNote size={18} />
      </button>
      {open && typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
      {error === '' ? null : <span className={css.dockError}>{error}</span>}
    </>
  )
}
