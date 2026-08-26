/** Frame-wide overlay hosting the notebook library and workspace. */

import { Component, useSyncExternalStore, type ReactNode } from 'react'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { NotebooksView } from './NotebooksView.tsx'
import type { NotebooksKey } from './locales.ts'
import type { NotebooksClientFace } from './client-face.ts'
import css from './overlay.module.css'

type NotebooksOverlayProps = InjectFace<NotebooksClientFace> & PropsLocale<'notebooks'>

type OverlayCrashProps = { t: NotebooksOverlayProps['t']; onReset: () => void; children: ReactNode }

/** Keep render failures inside the overlay instead of abdicating the shell slot. */
class NotebooksViewCrashBoundary extends Component<OverlayCrashProps, { error: Error | null }> {
  override state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) { return { error } }

  override render() {
    if (this.state.error === null) return this.props.children
    return <div className={css.crash} role="alert">
      <h3>{this.props.t('overlay.crashTitle' as NotebooksKey)}</h3>
      <p>{this.props.t('overlay.crashHint' as NotebooksKey)}</p>
      <code>{this.state.error.message}</code>
      <button type="button" onClick={() => { this.setState({ error: null }); this.props.onReset() }}>{this.props.t('overlay.crashBack' as NotebooksKey)}</button>
    </div>
  }
}

/** Render the notebook workspace when the sidebar entry opens the overlay. */
export function NotebooksOverlay({ t, ...face }: NotebooksOverlayProps) {
  const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen)
  const notebookId = useSyncExternalStore(face.store.subscribe, face.store.getNotebookId)
  if (!open) return null
  return (
    <div className={css.overlay} data-notebooks-overlay role="dialog" aria-modal="true" aria-label={t('view.notebooks' as NotebooksKey)}>
      <NotebooksViewCrashBoundary t={t} onReset={() => { face.store.setNotebookId(null) }}>
        <NotebooksView
          t={t}
          {...face.api}
          notebookId={notebookId}
          onSelectNotebook={id => { face.store.setNotebookId(id) }}
          onClose={() => { face.store.setOpen(false) }}
        />
      </NotebooksViewCrashBoundary>
    </div>
  )
}
