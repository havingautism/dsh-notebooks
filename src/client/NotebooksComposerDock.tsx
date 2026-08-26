/** Selected notebook chip above the composer card. */

import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import {
  IconCloseOutline16 as IconX, IconListPenOutline16 as IconNote,
  IconRightUpOutline14 as IconExternalLink,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { parseNotebookMentions } from '../mention.ts'
import type { NotebooksComposerFace } from './client-face.ts'
import type { NotebooksKey } from './locales.ts'
import css from './composer-picker.module.css'

type NotebooksComposerDockProps =
  PropsRuntime<'conversation.input.dock'>
  & PropsLocale<'notebooks'>
  & NotebooksComposerFace
  & { readonly sessionId: SessionId }

/** Show the active notebook cite chip when the composer holds one occurrence. */
export function NotebooksComposerDock({
  sessionId, input, t, clearNotebook, openNotebook,
}: NotebooksComposerDockProps) {
  const occurrence = input.occurrences.find(item => item.source === 'notebook')
  if (occurrence === undefined) return null
  const notebookId = parseNotebookMentions(occurrence.clipboardText).ids[0]
  return (
    <span className={css.dockChip}>
      <button
        type="button"
        className={css.dockOpen}
        title={t('cite.open' as NotebooksKey)}
        aria-label={`${t('cite.open' as NotebooksKey)}: ${occurrence.label}`}
        onClick={() => {
          if (notebookId !== undefined) openNotebook(notebookId)
        }}
      >
        <IconNote size={14} />
        <span className={css.dockLabel}>{occurrence.label}</span>
        <IconExternalLink size={11} />
      </button>
      <button
        type="button"
        className={css.dockRemove}
        title={t('picker.remove' as NotebooksKey)}
        aria-label={t('picker.remove' as NotebooksKey)}
        onClick={() => { clearNotebook(sessionId) }}
      >
        <IconX size={11} />
      </button>
    </span>
  )
}
