/** Codemini-aligned notebook library and source workspace. */

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { NotebookArtifactKind, NotebookEntry, NotebookSource, NotebookPutRequest } from '../types.ts'
import type { NotebooksViewApi } from './view-types.ts'
import css from './views.module.css'

type Filter = 'all' | 'manual' | 'url' | 'document'
type ViewMode = 'grid' | 'list'

/** Render the notebook library, selected sources, overview, and Studio artifacts. */
export function NotebooksView(api: ConvViewProps & InjectFace<NotebooksViewApi>) {
  const [entries, setEntries] = useState<readonly NotebookEntry[]>([])
  const [selected, setSelected] = useState<NotebookEntry | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<'recent' | 'title'>('recent')
  const [composerOpen, setComposerOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (nextQuery: string) => {
    setError(null)
    try {
      const next = await api.list(nextQuery)
      setEntries(next)
      setSelected(current => current === null ? null : next.find(entry => entry.id === current.id) ?? current)
    } catch (cause) { setError(messageOf(cause)) }
  }, [api])

  useEffect(() => { void refresh('') }, [refresh])

  const visible = useMemo(() => {
    const filtered = filter === 'all' ? [...entries] : entries.filter(entry => entry.sources.some(source => source.kind === filter))
    return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt)
  }, [entries, filter, sort])

  const updateSelected = (entry: NotebookEntry) => {
    setSelected(entry)
    setEntries(current => current.map(item => item.id === entry.id ? entry : item))
  }

  if (selected !== null) return <NotebookWorkspace entry={selected} api={api} onChange={updateSelected} onBack={() => { setSelected(null) }} onDelete={async () => { await api.delete(selected.id); setSelected(null); await refresh(query) }} error={error} setError={setError} />

  return (
    <div className={css.shell} data-conversation-composer-overlay="">
      <header className={css.libraryHeader}>
        <div><p className={css.eyebrow}>NOTEBOOKS</p><h2 className={css.heading}>我的笔记</h2><p className={css.subtitle}>把链接、文档和灵感整理成可追问的资料库。</p></div>
        <button className={css.primaryButton} type="button" onClick={() => { setComposerOpen(true) }}>＋ 新建笔记</button>
      </header>
      <div className={css.toolbar}>
        <div className={css.filters} aria-label="笔记筛选">
          {([['all', '全部'], ['manual', '我的笔记'], ['url', '网页资料'], ['document', '文档']] as const).map(([id, label]) => <button key={id} className={filter === id ? css.activeChip : css.chip} type="button" onClick={() => { setFilter(id) }}>{label}</button>)}
        </div>
        <div className={css.toolbarActions}>
          <input className={css.search} value={query} onChange={event => { setQuery(event.target.value) }} onKeyDown={event => { if (event.key === 'Enter') void refresh(query) }} placeholder="搜索笔记" />
          <select className={css.select} value={sort} onChange={event => { setSort(event.target.value as 'recent' | 'title') }}><option value="recent">最近更新</option><option value="title">按标题</option></select>
          <button className={css.iconButton} type="button" aria-label="网格视图" data-active={viewMode === 'grid'} onClick={() => { setViewMode('grid') }}>▦</button>
          <button className={css.iconButton} type="button" aria-label="列表视图" data-active={viewMode === 'list'} onClick={() => { setViewMode('list') }}>☷</button>
        </div>
      </div>
      {error === null ? null : <div className={css.error} role="alert">{error}</div>}
      <section className={viewMode === 'grid' ? css.notebookGrid : css.notebookList} aria-label="笔记列表">
        {visible.map((entry, index) => <NotebookCard key={entry.id} entry={entry} index={index} list={viewMode === 'list'} onOpen={() => { setSelected(entry) }} onDelete={() => { void api.delete(entry.id).then(() => refresh(query), cause => { setError(messageOf(cause)) }) }} />)}
      </section>
      {visible.length === 0 ? <button className={css.empty} type="button" onClick={() => { setComposerOpen(true) }}>还没有匹配的笔记。创建第一条笔记。</button> : null}
      {composerOpen ? <NotebookComposer busy={busy} setBusy={setBusy} onClose={() => { setComposerOpen(false) }} onCreate={async payload => { const entry = await api.put(payload); setComposerOpen(false); await refresh(query); setSelected(entry) }} setError={setError} /> : null}
    </div>
  )
}

