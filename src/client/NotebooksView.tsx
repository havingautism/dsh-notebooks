/** Codemini-aligned notebook library, sources, overview, and Studio workspace. */

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  IconChevronLeftOutline14 as IconArrowLeft, IconCloseOutline16 as IconX,
  IconDataOutline16 as IconLayoutGrid, IconListPenOutline16 as IconNote,
  IconLoadingOutline16 as IconLoading, IconPlusOutline16 as IconPlus,
  IconRightUpOutline14 as IconExternalLink, MarkdownText,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { NotebookId, type NotebookArtifactKind, type NotebookCreateRequest, type NotebookEntry, type NotebookSource } from '../types.ts'
import { parseMindmapTree } from '../studio-mermaid.ts'
import { hydrateNotebook } from './hydrate.ts'
import { MermaidMindmap } from './MermaidMindmap.tsx'
import type { NotebooksKey } from './locales.ts'
import type { NotebooksViewApi } from './view-types.ts'
import css from './views.module.css'

type Filter = 'all' | 'manual' | 'url' | 'document'
type ViewMode = 'grid' | 'list'
type MobilePane = 'sources' | 'summary' | 'studio'
type Translate = (key: NotebooksKey, params?: Record<string, unknown>) => string
type PendingDelete = { id: NotebookEntry['id']; title: string }
type ComposerDocument = { name: string; mimeType: string; content: string }

type NotebooksViewProps = NotebooksViewApi & {
  t: Translate
  notebookId?: string | null
  onSelectNotebook?: (id: string | null) => void
  onClose?: () => void
}

