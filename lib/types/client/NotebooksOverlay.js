import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Frame-wide overlay hosting the notebook library and workspace. */
import { Component, useSyncExternalStore } from 'react';
import { NotebooksView } from "./NotebooksView.js";
import css from './overlay.module.css';
/** Keep render failures inside the overlay instead of abdicating the shell slot. */
class NotebooksViewCrashBoundary extends Component {
    state = { error: null };
    static getDerivedStateFromError(error) { return { error }; }
    render() {
        if (this.state.error === null)
            return this.props.children;
        return _jsxs("div", { className: css.crash, role: "alert", children: [_jsx("h3", { children: this.props.t('overlay.crashTitle') }), _jsx("p", { children: this.props.t('overlay.crashHint') }), _jsx("code", { children: this.state.error.message }), _jsx("button", { type: "button", onClick: () => { this.setState({ error: null }); this.props.onReset(); }, children: this.props.t('overlay.crashBack') })] });
    }
}
/** Render the notebook workspace when the sidebar entry opens the overlay. */
export function NotebooksOverlay({ t, ...face }) {
    const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen);
    const notebookId = useSyncExternalStore(face.store.subscribe, face.store.getNotebookId);
    if (!open)
        return null;
    return (_jsx("div", { className: css.overlay, "data-notebooks-overlay": true, role: "dialog", "aria-modal": "true", "aria-label": t('view.notebooks'), children: _jsx(NotebooksViewCrashBoundary, { t: t, onReset: () => { face.store.setNotebookId(null); }, children: _jsx(NotebooksView, { t: t, ...face.api, notebookId: notebookId, onSelectNotebook: id => { face.store.setNotebookId(id); }, onClose: () => { face.store.setOpen(false); } }) }) }));
}
//# sourceMappingURL=NotebooksOverlay.js.map