function NotebookCard({ entry, index, list, onOpen, onDelete }: { entry: NotebookEntry; index: number; list: boolean; onOpen: () => void; onDelete: () => void }) {
  const [emoji, title] = splitEmoji(entry.title)
  return <article className={css.notebookCard} data-list={list || undefined} style={{ '--card-tint': CARD_TONES[index % CARD_TONES.length] } as React.CSSProperties}>
    <button className={css.cardOpen} type="button" onClick={onOpen} aria-label={`打开笔记：${entry.title}`} />
    <div className={css.cardEmoji}>{emoji || sourceEmoji(entry)}</div>
    <div className={css.cardInfo}><h3>{title}</h3><p>{entry.summary || entry.content}</p><span>{entry.sources.length} 个来源 · {formatDate(entry.updatedAt)}</span></div>
    <button className={css.deleteButton} type="button" onClick={event => { event.stopPropagation(); onDelete() }} aria-label={`删除笔记：${entry.title}`}>×</button>
  </article>
}

function NotebookComposer({ busy, setBusy, onClose, onCreate, setError }: { busy: boolean; setBusy: (value: boolean) => void; onClose: () => void; onCreate: (request: NotebookPutRequest) => Promise<void>; setError: (value: string | null) => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault(); if (busy || content.trim() === '') return; setBusy(true); setError(null)
    void onCreate({ title: title.trim() || `📝 ${content.trim().slice(0, 32)}`, content, tags: parseTags(tags) }).catch(cause => { setError(messageOf(cause)) }).finally(() => { setBusy(false) })
  }
  return <div className={css.modalBackdrop} role="presentation"><form className={css.modal} onSubmit={submit}><div className={css.modalHeader}><div><p className={css.eyebrow}>NEW NOTEBOOK</p><h3>创建笔记</h3></div><button className={css.iconButton} type="button" onClick={onClose}>×</button></div><p className={css.hint}>先写一段背景，创建后可继续添加多个链接、PDF、文档或聊天回答。</p><input className={css.input} value={title} onChange={event => { setTitle(event.target.value) }} placeholder="标题（可选，可含 emoji）" /><textarea className={css.textarea} value={content} onChange={event => { setContent(event.target.value) }} placeholder="写下背景、目标或第一条资料…" /><input className={css.input} value={tags} onChange={event => { setTags(event.target.value) }} placeholder="标签，用逗号分隔" /><div className={css.modalFooter}><button className={css.secondaryButton} type="button" onClick={onClose}>取消</button><button className={css.primaryButton} type="submit" disabled={busy}>{busy ? '创建中…' : '创建笔记'}</button></div></form></div>
}

