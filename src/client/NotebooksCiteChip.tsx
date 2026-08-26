/** Clickable notebook badge under a citing user message bubble. */

import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import {
  IconListPenOutline16 as IconNote, IconRightUpOutline14 as IconExternalLink,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { NotebooksKey } from './locales.ts'
import type { NotebooksClientFace } from './client-face.ts'
import type { NotebookCiteData } from './notebook-cite-definition.ts'
import css from './notebook-cite.module.css'

type NotebooksCiteChipProps =
  PropsRuntime<'conversation.chat.node', 'notebook-cite'>
  & PropsLocale<'notebooks'>
  & NotebooksClientFace

/** Render one notebook cite chip that opens the overlay workspace. */
export function NotebooksCiteChip({ node, t, store }: NotebooksCiteChipProps) {
  const data: NotebookCiteData = node.data
  return (
    <div className={css.row} data-notebooks-cite={data.notebookId}>
      <button
        type="button"
        className={css.chip}
        title={t('cite.open' as NotebooksKey)}
        aria-label={`${t('cite.open' as NotebooksKey)}: ${data.title}`}
        onClick={() => { store.setNotebookId(data.notebookId) }}
      >
        <IconNote size={14} />
        <span className={css.label}>{data.title}</span>
        <IconExternalLink size={12} className={css.external} />
      </button>
    </div>
  )
}
