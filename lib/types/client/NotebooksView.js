import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Codemini-aligned notebook library and source workspace. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from './views.module.css';
/** Render the notebook library, selected sources, overview, and Studio artifacts. */
export function NotebooksView(api) {
    const [entries, setEntries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('recent');
    const [composerOpen, setComposerOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const refresh = useCallback(async (nextQuery) => {
        setError(null);
        try {
            const next = await api.list(nextQuery);
            setEntries(next);
            setSelected(current => current === null ? null : next.find(entry => entry.id === current.id) ?? current);
        }
        catch (cause) {
            setError(messageOf(cause));
        }
    }, [api]);
    useEffect(() => {
        const timer = window.setTimeout(() => { void refresh(query); }, query === '' ? 0 : 250);
        return () => { window.clearTimeout(timer); };
    }, [query, refresh]);
    const visible = useMemo(() => {
        const filtered = filter === 'all' ? [...entries] : entries.filter(entry => entry.sources.some(source => source.kind === filter));
        return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
    }, [entries, filter, sort]);
    const updateSelected = (entry) => {
        setSelected(entry);
        setEntries(current => current.map(item => item.id === entry.id ? entry : item));
    };
    if (selected !== null)
        return _jsx(NotebookWorkspace, { entry: selected, api: api, onChange: updateSelected, onBack: () => { setSelected(null); }, onDelete: async () => { await api.delete(selected.id); setSelected(null); await refresh(query); }, error: error, setError: setError });
    return (_jsxs("div", { className: css.shell, "data-conversation-composer-overlay": "", children: [_jsxs("div", { className: css.content, children: [_jsxs("div", { className: css.toolbar, children: [_jsx("div", { className: css.filters, "aria-label": "\u7B14\u8BB0\u7B5B\u9009", children: [['all', '全部'], ['manual', '我的笔记'], ['url', '网页资料'], ['document', '文档']].map(([id, label]) => _jsx("button", { className: filter === id ? css.activeChip : css.chip, type: "button", "aria-current": filter === id ? 'page' : undefined, onClick: () => { setFilter(id); }, children: label }, id)) }), _jsxs("div", { className: css.toolbarActions, children: [_jsx("input", { className: css.search, value: query, onChange: event => { setQuery(event.target.value); }, placeholder: "\u641C\u7D22\u7B14\u8BB0", "aria-label": "\u641C\u7D22\u7B14\u8BB0" }), _jsxs("select", { className: css.select, value: sort, onChange: event => { setSort(event.target.value); }, "aria-label": "\u7B14\u8BB0\u6392\u5E8F", children: [_jsx("option", { value: "recent", children: "\u6700\u8FD1\u66F4\u65B0" }), _jsx("option", { value: "title", children: "\u6309\u6807\u9898" })] }), _jsxs("div", { className: css.viewToggle, children: [_jsx("button", { className: css.iconButton, type: "button", "aria-label": "\u7F51\u683C\u89C6\u56FE", "aria-pressed": viewMode === 'grid', "data-active": viewMode === 'grid', onClick: () => { setViewMode('grid'); }, children: "\u25A6" }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": "\u5217\u8868\u89C6\u56FE", "aria-pressed": viewMode === 'list', "data-active": viewMode === 'list', onClick: () => { setViewMode('list'); }, children: "\u2637" })] }), _jsx("button", { className: css.primaryButton, type: "button", onClick: () => { setError(null); setComposerOpen(true); }, children: "\uFF0B \u65B0\u5EFA\u7B14\u8BB0" })] })] }), _jsxs("section", { className: css.library, children: [_jsx("header", { className: css.libraryTitle, children: _jsxs("div", { children: [_jsx("h2", { children: "\u6211\u7684\u7B14\u8BB0" }), _jsxs("p", { children: [visible.length, " \u6761\u7B14\u8BB0"] })] }) }), error === null || composerOpen ? null : _jsx("div", { className: css.error, role: "alert", children: error }), visible.length === 0 ? _jsxs("div", { className: css.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: "\uD83D\uDCDD" }), _jsx("strong", { children: query === '' ? '还没有笔记' : '没有匹配的笔记' }), _jsx("p", { children: query === '' ? '记录灵感，或整理链接和文档。' : '试试其他关键词或清除搜索条件。' }), query === '' ? _jsx("button", { className: css.primaryButton, type: "button", onClick: () => { setComposerOpen(true); }, children: "\uFF0B \u65B0\u5EFA\u7B14\u8BB0" }) : null] }) : _jsxs("div", { className: viewMode === 'grid' ? css.notebookGrid : css.notebookList, "aria-label": "\u7B14\u8BB0\u5217\u8868", children: [viewMode === 'grid' ? _jsxs("button", { className: css.createCard, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx("span", { children: "\uFF0B" }), _jsx("strong", { children: "\u65B0\u5EFA\u7B14\u8BB0" })] }) : null, visible.map((entry, index) => _jsx(NotebookCard, { entry: entry, index: index, list: viewMode === 'list', onOpen: () => { setSelected(entry); }, onDelete: () => { void api.delete(entry.id).then(() => refresh(query), cause => { setError(messageOf(cause)); }); } }, entry.id))] })] })] }), composerOpen ? _jsx(NotebookComposer, { busy: busy, error: error, setBusy: setBusy, onClose: () => { if (!busy)
                    setComposerOpen(false); }, onCreate: async (payload) => { const entry = await api.put(payload); setComposerOpen(false); await refresh(query); setSelected(entry); }, setError: setError }) : null] }));
}
function NotebookCard({ entry, index, list, onOpen, onDelete }) {
    const [emoji, title] = splitEmoji(entry.title);
    return _jsxs("article", { className: css.notebookCard, "data-list": list || undefined, style: { '--card-tint': CARD_TONES[index % CARD_TONES.length] }, children: [_jsx("button", { className: css.cardOpen, type: "button", onClick: onOpen, "aria-label": `打开笔记：${entry.title}` }), _jsx("div", { className: css.cardEmoji, children: emoji || sourceEmoji(entry) }), _jsxs("div", { className: css.cardInfo, children: [_jsx("h3", { children: title }), _jsx("p", { children: entry.summary || entry.content }), _jsxs("span", { children: [entry.sources.length, " \u4E2A\u6765\u6E90 \u00B7 ", formatDate(entry.updatedAt)] })] }), _jsx("button", { className: css.deleteButton, type: "button", onClick: event => { event.stopPropagation(); onDelete(); }, "aria-label": `删除笔记：${entry.title}`, children: "\u00D7" })] });
}
function NotebookComposer({ busy, error, setBusy, onClose, onCreate, setError }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const submit = (event) => {
        event.preventDefault();
        if (busy || content.trim() === '')
            return;
        setBusy(true);
        setError(null);
        void onCreate({ title: title.trim() || `📝 ${content.trim().slice(0, 32)}`, content, tags: parseTags(tags) }).catch(cause => { setError(messageOf(cause)); }).finally(() => { setBusy(false); });
    };
    return _jsx("div", { className: css.modalBackdrop, role: "presentation", children: _jsxs("form", { className: css.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "new-notebook-title", onSubmit: submit, children: [_jsxs("div", { className: css.modalHeader, children: [_jsxs("div", { className: css.modalHeading, children: [_jsx("span", { "aria-hidden": "true", children: "\uD83D\uDCDD" }), _jsxs("div", { children: [_jsx("h3", { id: "new-notebook-title", children: "\u521B\u5EFA\u7B14\u8BB0" }), _jsx("p", { children: "\u8BB0\u5F55\u60F3\u6CD5\uFF0C\u7A0D\u540E\u7EE7\u7EED\u8865\u5145\u6765\u6E90\u548C\u4EA7\u7269\u3002" })] })] }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": "\u5173\u95ED", disabled: busy, onClick: onClose, children: "\u00D7" })] }), _jsxs("div", { className: css.modalBody, children: [_jsxs("label", { children: ["\u6807\u9898", _jsx("input", { className: css.input, value: title, onChange: event => { setTitle(event.target.value); }, placeholder: "\u53EF\u9009\uFF0C\u53EF\u5305\u542B emoji" })] }), _jsxs("label", { children: ["\u5185\u5BB9 ", _jsx("b", { children: "\u5FC5\u586B" }), _jsx("textarea", { autoFocus: true, className: css.textarea, value: content, onChange: event => { setContent(event.target.value); }, placeholder: "\u5199\u4E0B\u80CC\u666F\u3001\u76EE\u6807\u6216\u7B2C\u4E00\u6761\u8D44\u6599\u2026" })] }), _jsxs("label", { children: ["\u6807\u7B7E", _jsx("input", { className: css.input, value: tags, onChange: event => { setTags(event.target.value); }, placeholder: "\u7528\u9017\u53F7\u5206\u9694" })] }), error === null ? null : _jsx("div", { className: css.modalError, role: "alert", children: error })] }), _jsxs("div", { className: css.modalFooter, children: [_jsx("span", { children: "\u521B\u5EFA\u540E\u53EF\u7EE7\u7EED\u6DFB\u52A0\u94FE\u63A5\u548C\u6587\u6863" }), _jsxs("div", { children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: onClose, children: "\u53D6\u6D88" }), _jsx("button", { className: css.primaryButton, type: "submit", disabled: busy || content.trim() === '', children: busy ? '创建中…' : '创建笔记' })] })] })] }) });
}
function NotebookWorkspace({ entry, api, onChange, onBack, onDelete, error, setError }) {
    const [sourceDraft, setSourceDraft] = useState('');
    const [summary, setSummary] = useState(entry.summary);
    const [studioKind, setStudioKind] = useState('mindmap');
    const artifact = entry.artifacts.find(item => item.kind === studioKind);
    const [artifactDraft, setArtifactDraft] = useState(artifact?.content ?? '');
    useEffect(() => { setSummary(entry.summary); }, [entry.summary]);
    useEffect(() => { setArtifactDraft(entry.artifacts.find(item => item.kind === studioKind)?.content ?? ''); }, [entry.artifacts, studioKind]);
    const action = async (operation) => { setError(null); try {
        onChange(await operation());
    }
    catch (cause) {
        setError(messageOf(cause));
    } };
    const addUrls = () => { const urls = sourceDraft.split('\n').map(item => item.trim()).filter(Boolean); if (urls.length === 0)
        return; void (async () => { let next = entry; for (const url of urls)
        next = await api.addSource({ id: next.id, kind: 'url', name: hostname(url), url, content: url }); onChange(next); setSourceDraft(''); })().catch(cause => { setError(messageOf(cause)); }); };
    const upload = (event) => { const files = [...(event.target.files ?? [])]; if (files.length === 0)
        return; void (async () => { let next = entry; const contents = await Promise.all(files.map(file => file.text())); for (let index = 0; index < files.length; index += 1)
        next = await api.addSource({ id: next.id, kind: 'document', name: files[index]?.name ?? 'Document', mimeType: files[index]?.type || 'text/plain', content: contents[index] ?? '' }); onChange(next); })().catch(cause => { setError(messageOf(cause)); }); event.target.value = ''; };
    return _jsxs("div", { className: css.workspace, "data-conversation-composer-overlay": "", children: [_jsxs("header", { className: css.workspaceHeader, children: [_jsx("button", { className: css.backButton, type: "button", onClick: onBack, children: "\u2190 \u6211\u7684\u7B14\u8BB0" }), _jsxs("div", { children: [_jsx("p", { className: css.eyebrow, children: "NOTEBOOK" }), _jsx("h2", { children: entry.title })] }), _jsx("button", { className: css.deleteText, type: "button", onClick: () => { void onDelete(); }, children: "\u5220\u9664\u7B14\u8BB0" })] }), error === null ? null : _jsx("div", { className: css.error, role: "alert", children: error }), _jsxs("div", { className: css.workspaceColumns, children: [_jsxs("aside", { className: css.sourcesPane, children: [_jsxs("div", { className: css.paneHeader, children: [_jsx("h3", { children: "\u6765\u6E90" }), _jsx("span", { children: entry.sources.length })] }), _jsx("textarea", { className: css.sourceInput, value: sourceDraft, onChange: event => { setSourceDraft(event.target.value); }, placeholder: "\u7F51\u9875\u94FE\u63A5\uFF0C\u6BCF\u884C\u4E00\u4E2A" }), _jsxs("div", { className: css.sourceActions, children: [_jsx("button", { className: css.secondaryButton, type: "button", onClick: addUrls, children: "\uFF0B \u6DFB\u52A0\u94FE\u63A5" }), _jsxs("label", { className: css.secondaryButton, children: ["\u4E0A\u4F20\u6587\u672C", _jsx("input", { hidden: true, multiple: true, type: "file", accept: ".txt,.md,text/plain,text/markdown", onChange: upload })] })] }), _jsx("div", { className: css.sourceList, children: entry.sources.map(source => _jsx(SourceRow, { source: source, onToggle: () => { const ids = entry.sources.filter(item => item.id === source.id ? !item.selected : item.selected).map(item => item.id); void action(() => api.selectSources(entry.id, ids)); }, onRemove: () => { void api.removeSource(entry.id, source.id).then(result => { onChange(result.entry); }, cause => { setError(messageOf(cause)); }); } }, source.id)) })] }), _jsxs("main", { className: css.summaryPane, children: [_jsxs("div", { className: css.paneHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: "\u7EFC\u5408\u603B\u7ED3" }), _jsx("p", { children: "\u57FA\u4E8E\u5F53\u524D\u9009\u4E2D\u7684\u6765\u6E90\u6574\u7406" })] }), _jsx("button", { className: css.primaryButton, type: "button", onClick: () => { void action(() => api.setSummary(entry.id, summary)); }, children: "\u4FDD\u5B58\u603B\u7ED3" })] }), _jsx("textarea", { className: css.summaryEditor, value: summary, onChange: event => { setSummary(event.target.value); }, placeholder: "\u8BA9\u6A21\u578B\u8C03\u7528 notebook_set_summary\uFF0C\u6216\u5728\u8FD9\u91CC\u7F16\u5199\u7EFC\u5408\u603B\u7ED3\u3002" }), _jsxs("div", { className: css.contentPreview, children: [_jsx("h4", { children: "\u539F\u59CB\u7B14\u8BB0" }), _jsx("p", { children: entry.content })] })] }), _jsxs("aside", { className: css.studioPane, children: [_jsx("div", { className: css.paneHeader, children: _jsx("h3", { children: "Studio" }) }), _jsx("div", { className: css.studioTabs, children: ['mindmap', 'report'].map(kind => _jsx("button", { className: studioKind === kind ? css.activeChip : css.chip, type: "button", onClick: () => { setStudioKind(kind); }, children: kind === 'mindmap' ? '思维导图' : '报告' }, kind)) }), _jsx("textarea", { className: css.studioEditor, value: artifactDraft, onChange: event => { setArtifactDraft(event.target.value); }, placeholder: studioKind === 'mindmap' ? '输入 Mermaid mindmap 内容，或让模型生成。' : '输入 Markdown 报告，或让模型生成。' }), _jsxs("button", { className: css.primaryButton, type: "button", onClick: () => { void action(() => api.setArtifact({ id: entry.id, kind: studioKind, content: artifactDraft })); }, children: ["\u4FDD\u5B58", studioKind === 'mindmap' ? '思维导图' : '报告'] }), artifact === undefined ? _jsx("p", { className: css.hint, children: "\u57FA\u4E8E\u9009\u4E2D\u6765\u6E90\u751F\u6210\u5185\u5BB9\u3002" }) : _jsx("div", { className: css.artifactPreview, children: _jsx("pre", { children: artifact.content }) })] })] })] });
}
function SourceRow({ source, onToggle, onRemove }) { return _jsxs("article", { className: css.sourceRow, "data-selected": source.selected || undefined, children: [_jsx("input", { type: "checkbox", checked: source.selected, onChange: onToggle, "aria-label": `选择来源：${source.name}` }), _jsxs("div", { children: [_jsx("strong", { children: source.name }), _jsx("span", { children: source.kind === 'url' ? hostname(source.url ?? '') : source.kind })] }), _jsx("button", { type: "button", onClick: onRemove, "aria-label": `移除来源：${source.name}`, children: "\u00D7" })] }); }
const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a'];
function splitEmoji(value) { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value]; }
function sourceEmoji(entry) { return entry.sources.some(source => source.kind === 'url') ? '🌐' : entry.sources.some(source => source.kind === 'document') ? '📄' : '📝'; }
function formatDate(value) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value); }
function parseTags(value) { return value.split(',').map(tag => tag.trim()).filter(Boolean); }
function hostname(value) { try {
    return new URL(value).hostname;
}
catch {
    return value || '网页资料';
} }
function messageOf(value) { return value instanceof Error ? value.message : String(value); }
//# sourceMappingURL=NotebooksView.js.map