/** Render the notebook library, source workspace, overview, and Studio artifacts. */
export function NotebooksView({ t, notebookId, onSelectNotebook, onClose, ...api }: NotebooksViewProps) {
  const [entries, setEntries] = useState<readonly NotebookEntry[]>([])
  const [selected, setSelected] = useState<NotebookEntry | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<'recent' | 'title'>('recent')
  const [composerOpen, setComposerOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [notebookLoading, setNotebookLoading] = useState(false)

  const openNotebook = useCallback((entry: NotebookEntry | null) => {
    setSelected(entry === null ? null : hydrateNotebook(entry))
    onSelectNotebook?.(entry?.id ?? null)
  }, [onSelectNotebook])

  const apiRef = useRef(api)
  apiRef.current = api
  const refresh = useCallback(async (nextQuery: string) => {
    setError(null)
    try {
      const next = (await apiRef.current.list(nextQuery)).map(hydrateNotebook)
      setEntries(next)
      setSelected(current => {
        if (current === null) return null
        const listed = next.find(item => item.id === current.id)
        return listed !== undefined && listed.updatedAt > current.updatedAt ? listed : current
      })
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [])

  useEffect(() => {
    if (selected !== null) return
    const timer = window.setTimeout(() => { void refresh(query) }, query === '' ? 0 : 250)
    return () => { window.clearTimeout(timer) }
  }, [query, refresh, selected])

  useEffect(() => {
    if (notebookId === undefined) return
    if (notebookId === null) { setSelected(null); setNotebookLoading(false); return }
    const listed = entries.find(item => item.id === notebookId)
    if (listed !== undefined) {
      setSelected(current => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateNotebook(listed))
      setNotebookLoading(false)
      return
    }
    let active = true
    setNotebookLoading(true)
    void apiRef.current.get(NotebookId(notebookId)).then(entry => {
      if (!active) return
      if (entry === null) {
        setSelected(null)
        setError(t('empty.noMatch'))
      } else {
        setSelected(hydrateNotebook(entry))
      }
      setNotebookLoading(false)
    }, (cause: unknown) => {
      if (active) {
        setError(messageOf(cause))
        setNotebookLoading(false)
      }
    })
    return () => { active = false }
  }, [notebookId, entries, t])

  const requestDelete = useCallback((target: PendingDelete) => { setError(null); setPendingDelete(target) }, [])
  const confirmDelete = useCallback(async () => {
    if (pendingDelete === null || deleteBusy) return
    setDeleteBusy(true)
    setError(null)
    try {
      await api.delete(pendingDelete.id)
      if (selected?.id === pendingDelete.id) openNotebook(null)
      setPendingDelete(null)
      await refresh(query)
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      setDeleteBusy(false)
    }
  }, [api, deleteBusy, openNotebook, pendingDelete, query, refresh, selected?.id])

  const visible = useMemo(() => {
    const filtered = filter === 'all'
      ? [...entries]
      : entries.filter(entry => entry.sourceType === filter || entry.sources.some(source => source.kind === filter))
    return sort === 'title'
      ? filtered.toSorted((left, right) => left.title.localeCompare(right.title))
      : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt)
  }, [entries, filter, sort])

  const updateSelected = useCallback((entry: NotebookEntry) => {
    const next = hydrateNotebook(entry)
    setSelected(current => current?.id === next.id && !notebookEntryChanged(current, next) ? current : next)
    setEntries(current => current.map(item => item.id === next.id ? next : item))
  }, [])

  useEffect(() => {
    const unsubscribe = api.subscribeProgress?.(latest => { updateSelected(hydrateNotebook(latest)) })
    return () => { unsubscribe?.() }
  }, [api, updateSelected])

  if (notebookId !== undefined && notebookId !== null && selected === null && notebookLoading) {
    return <div className={css.shell}><div className={css.content}><div className={css.notebookLoading} role="status"><IconLoading className={css.spinner} size={16} /><span>{t('workspace.loading')}</span></div></div></div>
  }

  if (selected !== null) return <div className={css.shell}>
    <NotebookWorkspace entry={selected} api={api} t={t} onChange={updateSelected} onBack={() => { openNotebook(null) }} onDelete={() => { requestDelete({ id: selected.id, title: selected.title }) }} error={error} setError={setError} />
    {pendingDelete === null ? null : <DeleteConfirmDialog pending={pendingDelete} busy={deleteBusy} t={t} onCancel={() => { if (!deleteBusy) setPendingDelete(null) }} onConfirm={() => { void confirmDelete() }} />}
  </div>

  const filters: ReadonlyArray<readonly [Filter, NotebooksKey]> = [['all', 'filter.all'], ['manual', 'filter.manual'], ['url', 'filter.url'], ['document', 'filter.document']]
  return <div className={css.shell}><div className={css.content}>
    <span data-notebooks-view="" hidden />
    {onClose === undefined ? null : (
      <div className={css.libraryTopBar}>
        <button className={css.backButton} type="button" aria-label={t('library.backAria')} onClick={onClose}>
          <IconArrowLeft size={15} />
          {t('library.back')}
        </button>
      </div>
    )}
    <div className={css.toolbar}>
      <div className={css.filters} aria-label={t('library.filterAria')}>
        {filters.map(([id, key]) => <button key={id} className={filter === id ? css.activeChip : css.chip} type="button" aria-current={filter === id ? 'page' : undefined} onClick={() => { setFilter(id) }}>{t(key)}</button>)}
      </div>
      <div className={css.toolbarActions}>
        <input className={css.search} value={query} onChange={event => { setQuery(event.target.value) }} placeholder={t('toolbar.search')} aria-label={t('toolbar.searchAria')} />
        <select className={css.select} value={sort} onChange={event => { setSort(event.target.value as 'recent' | 'title') }} aria-label={t('toolbar.sortAria')}>
          <option value="recent">{t('toolbar.sortRecent')}</option>
          <option value="title">{t('toolbar.sortTitle')}</option>
        </select>
        <div className={css.viewToggle}>
          <button className={css.iconButton} type="button" aria-label={t('toolbar.gridView')} aria-pressed={viewMode === 'grid'} data-active={viewMode === 'grid'} onClick={() => { setViewMode('grid') }}><IconLayoutGrid size={16} /></button>
          <button className={css.iconButton} type="button" aria-label={t('toolbar.listView')} aria-pressed={viewMode === 'list'} data-active={viewMode === 'list'} onClick={() => { setViewMode('list') }}><IconNote size={16} /></button>
        </div>
        <button className={css.primaryButton} type="button" onClick={() => { setError(null); setComposerOpen(true) }}><IconPlus size={15} />{t('action.new')}</button>
      </div>
    </div>
    <section className={css.library}>
      <header className={css.libraryTitle}><div><h2>{t('library.title')}</h2><p>{t('library.itemCount', { count: visible.length })}</p></div></header>
      {error === null || composerOpen ? null : <div className={css.error} role="alert">{error}</div>}
      {visible.length === 0
        ? <div className={css.emptyState}><span aria-hidden="true"><IconNote size={22} /></span><strong>{query === '' ? t('empty.none') : t('empty.noMatch')}</strong><p>{query === '' ? t('empty.hintStart') : t('empty.hintNoMatch')}</p>{query === '' ? <button className={css.primaryButton} type="button" onClick={() => { setComposerOpen(true) }}><IconPlus size={15} />{t('action.new')}</button> : null}</div>
        : <div className={viewMode === 'grid' ? css.notebookGrid : css.notebookList} aria-label={t('library.title')}>
            {viewMode === 'grid' ? <button className={css.createCard} type="button" onClick={() => { setComposerOpen(true) }}><span><IconPlus size={22} /></span><strong>{t('action.new')}</strong></button> : null}
            {visible.map((entry, index) => <NotebookCard key={entry.id} entry={entry} index={index} list={viewMode === 'list'} t={t} onOpen={() => { openNotebook(entry) }} onDelete={() => { requestDelete({ id: entry.id, title: entry.title }) }} />)}
          </div>}
    </section>
  </div>
  {composerOpen ? <NotebookComposer busy={busy} error={error} setBusy={setBusy} t={t} onClose={() => { if (!busy) setComposerOpen(false) }} onCreate={async request => { const entry = await api.create(request); setComposerOpen(false); await refresh(query); openNotebook(entry) }} setError={setError} /> : null}
  {pendingDelete === null ? null : <DeleteConfirmDialog pending={pendingDelete} busy={deleteBusy} t={t} onCancel={() => { if (!deleteBusy) setPendingDelete(null) }} onConfirm={() => { void confirmDelete() }} />}
  </div>
}

function NotebookCard({ entry, index, list, t, onOpen, onDelete }: { entry: NotebookEntry; index: number; list: boolean; t: Translate; onOpen: () => void; onDelete: () => void }) {
  const [emoji, title] = splitEmoji(entry.title)
  const job = entry.latestJob
  const jobFailed = job !== null && job.status === 'failed' && job.kind === 'summary'
  const busy = !jobFailed && job !== null && (job.status === 'pending' || job.status === 'running')
  const fetching = busy && job.kind === 'summary' && job.stage === 'fetch'
  const summarizing = busy && job.kind === 'summary' && job.stage === 'generate'
  const statusLine = jobFailed
    ? t('overview.failed', { error: job.errorText || t('overview.empty') })
    : fetching
      ? t('overview.fetching', { detail: job.partialText })
      : summarizing
        ? t('overview.summarizing')
        : t('card.sources', { count: entry.sources.length, date: formatDate(entry.updatedAt) })
  return <article className={css.notebookCard} data-list={list || undefined} data-busy={busy || undefined} data-failed={jobFailed || undefined} style={{ '--card-tint': CARD_TONES[index % CARD_TONES.length] } as React.CSSProperties}>
    <button className={css.cardOpen} type="button" onClick={onOpen} aria-label={t('card.openAria', { title: entry.title })} />
    <div className={css.cardEmoji}>{emoji || sourceEmoji(entry)}</div>
    <div className={css.cardInfo}>
      <h3>{title}</h3>
      <p>{jobFailed ? (job.errorText || t('overview.empty')) : busy ? (fetching ? t('card.fetching') : t('card.summarizing')) : (entry.summary || entry.content)}</p>
      <span>{jobFailed
        ? statusLine
        : busy
          ? <><IconLoading className={css.spinner} size={11} />{statusLine}</>
          : statusLine}</span>
    </div>
    <button className={css.deleteButton} type="button" aria-label={t('workspace.delete')} onClick={event => { event.stopPropagation(); onDelete() }}><IconX size={15} /></button>
  </article>
}

function NotebookComposer({ busy, error, setBusy, t, onClose, onCreate, setError }: { busy: boolean; error: string | null; setBusy: (value: boolean) => void; t: Translate; onClose: () => void; onCreate: (request: NotebookCreateRequest) => Promise<void>; setError: (value: string | null) => void }) {
  const [title, setTitle] = useState('')
  const [urls, setUrls] = useState('')
  const [content, setContent] = useState('')
  const [documents, setDocuments] = useState<ComposerDocument[]>([])
  const empty = title.trim() === '' && urls.trim() === '' && content.trim() === '' && documents.length === 0
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (busy || empty) return
    setBusy(true)
    setError(null)
    const parsedUrls = urls.split('\n').map(item => item.trim()).filter(Boolean)
    void onCreate({
      ...(title.trim() === '' ? {} : { title: title.trim() }),
      ...(content.trim() === '' ? {} : { content: content.trim() }),
      ...(parsedUrls.length === 0 ? {} : { urls: parsedUrls }),
      ...(documents.length === 0 ? {} : { documents }),
    }).catch((cause: unknown) => { setError(messageOf(cause)) }).finally(() => { setBusy(false) })
  }
  const pickFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])]
    if (files.length === 0) return
    void Promise.all(files.map(async file => ({ name: file.name, mimeType: file.type || 'text/plain', content: await file.text() }))).then(next => {
      setDocuments(current => [...current, ...next])
    }, cause => { setError(messageOf(cause)) })
    event.target.value = ''
  }
  return <div className={css.modalBackdrop} role="presentation"><form className={css.modal} role="dialog" aria-modal="true" aria-labelledby="new-notebook-title" onSubmit={submit}>
    <div className={css.modalHeader}>
      <div className={css.modalHeading}><span aria-hidden="true"><IconNote size={18} /></span><div><h3 id="new-notebook-title">{t('composer.title')}</h3><p>{t('composer.subtitle')}</p></div></div>
      <button className={css.iconButton} type="button" aria-label={t('composer.closeAria')} disabled={busy} onClick={onClose}><IconX size={16} /></button>
    </div>
    <div className={css.modalBody}>
      <label>{t('composer.titleLabel')}<input className={css.input} value={title} onChange={event => { setTitle(event.target.value) }} placeholder={t('composer.titlePlaceholder')} /></label>
      <label>{t('composer.urls')}<textarea className={css.textarea} value={urls} onChange={event => { setUrls(event.target.value) }} placeholder={t('composer.urlsPlaceholder')} /></label>
      <label>{t('composer.documents')}
        <span className={css.fileRow}>
          <label className={css.secondaryButton}>{t('composer.chooseDocuments')}<input hidden multiple type="file" accept=".txt,.md,text/plain,text/markdown" onChange={pickFiles} /></label>
        </span>
        {documents.length === 0 ? null : <ul className={css.fileChips}>{documents.map((document, index) => <li key={`${document.name}-${index}`}>{document.name}<button type="button" aria-label={document.name} onClick={() => { setDocuments(current => current.filter((_, item) => item !== index)) }}><IconX size={12} /></button></li>)}</ul>}
      </label>
      <label>{t('composer.content')}<textarea autoFocus className={css.textarea} value={content} onChange={event => { setContent(event.target.value) }} placeholder={t('composer.contentPlaceholder')} /></label>
      {error === null ? null : <div className={css.modalError} role="alert">{error}</div>}
    </div>
    <div className={css.modalFooter}>
      <span>{t('composer.footer')}</span>
      <div>
        <button className={css.secondaryButton} type="button" disabled={busy} onClick={onClose}>{t('action.cancel')}</button>
        <button className={css.primaryButton} type="submit" disabled={busy || empty}>{busy ? <IconLoading className={css.spinner} size={14} /> : <IconPlus size={14} />}{busy ? t('action.creating') : t('action.create')}</button>
      </div>
    </div>
  </form></div>
}

