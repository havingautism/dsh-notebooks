/** Sidebar foot control that opens the global notebook workspace. */

import { useSyncExternalStore } from 'react'
import { IconListPenOutlineMedium as IconNote } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { NotebooksKey } from './locales.ts'
import type { NotebooksClientFace } from './client-face.ts'
import css from './sidebar-entry.module.css'

type NotebooksSidebarEntryProps =
  PropsRuntime<'sidebar.footer.action'>
  & InjectFace<NotebooksClientFace>
  & PropsLocale<'notebooks'>

/** Render the sidebar launch button for the frame-wide notebook overlay. */
export function NotebooksSidebarEntry({ wide, t, ...face }: NotebooksSidebarEntryProps) {
  const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen)
  return (
    <div className={wide ? css.layer : `${css.layer} ${css.rail}`}>
      <button
        type="button"
        className={css.badge}
        data-active={open || undefined}
        aria-pressed={open}
        aria-label={t('view.notebooks' as NotebooksKey)}
        onClick={() => { face.store.setOpen(!open) }}
      >
        <IconNote size={16} />
        {wide ? <span className={css.badgeLabel}>{t('view.notebooks' as NotebooksKey)}</span> : null}
      </button>
    </div>
  )
}
