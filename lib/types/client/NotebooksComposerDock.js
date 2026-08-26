import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconCloseOutline16 as IconX, IconListPenOutline16 as IconNote, IconRightUpOutline14 as IconExternalLink, } from '@deepseek-ai/dsh-client-ui-primitives';
import { parseNotebookMentions } from "../mention.js";
import css from './composer-picker.module.css';
/** Show the active notebook cite chip when the composer holds one occurrence. */
export function NotebooksComposerDock({ sessionId, input, t, clearNotebook, openNotebook, }) {
    const occurrence = input.occurrences.find(item => item.source === 'notebook');
    if (occurrence === undefined)
        return null;
    const notebookId = parseNotebookMentions(occurrence.clipboardText).ids[0];
    return (_jsxs("span", { className: css.dockChip, children: [_jsxs("button", { type: "button", className: css.dockOpen, title: t('cite.open'), "aria-label": `${t('cite.open')}: ${occurrence.label}`, onClick: () => {
                    if (notebookId !== undefined)
                        openNotebook(notebookId);
                }, children: [_jsx(IconNote, { size: 14 }), _jsx("span", { className: css.dockLabel, children: occurrence.label }), _jsx(IconExternalLink, { size: 11 })] }), _jsx("button", { type: "button", className: css.dockRemove, title: t('picker.remove'), "aria-label": t('picker.remove'), onClick: () => { clearNotebook(sessionId); }, children: _jsx(IconX, { size: 11 }) })] }));
}
//# sourceMappingURL=NotebooksComposerDock.js.map