function NotebookWorkspace({ entry, api, onChange, onBack, onDelete, error, setError }: { entry: NotebookEntry; api: NotebooksViewApi; onChange: (entry: NotebookEntry) => void; onBack: () => void; onDelete: () => Promise<void>; error: string | null; setError: (value: string | null) => void }) {
  const [sourceDraft, setSourceDraft] = useState('')
  const [summary, setSummary] = useState(entry.summary)
  const [studioKind, setStudioKind] = useState<NotebookArtifactKind>('mindmap')
  const artifact = entry.artifacts.find(item => item.kind === studioKind)
  const [artifactDraft, setArtifactDraft] = useState(artifact?.content ?? '')
  useEffect(() => { setSummary(entry.summary) }, [entry.summary])
  useEffect(() => { setArtifactDraft(entry.artifacts.find(item => item.kind === studioKind)?.content ?? '') }, [entry.artifacts, studioKind])

  const action = async (operation: () => Promise<NotebookEntry>) => { setError(null); try { onChange(await operation()) } catch (cause) { setError(messageOf(cause)) } }
  const addUrls = () => { const urls = sourceDraft.split('\n').map(item => item.trim()).filter(Boolean); if (urls.length === 0) return; void (async () => { let next = entry; for (const url of urls) next = await api.addSource({ id: next.id, kind: 'url', name: hostname(url), url, content: url }); onChange(next); setSourceDraft('') })().catch(cause => { setError(messageOf(cause)) }) }
  const upload = (event: ChangeEvent<HTMLInputElement>) => { const files = [...(event.target.files ?? [])]; if (files.length === 0) return; void (async () => { let next = entry; const contents = await Promise.all(files.map(file => file.text())); for (let index = 0; index < files.length; index += 1) next = await api.addSource({ id: next.id, kind: 'document', name: files[index]?.name ?? 'Document', mimeType: files[index]?.type || 'text/plain', content: contents[index] ?? '' }); onChange(next) })().catch(cause => { setError(messageOf(cause)) }); event.target.value = '' }

  return <div className={css.workspace} data-conversation-composer-overlay=""><header className={css.workspaceHeader}><button className={css.backButton} type="button" onClick={onBack}>← 我的笔记</button><div><p className={css.eyebrow}>NOTEBOOK</p><h2>{entry.title}</h2></div><button className={css.deleteText} type="button" onClick={() => { void onDelete() }}>删除笔记</button></header>{error === null ? null : <div className={css.error} role="alert">{error}</div>}<div className={css.workspaceColumns}>
    <aside className={css.sourcesPane}><div className={css.paneHeader}><h3>来源</h3><span>{entry.sources.length}</span></div><textarea className={css.sourceInput} value={sourceDraft} onChange={event => { setSourceDraft(event.target.value) }} placeholder="网页链接，每行一个" /><div className={css.sourceActions}><button className={css.secondaryButton} type="button" onClick={addUrls}>＋ 添加链接</button><label className={css.secondaryButton}>上传文本<input hidden multiple type="file" accept=".txt,.md,text/plain,text/markdown" onChange={upload} /></label></div><div className={css.sourceList}>{entry.sources.map(source => <SourceRow key={source.id} source={source} onToggle={() => { const ids = entry.sources.filter(item => item.id === source.id ? !item.selected : item.selected).map(item => item.id); void action(() => api.selectSources(entry.id, ids)) }} onRemove={() => { void api.removeSource(entry.id, source.id).then(result => { onChange(result.entry) }, cause => { setError(messageOf(cause)) }) }} />)}</div></aside>
    <main className={css.summaryPane}><div className={css.paneHeader}><div><h3>综合总结</h3><p>基于当前选中的来源整理</p></div><button className={css.primaryButton} type="button" onClick={() => { void action(() => api.setSummary(entry.id, summary)) }}>保存总结</button></div><textarea className={css.summaryEditor} value={summary} onChange={event => { setSummary(event.target.value) }} placeholder="让模型调用 notebook_set_summary，或在这里编写综合总结。" /><div className={css.contentPreview}><h4>原始笔记</h4><p>{entry.content}</p></div></main>
    <aside className={css.studioPane}><div className={css.paneHeader}><h3>Studio</h3></div><div className={css.studioTabs}>{(['mindmap', 'report'] as const).map(kind => <button key={kind} className={studioKind === kind ? css.activeChip : css.chip} type="button" onClick={() => { setStudioKind(kind) }}>{kind === 'mindmap' ? '思维导图' : '报告'}</button>)}</div><textarea className={css.studioEditor} value={artifactDraft} onChange={event => { setArtifactDraft(event.target.value) }} placeholder={studioKind === 'mindmap' ? '输入 Mermaid mindmap 内容，或让模型生成。' : '输入 Markdown 报告，或让模型生成。'} /><button className={css.primaryButton} type="button" onClick={() => { void action(() => api.setArtifact({ id: entry.id, kind: studioKind, content: artifactDraft })) }}>保存{studioKind === 'mindmap' ? '思维导图' : '报告'}</button>{artifact === undefined ? <p className={css.hint}>基于选中来源生成内容。</p> : <div className={css.artifactPreview}><pre>{artifact.content}</pre></div>}</aside>
  </div></div>
}

function SourceRow({ source, onToggle, onRemove }: { source: NotebookSource; onToggle: () => void; onRemove: () => void }) { return <article className={css.sourceRow} data-selected={source.selected || undefined}><input type="checkbox" checked={source.selected} onChange={onToggle} aria-label={`选择来源：${source.name}`} /><div><strong>{source.name}</strong><span>{source.kind === 'url' ? hostname(source.url ?? '') : source.kind}</span></div><button type="button" onClick={onRemove} aria-label={`移除来源：${source.name}`}>×</button></article> }

const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a']
function splitEmoji(value: string): [string, string] { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value] }
function sourceEmoji(entry: NotebookEntry): string { return entry.sources.some(source => source.kind === 'url') ? '🌐' : entry.sources.some(source => source.kind === 'document') ? '📄' : '📝' }
function formatDate(value: number): string { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value) }
function parseTags(value: string): string[] { return value.split(',').map(tag => tag.trim()).filter(Boolean) }
function hostname(value: string): string { try { return new URL(value).hostname } catch { return value || '网页资料' } }
function messageOf(value: unknown): string { return value instanceof Error ? value.message : String(value) }