function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }: { pending: PendingDelete; busy: boolean; t: Translate; onCancel: () => void; onConfirm: () => void }) {
  const [, title] = splitEmoji(pending.title)
  const name = title || pending.title
  return <div className={css.confirmBackdrop} role="presentation" onClick={() => { if (!busy) onCancel() }}>
    <div className={css.confirmCard} role="dialog" aria-modal="true" aria-labelledby="delete-notebook-title" onClick={event => { event.stopPropagation() }}>
      <span className={css.confirmMark} aria-hidden="true" />
      <h3 id="delete-notebook-title">{t('delete.title')}</h3>
      <p>{t('delete.body', { title: name })}</p>
      <div className={css.confirmActions}>
        <button className={css.confirmCancel} type="button" disabled={busy} onClick={onCancel}>{t('action.cancel')}</button>
        <button className={css.confirmDelete} type="button" disabled={busy} onClick={onConfirm}>{busy ? <IconLoading className={css.spinner} size={14} /> : null}{t('delete.confirm')}</button>
      </div>
    </div>
  </div>
}

function NotebookWorkspace({ entry, api, t, onChange, onBack, onDelete, error, setError }: { entry: NotebookEntry; api: NotebooksViewApi; t: Translate; onChange: (entry: NotebookEntry) => void; onBack: () => void; onDelete: () => void; error: string | null; setError: (value: string | null) => void }) {
  const [sourceDraft, setSourceDraft] = useState('')
  const [studioKind, setStudioKind] = useState<NotebookArtifactKind>('mindmap')
  const [viewingSourceId, setViewingSourceId] = useState<string | null>(null)
  const [mobilePane, setMobilePane] = useState<MobilePane>('summary')
  const [expandMindmap, setExpandMindmap] = useState(false)
  const [busy, setBusy] = useState(false)

  const run = useCallback(async (operation: () => Promise<NotebookEntry>) => {
    setBusy(true)
    setError(null)
    try { onChange(await operation()) } catch (cause) { setError(messageOf(cause)) } finally { setBusy(false) }
  }, [onChange, setError])

  const addUrls = () => {
    const urls = sourceDraft.split('\n').map(item => item.trim()).filter(Boolean)
    if (urls.length === 0 || busy) return
    void (async () => {
      let next = entry
      for (const url of urls) next = await api.addSource({ id: next.id, kind: 'url', name: hostname(url), url })
      onChange(next)
      setSourceDraft('')
    })().catch(cause => { setError(messageOf(cause)) })
  }
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])]
    if (files.length === 0) return
    void (async () => {
      let next = entry
      const contents = await Promise.all(files.map(file => file.text()))
      for (let index = 0; index < files.length; index += 1) {
        next = await api.addSource({ id: next.id, kind: 'document', name: files[index]?.name ?? 'Document', mimeType: files[index]?.type || 'text/plain', content: contents[index] ?? '' })
      }
      onChange(next)
    })().catch(cause => { setError(messageOf(cause)) })
    event.target.value = ''
  }

  const job = entry.latestJob
  const jobFailed = job !== null && job.status === 'failed' && job.kind === 'summary'
  const summarizing = !jobFailed && job !== null && job.kind === 'summary' && (job.status === 'pending' || job.status === 'running')
  const fetching = summarizing && job.stage === 'fetch'
  const generatingStudio = job !== null && job.kind === studioKind && (job.status === 'pending' || job.status === 'running')
  const studioFailed = job !== null && job.status === 'failed' && job.kind === studioKind
  const artifact = entry.artifacts.find(item => item.kind === studioKind)
  const summaryDraft = summarizing && !fetching ? job.partialText : ''
  const summaryText = summaryDraft.trim() !== '' ? summaryDraft : entry.summary
  const studioText = generatingStudio && job.partialText.trim() !== '' ? job.partialText : artifact?.content ?? ''
  const mindmapReady = studioKind === 'mindmap' && parseMindmapTree(studioText) !== null
  const viewing = entry.sources.find(source => source.id === viewingSourceId) ?? null
  const jobLive = summarizing || generatingStudio

  useEffect(() => {
    if (!jobLive) return
    const timer = window.setInterval(() => {
      void api.get(entry.id).then(next => { if (next !== null) onChange(next) }).catch(() => undefined)
    }, 2000)
    return () => { window.clearInterval(timer) }
  }, [api, entry.id, onChange, jobLive])

  return <div className={css.workspace}>
    <header className={css.workspaceHeader}>
      <button className={css.backButton} type="button" onClick={onBack}><IconArrowLeft size={15} />{t('workspace.back')}</button>
      <div className={css.workspaceHeading}><p className={css.eyebrow}>{t('workspace.notebook')}</p><h2>{entry.title}</h2></div>
      <button className={css.deleteText} type="button" onClick={onDelete}>{t('workspace.delete')}</button>
    </header>
    {error === null ? null : <div className={css.error} role="alert">{error}</div>}
    <div className={css.mobilePanes} role="tablist" aria-label={t('library.title')}>
      {([['sources', 'pane.sources'], ['summary', 'pane.summary'], ['studio', 'pane.studio']] as const).map(([id, key]) => (
        <button key={id} className={mobilePane === id ? css.activeChip : css.chip} type="button" role="tab" aria-selected={mobilePane === id} onClick={() => { setMobilePane(id) }}>{t(key)}</button>
      ))}
    </div>
    <div className={css.workspaceColumns} data-pane={mobilePane}>
      <aside className={css.sourcesPane} data-mobile={mobilePane === 'sources' || undefined}>
        <div className={css.paneHeader}><h3>{t('sources.title')}</h3><span>{entry.sources.length}</span></div>
        <textarea className={css.sourceInput} value={sourceDraft} onChange={event => { setSourceDraft(event.target.value) }} placeholder={t('sources.urlPlaceholder')} />
        <div className={css.sourceActions}>
          <button className={css.secondaryButton} type="button" disabled={busy} onClick={addUrls}>{t('sources.add')}</button>
          <label className={css.secondaryButton}>{t('sources.upload')}<input hidden multiple type="file" accept=".txt,.md,text/plain,text/markdown" onChange={upload} /></label>
        </div>
        <div className={css.sourceList}>{entry.sources.map(source => (
          <SourceRow
            key={source.id}
            source={source}
            job={entry.latestJob}
            t={t}
            active={source.id === viewingSourceId}
            onOpen={() => { setViewingSourceId(source.id); setMobilePane('summary') }}
            onToggle={() => {
              const ids = entry.sources.filter(item => item.id === source.id ? !item.selected : item.selected).map(item => item.id)
              void run(() => api.selectSources(entry.id, ids))
            }}
            onRemove={() => { void api.removeSource(entry.id, source.id).then(result => { onChange(result.entry); if (viewingSourceId === source.id) setViewingSourceId(null) }, cause => { setError(messageOf(cause)) }) }}
          />
        ))}</div>
      </aside>
      <main className={css.summaryPane} data-mobile={mobilePane === 'summary' || undefined}>
        {viewing === null ? <>
          <div className={css.paneHeader}>
            <div><h3>{t('overview.title')}</h3><p>{t('overview.hint')}</p></div>
            <button className={css.iconButton} type="button" disabled={busy || summarizing} aria-label={t('overview.resummarize')} title={t('overview.resummarize')} onClick={() => { void run(() => api.summarize(entry.id)) }}>
              <IconLoading className={summarizing ? css.spinner : undefined} size={15} />
            </button>
          </div>
          {summarizing ? <div className={css.progress} role="status">
            <span className={css.progressBar} />
            <IconLoading className={css.spinner} size={14} />
            <span>{fetching ? t('overview.fetching', { detail: job.partialText }) : t('overview.summarizing')}</span>
          </div> : null}
          {jobFailed ? <div className={css.jobError} role="alert">{t('overview.failed', { error: job.errorText || t('overview.empty') })}</div> : null}
          {summaryText.trim() === ''
            ? <div className={css.emptyPane}>{summarizing ? null : t('overview.empty')}</div>
            : <article className={css.markdownDocument} data-streaming={summarizing && !fetching || undefined}><MarkdownText text={summaryText} streaming={summarizing && !fetching} /></article>}
        </> : <>
          <div className={css.paneHeader}>
            <div><h3>{t('source.original')}</h3><p>{viewing.name}</p></div>
            <div className={css.paneActions}>
              {viewing.url === null ? null : <a className={css.secondaryButton} href={viewing.url} target="_blank" rel="noreferrer">{t('sources.openLink')}<IconExternalLink size={13} /></a>}
              <button className={css.secondaryButton} type="button" onClick={() => { setViewingSourceId(null) }}>{t('overview.title')}</button>
            </div>
          </div>
          {viewing.content.trim() === ''
            ? <div className={css.emptyPane}>{viewing.status === 'pending_fetch' ? t('sources.pending') : t('source.empty')}</div>
            : <article className={css.markdownDocument}><MarkdownText text={viewing.content} /></article>}
        </>}
      </main>
      <aside className={css.studioPane} data-mobile={mobilePane === 'studio' || undefined}>
        <div className={css.paneHeader}><h3>{t('studio.title')}</h3></div>
        <div className={css.studioTabs}>
          {(['mindmap', 'report'] as const).map(kind => <button key={kind} className={studioKind === kind ? css.studioTabActive : css.studioTab} type="button" onClick={() => { setStudioKind(kind) }}>{t(kind === 'mindmap' ? 'studio.mindmap' : 'studio.report')}</button>)}
        </div>
        {generatingStudio ? <div className={css.progress} role="status">
          <span className={css.progressBar} />
          <IconLoading className={css.spinner} size={14} />
          <span>{t('studio.generating')}</span>
        </div> : null}
        {studioFailed ? <div className={css.jobError} role="alert">{t('studio.failed', { error: job.errorText || t('studio.empty') })}</div> : null}
        {studioText.trim() === ''
          ? <div className={css.studioEmpty}>
              <strong>{studioKind === 'mindmap' ? t('studio.emptyMindmap') : t('studio.emptyReport')}</strong>
              <p>{t('studio.empty')}</p>
            </div>
          : <div className={css.artifactPreview}>
              {mindmapReady ? <button className={css.ghostButton} type="button" onClick={() => { setExpandMindmap(true) }}>{t('studio.expand')}</button> : null}
              {studioKind === 'mindmap'
                ? <MermaidMindmap text={studioText} invalidLabel={t('studio.mindmapInvalid')} />
                : <article className={css.markdownDocument}><MarkdownText text={studioText} streaming={generatingStudio} /></article>}
            </div>}
        <button className={css.studioGenerate} type="button" disabled={busy || generatingStudio || summarizing} onClick={() => { void run(() => api.generateStudio(entry.id, studioKind)) }}>
          {generatingStudio ? <IconLoading className={css.spinner} size={14} /> : <IconPlus size={14} />}
          {generatingStudio ? t('studio.generating') : t('studio.generate')}
        </button>
      </aside>
    </div>
    {expandMindmap && mindmapReady ? <div className={css.confirmBackdrop} role="presentation" onClick={() => { setExpandMindmap(false) }}>
      <div className={css.expandCard} role="dialog" aria-modal="true" aria-label={t('studio.mindmap')} onClick={event => { event.stopPropagation() }}>
        <header><h3>{t('studio.mindmap')}</h3><button className={css.iconButton} type="button" aria-label={t('composer.closeAria')} onClick={() => { setExpandMindmap(false) }}><IconX size={16} /></button></header>
        <article className={css.markdownDocument}><MermaidMindmap text={studioText} invalidLabel={t('studio.mindmapInvalid')} /></article>
      </div>
    </div> : null}
  </div>
}

