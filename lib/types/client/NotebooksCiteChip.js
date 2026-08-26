import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconListPenOutline16 as IconNote, IconRightUpOutline14 as IconExternalLink, } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './notebook-cite.module.css';
/** Render one notebook cite chip that opens the overlay workspace. */
export function NotebooksCiteChip({ node, t, store }) {
    const data = node.data;
    return (_jsx("div", { className: css.row, "data-notebooks-cite": data.notebookId, children: _jsxs("button", { type: "button", className: css.chip, title: t('cite.open'), "aria-label": `${t('cite.open')}: ${data.title}`, onClick: () => { store.setNotebookId(data.notebookId); }, children: [_jsx(IconNote, { size: 14 }), _jsx("span", { className: css.label, children: data.title }), _jsx(IconExternalLink, { size: 12, className: css.external })] }) }));
}
//# sourceMappingURL=NotebooksCiteChip.js.map