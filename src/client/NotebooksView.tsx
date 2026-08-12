/** Cross-session notebook panel. */

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { NotebookEntry } from '../types.ts'
import type { NotebooksViewApi } from './view-types.ts'
import css from './views.module.css'

/** Render the notebook library and its lightweight editor. */
export function NotebooksView({ list, put, delete: remove }: ConvViewProps & InjectFace<NotebooksViewApi>) {
  const [entries, setEntries] = useState<readonly NotebookEntry[]>([])
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (nextQuery: string) => {
    setError(null)
    try {
      setEntries(await list(nextQuery))
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [list])

  useEffect(() => { void refresh('') }, [refresh])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (busy || title.trim() === '' || content.trim() === '') return
    setBusy(true)
    setError(null)
    void put({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    }).then(
      () => {
        setTitle('')
        setContent('')
        setTags('')
        setBusy(false)
        void refresh(query)
      },
      (cause: unknown) => {
        setError(messageOf(cause))
        setBusy(false)
      },
    )
  }

  return (
    <div className={css.shell} data-conversation-composer-overlay="">
      <header className={css.hero}>
        <div>
          <p className={css.eyebrow}>NOTEBOOKS</p>
          <h2 className={css.heading}>随手记</h2>
          <p className={css.subtitle}>跨会话保存灵感、结论和研究线索。</p>
        </div>
        <div className={css.searchGroup}>
          <input className={css.input} value={query} onChange={(event) => { setQuery(event.target.value) }} placeholder="搜索标题、正文或标签" />
          <button className={css.secondaryButton} type="button" onClick={() => { void refresh(query) }}>搜索</button>
        </div>
      </header>

      <div className={css.columns}>
        <form className={css.editor} onSubmit={submit}>
          <div className={css.sectionTitle}>新建笔记</div>
          <input className={css.input} value={title} onChange={(event) => { setTitle(event.target.value) }} placeholder="标题" />
          <textarea className={css.textarea} value={content} onChange={(event) => { setContent(event.target.value) }} placeholder="随手写下需要长期保留的内容…" />
          <input className={css.input} value={tags} onChange={(event) => { setTags(event.target.value) }} placeholder="标签，用逗号分隔" />
          <button className={css.primaryButton} type="submit" disabled={busy}>{busy ? '保存中…' : '保存笔记'}</button>
          {error === null ? null : <div className={css.error} role="alert">{error}</div>}
        </form>

        <section className={css.library} aria-label="笔记列表">
          <div className={css.sectionTitle}>全部笔记 <span className={css.count}>{entries.length}</span></div>
          {entries.length === 0 ? <div className={css.empty}>还没有笔记。你也可以让模型调用 notebook_write 保存。</div> : null}
          <div className={css.cardGrid}>
            {entries.map(entry => (
              <article className={css.card} key={entry.id}>
                <div className={css.cardHeader}>
                  <h3 className={css.cardTitle}>{entry.title}</h3>
                  <button className={css.linkButton} type="button" onClick={() => {
                    void remove(entry.id).then(
                      () => refresh(query),
                      (cause: unknown) => { setError(messageOf(cause)) },
                    )
                  }}>删除</button>
                </div>
                <p className={css.cardBody}>{entry.content}</p>
                <div className={css.tags}>{entry.tags.map(tag => <span className={css.tag} key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function messageOf(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}