function SourceRow({ source, job, t, active, onOpen, onToggle, onRemove }: { source: NotebookSource; job: NotebookEntry['latestJob']; t: Translate; active: boolean; onOpen: () => void; onToggle: () => void; onRemove: () => void }) {
  const summaryJob = job !== null && job.kind === 'summary' && (job.status === 'pending' || job.status === 'running')
  const fetchingThis = summaryJob && job.stage === 'fetch' && source.status === 'pending_fetch'
  const statusLabel = fetchingThis
    ? t('sources.pending')
    : source.status === 'pending_fetch' && summaryJob && job.stage === 'generate'
      ? (source.content.trim() !== '' ? hostname(source.url ?? '') : t('sources.failed'))
      : source.status === 'pending_fetch'
        ? t('sources.pending')
        : source.status === 'failed'
          ? t('sources.failed')
          : source.kind === 'url'
            ? hostname(source.url ?? '')
            : source.kind
  return <article className={css.sourceRow} data-selected={source.selected || undefined} data-active={active || undefined} data-fetching={fetchingThis || undefined}>
    <input type="checkbox" checked={source.selected} onChange={onToggle} aria-label={source.name} />
    <button className={css.sourceOpen} type="button" onClick={onOpen}>
      <strong>{source.name}</strong>
      <span>{statusLabel}</span>
    </button>
    {source.url === null ? null : <a className={css.sourceLink} href={source.url} target="_blank" rel="noreferrer" aria-label={t('sources.openLink')} onClick={event => { event.stopPropagation() }}><IconExternalLink size={13} /></a>}
    <button type="button" onClick={onRemove} aria-label={t('sources.remove')}><IconX size={14} /></button>
  </article>
}

