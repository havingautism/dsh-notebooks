import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Sidebar foot control that opens the global notebook workspace. */
import { useSyncExternalStore } from 'react';
import { IconListPenOutline16 as IconNote } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './sidebar-entry.module.css';
/** Render the sidebar launch button for the frame-wide notebook overlay. */
export function NotebooksSidebarEntry({ wide, t, ...face }) {
    const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen);
    return (_jsx("div", { className: wide ? css.layer : `${css.layer} ${css.rail}`, children: _jsxs("button", { type: "button", className: css.badge, "data-active": open || undefined, "aria-pressed": open, "aria-label": t('view.notebooks'), onClick: () => { face.store.setOpen(!open); }, children: [_jsx(IconNote, { size: 16 }), wide ? _jsx("span", { className: css.badgeLabel, children: t('view.notebooks') }) : null] }) }));
}
//# sourceMappingURL=NotebooksSidebarEntry.js.map