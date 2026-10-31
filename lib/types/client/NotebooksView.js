import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Codemini-aligned notebook library, sources, overview, and Studio workspace. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconChevronLeftOutlineMedium as IconArrowLeft, IconCloseOutlineMedium as IconX, IconDataOutlineMedium as IconLayoutGrid, IconListPenOutlineMedium as IconNote, IconLoadingOutlineMedium as IconLoading, IconPlusOutlineMedium as IconPlus, IconRightUpOutlineMedium as IconExternalLink, MarkdownText, } from '@deepseek-ai/dsh-client-ui-primitives';
import { NotebookId } from "../types.js";
import { parseMindmapTree } from "../studio-mermaid.js";
import { hydrateNotebook } from "./hydrate.js";
import { MermaidMindmap } from "./MermaidMindmap.js";
import css from './views.module.css';
function markdownLabels(t) {
    return {
        code: {
            copyLabel: t('markdown.copy'),
            copiedLabel: t('markdown.copied'),
            toolbarLabels: {
                codeLabel: t('markdown.code'),
                wrapLabel: t('markdown.wrap'),
                unwrapLabel: t('markdown.unwrap'),
            },
        },
        footnotes: t('markdown.footnotes'),
    };
}
/** Render the notebook library, source workspace, overview, and Studio artifacts. */
export function NotebooksView({ t, notebookId, onSelectNotebook, onClose, ...api }) {
    const [entries, setEntries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('recent');
    const [composerOpen, setComposerOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [notebookLoading, setNotebookLoading] = useState(false);
    const openNotebook = useCallback((entry) => {
        setSelected(entry === null ? null : hydrateNotebook(entry));
        onSelectNotebook?.(entry?.id ?? null);
    }, [onSelectNotebook]);
    const apiRef = useRef(api);
    apiRef.current = api;
    const refresh = useCallback(async (nextQuery) => {
        setError(null);
        try {
            const next = (await apiRef.current.list(nextQuery)).map(hydrateNotebook);
            setEntries(next);
            setSelected(current => {
                if (current === null)
                    return null;
                const listed = next.find(item => item.id === current.id);
                return listed !== undefined && listed.updatedAt > current.updatedAt ? listed : current;
            });
        }
        catch (cause) {
            setError(messageOf(cause));
        }
    }, []);
    useEffect(() => {
        if (selected !== null)
            return;
        const timer = window.setTimeout(() => { void refresh(query); }, query === '' ? 0 : 250);
        return () => { window.clearTimeout(timer); };
    }, [query, refresh, selected]);
    useEffect(() => {
        if (notebookId === undefined)
            return;
        if (notebookId === null) {
            setSelected(null);
            setNotebookLoading(false);
            return;
        }
        const listed = entries.find(item => item.id === notebookId);
        if (listed !== undefined) {
            setSelected(current => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateNotebook(listed));
            setNotebookLoading(false);
            return;
        }
        let active = true;
        setNotebookLoading(true);
        void apiRef.current.get(NotebookId(notebookId)).then(entry => {
            if (!active)
                return;
            if (entry === null) {
                setSelected(null);
                setError(t('empty.noMatch'));
            }
            else {
                setSelected(hydrateNotebook(entry));
            }
            setNotebookLoading(false);
        }, (cause) => {
            if (active) {
                setError(messageOf(cause));
                setNotebookLoading(false);
            }
        });
        return () => { active = false; };
    }, [notebookId, entries, t]);
    const requestDelete = useCallback((target) => { setError(null); setPendingDelete(target); }, []);
    const confirmDelete = useCallback(async () => {
        if (pendingDelete === null || deleteBusy)
            return;
        setDeleteBusy(true);
        setError(null);
        try {
            await api.delete(pendingDelete.id);
            if (selected?.id === pendingDelete.id)
                openNotebook(null);
            setPendingDelete(null);
            await refresh(query);
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setDeleteBusy(false);
        }
    }, [api, deleteBusy, openNotebook, pendingDelete, query, refresh, selected?.id]);
    const visible = useMemo(() => {
        const filtered = filter === 'all'
            ? [...entries]
            : entries.filter(entry => entry.sourceType === filter || entry.sources.some(source => source.kind === filter));
        return sort === 'title'
            ? filtered.toSorted((left, right) => left.title.localeCompare(right.title))
            : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
    }, [entries, filter, sort]);
    const updateSelected = useCallback((entry) => {
        const next = hydrateNotebook(entry);
        setSelected(current => current?.id === next.id && !notebookEntryChanged(current, next) ? current : next);
        setEntries(current => current.map(item => item.id === next.id ? next : item));
    }, []);
    useEffect(() => {
        const unsubscribe = api.subscribeProgress?.(latest => { updateSelected(hydrateNotebook(latest)); });
        return () => { unsubscribe?.(); };
    }, [api, updateSelected]);
    if (notebookId !== undefined && notebookId !== null && selected === null && notebookLoading) {
        return _jsx("div", { className: css.shell, children: _jsx("div", { className: css.content, children: _jsxs("div", { className: css.notebookLoading, role: "status", children: [_jsx(IconLoading, { className: css.spinner, size: 16 }), _jsx("span", { children: t('workspace.loading') })] }) }) });
    }
    if (selected !== null)
        return _jsxs("div", { className: css.shell, children: [_jsx(NotebookWorkspace, { entry: selected, api: api, t: t, onChange: updateSelected, onBack: () => { openNotebook(null); }, onDelete: () => { requestDelete({ id: selected.id, title: selected.title }); }, error: error, setError: setError }), pendingDelete === null ? null : _jsx(DeleteConfirmDialog, { pending: pendingDelete, busy: deleteBusy, t: t, onCancel: () => { if (!deleteBusy)
                        setPendingDelete(null); }, onConfirm: () => { void confirmDelete(); } })] });
    const filters = [['all', 'filter.all'], ['manual', 'filter.manual'], ['url', 'filter.url'], ['document', 'filter.document']];
    return _jsxs("div", { className: css.shell, children: [_jsxs("div", { className: css.content, children: [_jsx("span", { "data-notebooks-view": "", hidden: true }), onClose === undefined ? null : (_jsx("div", { className: css.libraryTopBar, children: _jsxs("button", { className: css.backButton, type: "button", "aria-label": t('library.backAria'), onClick: onClose, children: [_jsx(IconArrowLeft, { size: 15 }), t('library.back')] }) })), _jsxs("div", { className: css.toolbar, children: [_jsx("div", { className: css.filters, "aria-label": t('library.filterAria'), children: filters.map(([id, key]) => _jsx("button", { className: filter === id ? css.activeChip : css.chip, type: "button", "aria-current": filter === id ? 'page' : undefined, onClick: () => { setFilter(id); }, children: t(key) }, id)) }), _jsxs("div", { className: css.toolbarActions, children: [_jsx("input", { className: css.search, value: query, onChange: event => { setQuery(event.target.value); }, placeholder: t('toolbar.search'), "aria-label": t('toolbar.searchAria') }), _jsxs("select", { className: css.select, value: sort, onChange: event => { setSort(event.target.value); }, "aria-label": t('toolbar.sortAria'), children: [_jsx("option", { value: "recent", children: t('toolbar.sortRecent') }), _jsx("option", { value: "title", children: t('toolbar.sortTitle') })] }), _jsxs("div", { className: css.viewToggle, children: [_jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.gridView'), "aria-pressed": viewMode === 'grid', "data-active": viewMode === 'grid', onClick: () => { setViewMode('grid'); }, children: _jsx(IconLayoutGrid, { size: 16 }) }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.listView'), "aria-pressed": viewMode === 'list', "data-active": viewMode === 'list', onClick: () => { setViewMode('list'); }, children: _jsx(IconNote, { size: 16 }) })] }), _jsxs("button", { className: css.primaryButton, type: "button", onClick: () => { setError(null); setComposerOpen(true); }, children: [_jsx(IconPlus, { size: 15 }), t('action.new')] })] })] }), _jsxs("section", { className: css.library, children: [_jsx("header", { className: css.libraryTitle, children: _jsxs("div", { children: [_jsx("h2", { children: t('library.title') }), _jsx("p", { children: t('library.itemCount', { count: visible.length }) })] }) }), error === null || composerOpen ? null : _jsx("div", { className: css.error, role: "alert", children: error }), visible.length === 0
                                ? _jsxs("div", { className: css.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: _jsx(IconNote, { size: 22 }) }), _jsx("strong", { children: query === '' ? t('empty.none') : t('empty.noMatch') }), _jsx("p", { children: query === '' ? t('empty.hintStart') : t('empty.hintNoMatch') }), query === '' ? _jsxs("button", { className: css.primaryButton, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx(IconPlus, { size: 15 }), t('action.new')] }) : null] })
                                : _jsxs("div", { className: viewMode === 'grid' ? css.notebookGrid : css.notebookList, "aria-label": t('library.title'), children: [viewMode === 'grid' ? _jsxs("button", { className: css.createCard, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx("span", { children: _jsx(IconPlus, { size: 22 }) }), _jsx("strong", { children: t('action.new') })] }) : null, visible.map((entry, index) => _jsx(NotebookCard, { entry: entry, index: index, list: viewMode === 'list', t: t, onOpen: () => { openNotebook(entry); }, onDelete: () => { requestDelete({ id: entry.id, title: entry.title }); } }, entry.id))] })] })] }), composerOpen ? _jsx(NotebookComposer, { busy: busy, error: error, setBusy: setBusy, t: t, onClose: () => { if (!busy)
                    setComposerOpen(false); }, onCreate: async (request) => { const entry = await api.create(request); setComposerOpen(false); await refresh(query); openNotebook(entry); }, setError: setError }) : null, pendingDelete === null ? null : _jsx(DeleteConfirmDialog, { pending: pendingDelete, busy: deleteBusy, t: t, onCancel: () => { if (!deleteBusy)
                    setPendingDelete(null); }, onConfirm: () => { void confirmDelete(); } })] });
}
function NotebookCard({ entry, index, list, t, onOpen, onDelete }) {
    const [emoji, title] = splitEmoji(entry.title);
    const job = entry.latestJob;
    const jobFailed = job !== null && job.status === 'failed' && job.kind === 'summary';
    const busy = !jobFailed && job !== null && (job.status === 'pending' || job.status === 'running');
    const fetching = busy && job.kind === 'summary' && job.stage === 'fetch';
    const summarizing = busy && job.kind === 'summary' && job.stage === 'generate';
    const statusLine = jobFailed
        ? t('overview.failed', { error: job.errorText || t('overview.empty') })
        : fetching
            ? t('overview.fetching', { detail: job.partialText })
            : summarizing
                ? t('overview.summarizing')
                : t('card.sources', { count: entry.sources.length, date: formatDate(entry.updatedAt) });
    return _jsxs("article", { className: css.notebookCard, "data-list": list || undefined, "data-busy": busy || undefined, "data-failed": jobFailed || undefined, style: { '--card-tint': CARD_TONES[index % CARD_TONES.length] }, children: [_jsx("button", { className: css.cardOpen, type: "button", onClick: onOpen, "aria-label": t('card.openAria', { title: entry.title }) }), _jsx("div", { className: css.cardEmoji, children: emoji || sourceEmoji(entry) }), _jsxs("div", { className: css.cardInfo, children: [_jsx("h3", { children: title }), _jsx("p", { children: jobFailed ? (job.errorText || t('overview.empty')) : busy ? (fetching ? t('card.fetching') : t('card.summarizing')) : (entry.summary || entry.content) }), _jsx("span", { children: jobFailed
                            ? statusLine
                            : busy
                                ? _jsxs(_Fragment, { children: [_jsx(IconLoading, { className: css.spinner, size: 11 }), statusLine] })
                                : statusLine })] }), _jsx("button", { className: css.deleteButton, type: "button", "aria-label": t('workspace.delete'), onClick: event => { event.stopPropagation(); onDelete(); }, children: _jsx(IconX, { size: 15 }) })] });
}
function NotebookComposer({ busy, error, setBusy, t, onClose, onCreate, setError }) {
    const [title, setTitle] = useState('');
    const [urls, setUrls] = useState('');
    const [content, setContent] = useState('');
    const [documents, setDocuments] = useState([]);
    const empty = title.trim() === '' && urls.trim() === '' && content.trim() === '' && documents.length === 0;
    const submit = (event) => {
        event.preventDefault();
        if (busy || empty)
            return;
        setBusy(true);
        setError(null);
        const parsedUrls = urls.split('\n').map(item => item.trim()).filter(Boolean);
        void onCreate({
            ...(title.trim() === '' ? {} : { title: title.trim() }),
            ...(content.trim() === '' ? {} : { content: content.trim() }),
            ...(parsedUrls.length === 0 ? {} : { urls: parsedUrls }),
            ...(documents.length === 0 ? {} : { documents }),
        }).catch((cause) => { setError(messageOf(cause)); }).finally(() => { setBusy(false); });
    };
    const pickFiles = (event) => {
        const files = [...(event.target.files ?? [])];
        if (files.length === 0)
            return;
        void Promise.all(files.map(async (file) => ({ name: file.name, mimeType: file.type || 'text/plain', content: await file.text() }))).then(next => {
            setDocuments(current => [...current, ...next]);
        }, cause => { setError(messageOf(cause)); });
        event.target.value = '';
    };
    return _jsx("div", { className: css.modalBackdrop, role: "presentation", children: _jsxs("form", { className: css.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "new-notebook-title", onSubmit: submit, children: [_jsxs("div", { className: css.modalHeader, children: [_jsxs("div", { className: css.modalHeading, children: [_jsx("span", { "aria-hidden": "true", children: _jsx(IconNote, { size: 18 }) }), _jsxs("div", { children: [_jsx("h3", { id: "new-notebook-title", children: t('composer.title') }), _jsx("p", { children: t('composer.subtitle') })] })] }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('composer.closeAria'), disabled: busy, onClick: onClose, children: _jsx(IconX, { size: 16 }) })] }), _jsxs("div", { className: css.modalBody, children: [_jsxs("label", { children: [t('composer.titleLabel'), _jsx("input", { className: css.input, value: title, onChange: event => { setTitle(event.target.value); }, placeholder: t('composer.titlePlaceholder') })] }), _jsxs("label", { children: [t('composer.urls'), _jsx("textarea", { className: css.textarea, value: urls, onChange: event => { setUrls(event.target.value); }, placeholder: t('composer.urlsPlaceholder') })] }), _jsxs("label", { children: [t('composer.documents'), _jsx("span", { className: css.fileRow, children: _jsxs("label", { className: css.secondaryButton, children: [t('composer.chooseDocuments'), _jsx("input", { hidden: true, multiple: true, type: "file", accept: ".txt,.md,text/plain,text/markdown", onChange: pickFiles })] }) }), documents.length === 0 ? null : _jsx("ul", { className: css.fileChips, children: documents.map((document, index) => _jsxs("li", { children: [document.name, _jsx("button", { type: "button", "aria-label": document.name, onClick: () => { setDocuments(current => current.filter((_, item) => item !== index)); }, children: _jsx(IconX, { size: 12 }) })] }, `${document.name}-${index}`)) })] }), _jsxs("label", { children: [t('composer.content'), _jsx("textarea", { autoFocus: true, className: css.textarea, value: content, onChange: event => { setContent(event.target.value); }, placeholder: t('composer.contentPlaceholder') })] }), error === null ? null : _jsx("div", { className: css.modalError, role: "alert", children: error })] }), _jsxs("div", { className: css.modalFooter, children: [_jsx("span", { children: t('composer.footer') }), _jsxs("div", { children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: onClose, children: t('action.cancel') }), _jsxs("button", { className: css.primaryButton, type: "submit", disabled: busy || empty, children: [busy ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : _jsx(IconPlus, { size: 14 }), busy ? t('action.creating') : t('action.create')] })] })] })] }) });
}
function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }) {
    const [, title] = splitEmoji(pending.title);
    const name = title || pending.title;
    return _jsx("div", { className: css.confirmBackdrop, role: "presentation", onClick: () => { if (!busy)
            onCancel(); }, children: _jsxs("div", { className: css.confirmCard, role: "dialog", "aria-modal": "true", "aria-labelledby": "delete-notebook-title", onClick: event => { event.stopPropagation(); }, children: [_jsx("span", { className: css.confirmMark, "aria-hidden": "true" }), _jsx("h3", { id: "delete-notebook-title", children: t('delete.title') }), _jsx("p", { children: t('delete.body', { title: name }) }), _jsxs("div", { className: css.confirmActions, children: [_jsx("button", { className: css.confirmCancel, type: "button", disabled: busy, onClick: onCancel, children: t('action.cancel') }), _jsxs("button", { className: css.confirmDelete, type: "button", disabled: busy, onClick: onConfirm, children: [busy ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : null, t('delete.confirm')] })] })] }) });
}
function NotebookWorkspace({ entry, api, t, onChange, onBack, onDelete, error, setError }) {
    const labels = useMemo(() => markdownLabels(t), [t]);
    const [sourceDraft, setSourceDraft] = useState('');
    const [studioKind, setStudioKind] = useState('mindmap');
    const [viewingSourceId, setViewingSourceId] = useState(null);
    const [mobilePane, setMobilePane] = useState('summary');
    const [expandMindmap, setExpandMindmap] = useState(false);
    const [busy, setBusy] = useState(false);
    const run = useCallback(async (operation) => {
        setBusy(true);
        setError(null);
        try {
            onChange(await operation());
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setBusy(false);
        }
    }, [onChange, setError]);
    const addUrls = () => {
        const urls = sourceDraft.split('\n').map(item => item.trim()).filter(Boolean);
        if (urls.length === 0 || busy)
            return;
        void (async () => {
            let next = entry;
            for (const url of urls)
                next = await api.addSource({ id: next.id, kind: 'url', name: hostname(url), url });
            onChange(next);
            setSourceDraft('');
        })().catch(cause => { setError(messageOf(cause)); });
    };
    const upload = (event) => {
        const files = [...(event.target.files ?? [])];
        if (files.length === 0)
            return;
        void (async () => {
            let next = entry;
            const contents = await Promise.all(files.map(file => file.text()));
            for (let index = 0; index < files.length; index += 1) {
                next = await api.addSource({ id: next.id, kind: 'document', name: files[index]?.name ?? 'Document', mimeType: files[index]?.type || 'text/plain', content: contents[index] ?? '' });
            }
            onChange(next);
        })().catch(cause => { setError(messageOf(cause)); });
        event.target.value = '';
    };
    const job = entry.latestJob;
    const jobFailed = job !== null && job.status === 'failed' && job.kind === 'summary';
    const summarizing = !jobFailed && job !== null && job.kind === 'summary' && (job.status === 'pending' || job.status === 'running');
    const fetching = summarizing && job.stage === 'fetch';
    const generatingStudio = job !== null && job.kind === studioKind && (job.status === 'pending' || job.status === 'running');
    const studioFailed = job !== null && job.status === 'failed' && job.kind === studioKind;
    const artifact = entry.artifacts.find(item => item.kind === studioKind);
    const summaryDraft = summarizing && !fetching ? job.partialText : '';
    const summaryText = summaryDraft.trim() !== '' ? summaryDraft : entry.summary;
    const studioText = generatingStudio && job.partialText.trim() !== '' ? job.partialText : artifact?.content ?? '';
    const mindmapReady = studioKind === 'mindmap' && parseMindmapTree(studioText) !== null;
    const viewing = entry.sources.find(source => source.id === viewingSourceId) ?? null;
    const jobLive = summarizing || generatingStudio;
    useEffect(() => {
        if (!jobLive)
            return;
        const timer = window.setInterval(() => {
            void api.get(entry.id).then(next => { if (next !== null)
                onChange(next); }).catch(() => undefined);
        }, 2000);
        return () => { window.clearInterval(timer); };
    }, [api, entry.id, onChange, jobLive]);
    return _jsxs("div", { className: css.workspace, children: [_jsxs("header", { className: css.workspaceHeader, children: [_jsxs("button", { className: css.backButton, type: "button", onClick: onBack, children: [_jsx(IconArrowLeft, { size: 15 }), t('workspace.back')] }), _jsxs("div", { className: css.workspaceHeading, children: [_jsx("p", { className: css.eyebrow, children: t('workspace.notebook') }), _jsx("h2", { children: entry.title })] }), _jsx("button", { className: css.deleteText, type: "button", onClick: onDelete, children: t('workspace.delete') })] }), error === null ? null : _jsx("div", { className: css.error, role: "alert", children: error }), _jsx("div", { className: css.mobilePanes, role: "tablist", "aria-label": t('library.title'), children: [['sources', 'pane.sources'], ['summary', 'pane.summary'], ['studio', 'pane.studio']].map(([id, key]) => (_jsx("button", { className: mobilePane === id ? css.activeChip : css.chip, type: "button", role: "tab", "aria-selected": mobilePane === id, onClick: () => { setMobilePane(id); }, children: t(key) }, id))) }), _jsxs("div", { className: css.workspaceColumns, "data-pane": mobilePane, children: [_jsxs("aside", { className: css.sourcesPane, "data-mobile": mobilePane === 'sources' || undefined, children: [_jsxs("div", { className: css.paneHeader, children: [_jsx("h3", { children: t('sources.title') }), _jsx("span", { children: entry.sources.length })] }), _jsx("textarea", { className: css.sourceInput, value: sourceDraft, onChange: event => { setSourceDraft(event.target.value); }, placeholder: t('sources.urlPlaceholder') }), _jsxs("div", { className: css.sourceActions, children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: addUrls, children: t('sources.add') }), _jsxs("label", { className: css.secondaryButton, children: [t('sources.upload'), _jsx("input", { hidden: true, multiple: true, type: "file", accept: ".txt,.md,text/plain,text/markdown", onChange: upload })] })] }), _jsx("div", { className: css.sourceList, children: entry.sources.map(source => (_jsx(SourceRow, { source: source, job: entry.latestJob, t: t, active: source.id === viewingSourceId, onOpen: () => { setViewingSourceId(source.id); setMobilePane('summary'); }, onToggle: () => {
                                        const ids = entry.sources.filter(item => item.id === source.id ? !item.selected : item.selected).map(item => item.id);
                                        void run(() => api.selectSources(entry.id, ids));
                                    }, onRemove: () => { void api.removeSource(entry.id, source.id).then(result => { onChange(result.entry); if (viewingSourceId === source.id)
                                        setViewingSourceId(null); }, cause => { setError(messageOf(cause)); }); } }, source.id))) })] }), _jsx("main", { className: css.summaryPane, "data-mobile": mobilePane === 'summary' || undefined, children: viewing === null ? _jsxs(_Fragment, { children: [_jsxs("div", { className: css.paneHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('overview.title') }), _jsx("p", { children: t('overview.hint') })] }), _jsx("button", { className: css.iconButton, type: "button", disabled: busy || summarizing, "aria-label": t('overview.resummarize'), title: t('overview.resummarize'), onClick: () => { void run(() => api.summarize(entry.id)); }, children: _jsx(IconLoading, { className: summarizing ? css.spinner : undefined, size: 15 }) })] }), summarizing ? _jsxs("div", { className: css.progress, role: "status", children: [_jsx("span", { className: css.progressBar }), _jsx(IconLoading, { className: css.spinner, size: 14 }), _jsx("span", { children: fetching ? t('overview.fetching', { detail: job.partialText }) : t('overview.summarizing') })] }) : null, jobFailed ? _jsx("div", { className: css.jobError, role: "alert", children: t('overview.failed', { error: job.errorText || t('overview.empty') }) }) : null, summaryText.trim() === ''
                                    ? _jsx("div", { className: css.emptyPane, children: summarizing ? null : t('overview.empty') })
                                    : _jsx("article", { className: css.markdownDocument, "data-streaming": summarizing && !fetching || undefined, children: _jsx(MarkdownText, { text: summaryText, streaming: summarizing && !fetching, labels: labels }) })] }) : _jsxs(_Fragment, { children: [_jsxs("div", { className: css.paneHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('source.original') }), _jsx("p", { children: viewing.name })] }), _jsxs("div", { className: css.paneActions, children: [viewing.url === null ? null : _jsxs("a", { className: css.secondaryButton, href: viewing.url, target: "_blank", rel: "noreferrer", children: [t('sources.openLink'), _jsx(IconExternalLink, { size: 13 })] }), _jsx("button", { className: css.secondaryButton, type: "button", onClick: () => { setViewingSourceId(null); }, children: t('overview.title') })] })] }), viewing.content.trim() === ''
                                    ? _jsx("div", { className: css.emptyPane, children: viewing.status === 'pending_fetch' ? t('sources.pending') : t('source.empty') })
                                    : _jsx("article", { className: css.markdownDocument, children: _jsx(MarkdownText, { text: viewing.content, labels: labels }) })] }) }), _jsxs("aside", { className: css.studioPane, "data-mobile": mobilePane === 'studio' || undefined, children: [_jsx("div", { className: css.paneHeader, children: _jsx("h3", { children: t('studio.title') }) }), _jsx("div", { className: css.studioTabs, children: ['mindmap', 'report'].map(kind => _jsx("button", { className: studioKind === kind ? css.studioTabActive : css.studioTab, type: "button", onClick: () => { setStudioKind(kind); }, children: t(kind === 'mindmap' ? 'studio.mindmap' : 'studio.report') }, kind)) }), generatingStudio ? _jsxs("div", { className: css.progress, role: "status", children: [_jsx("span", { className: css.progressBar }), _jsx(IconLoading, { className: css.spinner, size: 14 }), _jsx("span", { children: t('studio.generating') })] }) : null, studioFailed ? _jsx("div", { className: css.jobError, role: "alert", children: t('studio.failed', { error: job.errorText || t('studio.empty') }) }) : null, studioText.trim() === ''
                                ? _jsxs("div", { className: css.studioEmpty, children: [_jsx("strong", { children: studioKind === 'mindmap' ? t('studio.emptyMindmap') : t('studio.emptyReport') }), _jsx("p", { children: t('studio.empty') })] })
                                : _jsxs("div", { className: css.artifactPreview, children: [mindmapReady ? _jsx("button", { className: css.ghostButton, type: "button", onClick: () => { setExpandMindmap(true); }, children: t('studio.expand') }) : null, studioKind === 'mindmap'
                                            ? _jsx(MermaidMindmap, { text: studioText, invalidLabel: t('studio.mindmapInvalid') })
                                            : _jsx("article", { className: css.markdownDocument, children: _jsx(MarkdownText, { text: studioText, streaming: generatingStudio, labels: labels }) })] }), _jsxs("button", { className: css.studioGenerate, type: "button", disabled: busy || generatingStudio || summarizing, onClick: () => { void run(() => api.generateStudio(entry.id, studioKind)); }, children: [generatingStudio ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : _jsx(IconPlus, { size: 14 }), generatingStudio ? t('studio.generating') : t('studio.generate')] })] })] }), expandMindmap && mindmapReady ? _jsx("div", { className: css.confirmBackdrop, role: "presentation", onClick: () => { setExpandMindmap(false); }, children: _jsxs("div", { className: css.expandCard, role: "dialog", "aria-modal": "true", "aria-label": t('studio.mindmap'), onClick: event => { event.stopPropagation(); }, children: [_jsxs("header", { children: [_jsx("h3", { children: t('studio.mindmap') }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('composer.closeAria'), onClick: () => { setExpandMindmap(false); }, children: _jsx(IconX, { size: 16 }) })] }), _jsx("article", { className: css.markdownDocument, children: _jsx(MermaidMindmap, { text: studioText, invalidLabel: t('studio.mindmapInvalid') }) })] }) }) : null] });
}
function SourceRow({ source, job, t, active, onOpen, onToggle, onRemove }) {
    const summaryJob = job !== null && job.kind === 'summary' && (job.status === 'pending' || job.status === 'running');
    const fetchingThis = summaryJob && job.stage === 'fetch' && source.status === 'pending_fetch';
    const statusLabel = fetchingThis
        ? t('sources.pending')
        : source.status === 'pending_fetch' && summaryJob && job.stage === 'generate'
            ? (source.content.trim() !== '' ? hostname(source.url ?? '') : t('sources.failed'))
            : source.status === 'pending_fetch'
                ? t('sources.pending')
                : source.status === 'failed'
                    ? t('sources.failed')
                    : source.kind === 'url'
                        ? hostname(source.url ?? '')
                        : source.kind;
    return _jsxs("article", { className: css.sourceRow, "data-selected": source.selected || undefined, "data-active": active || undefined, "data-fetching": fetchingThis || undefined, children: [_jsx("input", { type: "checkbox", checked: source.selected, onChange: onToggle, "aria-label": source.name }), _jsxs("button", { className: css.sourceOpen, type: "button", onClick: onOpen, children: [_jsx("strong", { children: source.name }), _jsx("span", { children: statusLabel })] }), source.url === null ? null : _jsx("a", { className: css.sourceLink, href: source.url, target: "_blank", rel: "noreferrer", "aria-label": t('sources.openLink'), onClick: event => { event.stopPropagation(); }, children: _jsx(IconExternalLink, { size: 13 }) }), _jsx("button", { type: "button", onClick: onRemove, "aria-label": t('sources.remove'), children: _jsx(IconX, { size: 14 }) })] });
}
const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a'];
function splitEmoji(value) {
    const first = Array.from(value.trim())[0] ?? '';
    return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value];
}
function sourceEmoji(entry) {
    return entry.sourceType === 'url' || entry.sources.some(source => source.kind === 'url') ? '🌐'
        : entry.sourceType === 'document' || entry.sources.some(source => source.kind === 'document') ? '📄'
            : entry.sourceType === 'chat_answer' ? '💬' : '📝';
}
function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value);
}
function hostname(value) {
    try {
        return new URL(value).hostname.replace(/^www\./u, '');
    }
    catch {
        return value || '网页资料';
    }
}
function messageOf(value) {
    return value instanceof Error ? value.message : String(value);
}
function notebookEntryChanged(current, next) {
    if (current === null)
        return true;
    if (current.updatedAt !== next.updatedAt)
        return true;
    if (current.summary !== next.summary)
        return true;
    if (current.content !== next.content)
        return true;
    const cj = current.latestJob;
    const nj = next.latestJob;
    if (cj !== null || nj !== null) {
        if (cj === null || nj === null)
            return true;
        if (cj.id !== nj.id || cj.status !== nj.status || cj.stage !== nj.stage
            || cj.partialText !== nj.partialText || cj.errorText !== nj.errorText)
            return true;
    }
    if (current.sources.length !== next.sources.length)
        return true;
    for (let index = 0; index < next.sources.length; index += 1) {
        const cs = current.sources[index];
        const ns = next.sources[index];
        if (cs === undefined || ns.id !== cs.id || ns.status !== cs.status
            || ns.content !== cs.content || ns.name !== cs.name || ns.selected !== cs.selected)
            return true;
    }
    return false;
}
//# sourceMappingURL=NotebooksView.js.map