const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a']
function splitEmoji(value: string): [string, string] {
  const first = Array.from(value.trim())[0] ?? ''
  return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value]
}
function sourceEmoji(entry: NotebookEntry): string {
  return entry.sourceType === 'url' || entry.sources.some(source => source.kind === 'url') ? '🌐'
    : entry.sourceType === 'document' || entry.sources.some(source => source.kind === 'document') ? '📄'
      : entry.sourceType === 'chat_answer' ? '💬' : '📝'
}
function formatDate(value: number): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value)
}
function hostname(value: string): string {
  try { return new URL(value).hostname.replace(/^www\./u, '') } catch { return value || '网页资料' }
}
function messageOf(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}
function notebookEntryChanged(current: NotebookEntry | null, next: NotebookEntry): boolean {
  if (current === null) return true
  if (current.updatedAt !== next.updatedAt) return true
  if (current.summary !== next.summary) return true
  if (current.content !== next.content) return true
  const cj = current.latestJob
  const nj = next.latestJob
  if (cj !== null || nj !== null) {
    if (cj === null || nj === null) return true
    if (cj.id !== nj.id || cj.status !== nj.status || cj.stage !== nj.stage
      || cj.partialText !== nj.partialText || cj.errorText !== nj.errorText) return true
  }
  if (current.sources.length !== next.sources.length) return true
  for (let index = 0; index < next.sources.length; index += 1) {
    const cs = current.sources[index]
    const ns = next.sources[index]
    if (cs === undefined || ns.id !== cs.id || ns.status !== cs.status
      || ns.content !== cs.content || ns.name !== cs.name || ns.selected !== cs.selected) return true
  }
  return false
}
