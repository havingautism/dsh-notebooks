import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Codemini-style notebook picker launched from the composer tool row. */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconListPenOutlineMedium as IconNote, IconSearchOutlineMedium as IconSearch, IconRightUpOutlineMedium as IconExternalLink, } from '@deepseek-ai/dsh-client-ui-primitives';
import { isNotebookAskBlocked } from "./composer-notebook.js";
import css from './composer-picker.module.css';
const PAGE_SIZE = 12;
const VIEWPORT_MARGIN = 12;
/** Render the notebook launcher button and searchable picker popover. */
export function NotebooksComposerButton({ sessionId, input, t, api, selectNotebook, openNotebook, }) {
    const anchorRef = useRef(null);
    const panelRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [error, setError] = useState('');
    const [fixedPos, setFixedPos] = useState(null);
    const locked = input.phase === 'adjudicating' || input.phase === 'submitting' || input.phase === 'claimed';
    const activeOccurrence = input.occurrences.find(item => item.source === 'notebook');
    const filtered = useMemo(() => {
        const needle = query.trim().toLocaleLowerCase();
        if (needle === '')
            return entries;
        return entries.filter(entry => [
            entry.title, entry.summary, entry.mention,
        ].join('\n').toLocaleLowerCase().includes(needle));
    }, [entries, query]);
    const visible = filtered.slice(0, visibleCount);
    const hasMore = filtered.length > visible.length;
    const loadEntries = useCallback(async () => {
        setLoading(true);
        try {
            setEntries(await api.candidates(''));
        }
        catch {
            setEntries([]);
        }
        finally {
            setLoading(false);
        }
    }, [api]);
    useEffect(() => {
        if (!open)
            return;
        void loadEntries();
    }, [open, loadEntries]);
    useLayoutEffect(() => {
        if (!open) {
            setFixedPos(null);
            return;
        }
        const place = () => {
            const anchor = anchorRef.current?.getBoundingClientRect();
            if (anchor === undefined)
                return;
            const panel = panelRef.current;
            const width = panel?.offsetWidth ?? 384;
            const height = panel?.offsetHeight ?? 320;
            let left = anchor.left;
            let top = anchor.top - height - 8;
            left = Math.min(Math.max(left, VIEWPORT_MARGIN), window.innerWidth - width - VIEWPORT_MARGIN);
            top = Math.min(Math.max(top, VIEWPORT_MARGIN), window.innerHeight - height - VIEWPORT_MARGIN);
            setFixedPos({ left, top });
        };
        place();
        window.addEventListener('scroll', place, true);
        window.addEventListener('resize', place);
        return () => {
            window.removeEventListener('scroll', place, true);
            window.removeEventListener('resize', place);
        };
    }, [open, loading, filtered.length, visible.length]);
    useEffect(() => {
        if (!open)
            return;
        const onPointerDown = (event) => {
            if (!(event.target instanceof Node))
                return;
            if (anchorRef.current?.contains(event.target))
                return;
            if (panelRef.current?.contains(event.target))
                return;
            setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);
    const pickEntry = (entry) => {
        if (isNotebookAskBlocked(entry)) {
            setError(t('picker.summaryPending'));
            return;
        }
        const ok = selectNotebook(sessionId, entry);
        if (!ok) {
            setError(t('picker.selectFailed'));
            return;
        }
        setError('');
        setOpen(false);
    };
    const panel = (_jsxs("div", { ref: panelRef, className: css.composerPicker, role: "dialog", "aria-label": t('picker.title'), style: fixedPos === null ? { visibility: 'hidden', position: 'fixed', left: 0, top: 0 } : {
            position: 'fixed',
            left: fixedPos.left,
            top: fixedPos.top,
            zIndex: 120,
        }, children: [_jsxs("div", { className: css.header, children: [_jsxs("div", { className: css.headerRow, children: [_jsx("div", { className: css.title, children: t('picker.title') }), _jsx("span", { className: css.count, children: filtered.length })] }), _jsx("p", { className: css.help, children: t('picker.help') }), _jsxs("label", { className: css.search, children: [_jsx(IconSearch, { size: 14 }), _jsx("input", { className: css.searchInput, type: "search", value: query, onChange: event => {
                                    setQuery(event.target.value);
                                    setVisibleCount(PAGE_SIZE);
                                }, placeholder: t('picker.search'), "aria-label": t('picker.search') })] })] }), _jsx("div", { className: css.list, children: loading ? (_jsx("div", { className: css.loading, children: t('picker.loading') })) : filtered.length === 0 ? (_jsx("div", { className: css.empty, children: t('picker.empty') })) : (_jsxs(_Fragment, { children: [visible.map(entry => {
                            const blocked = isNotebookAskBlocked(entry);
                            const active = activeOccurrence?.clipboardText === entry.mention
                                || activeOccurrence?.ref === entry.mention;
                            return (_jsxs("div", { className: active ? `${css.entry} ${css.entryActive}` : css.entry, children: [_jsxs("button", { type: "button", className: css.entryPick, disabled: blocked, onClick: () => { pickEntry(entry); }, children: [_jsxs("div", { className: css.entryTop, children: [_jsx("span", { className: css.entryTitle, children: entry.title }), active ? (_jsx("span", { className: css.badge, children: t('picker.active') })) : blocked ? (_jsx("span", { className: css.badge, children: t('picker.summarizing') })) : null] }), _jsx("span", { className: css.entryPreview, children: entry.summary })] }), _jsx("button", { type: "button", className: css.entryOpen, title: t('cite.open'), "aria-label": `${t('cite.open')}: ${entry.title}`, onClick: () => { openNotebook(entry.id); setOpen(false); }, children: _jsx(IconExternalLink, { size: 15 }) })] }, entry.id));
                        }), hasMore ? (_jsx("button", { type: "button", className: css.more, onClick: () => { setVisibleCount(count => count + PAGE_SIZE); }, children: t('picker.showMore', { count: String(filtered.length - visible.length) }) })) : null] })) })] }));
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: anchorRef, type: "button", className: css.toolButton, title: t('picker.title'), "aria-label": t('picker.title'), "aria-expanded": open, disabled: locked, onClick: () => {
                    if (locked)
                        return;
                    setOpen(value => !value);
                    if (!open) {
                        setQuery('');
                        setVisibleCount(PAGE_SIZE);
                        setError('');
                    }
                }, children: _jsx(IconNote, { size: 18 }) }), open && typeof document !== 'undefined' ? createPortal(panel, document.body) : null, error === '' ? null : _jsx("span", { className: css.dockError, children: error })] }));
}
//# sourceMappingURL=NotebooksComposerButton.js.map