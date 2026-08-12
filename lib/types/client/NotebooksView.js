import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Cross-session notebook panel. */
import { useCallback, useEffect, useState } from 'react';
import css from './views.module.css';
/** Render the notebook library and its lightweight editor. */
export function NotebooksView({ list, put, delete: remove }) {
    const [entries, setEntries] = useState([]);
    const [query, setQuery] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const refresh = useCallback(async (nextQuery) => {
        setError(null);
        try {
            setEntries(await list(nextQuery));
        }
        catch (cause) {
            setError(messageOf(cause));
        }
    }, [list]);
    useEffect(() => { void refresh(''); }, [refresh]);
    const submit = (event) => {
        event.preventDefault();
        if (busy || title.trim() === '' || content.trim() === '')
            return;
        setBusy(true);
        setError(null);
        void put({
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        }).then(() => {
            setTitle('');
            setContent('');
            setTags('');
            setBusy(false);
            void refresh(query);
        }, (cause) => {
            setError(messageOf(cause));
            setBusy(false);
        });
    };
    return (_jsxs("div", { className: css.shell, "data-conversation-composer-overlay": "", children: [_jsxs("header", { className: css.hero, children: [_jsxs("div", { children: [_jsx("p", { className: css.eyebrow, children: "NOTEBOOKS" }), _jsx("h2", { className: css.heading, children: "\u968F\u624B\u8BB0" }), _jsx("p", { className: css.subtitle, children: "\u8DE8\u4F1A\u8BDD\u4FDD\u5B58\u7075\u611F\u3001\u7ED3\u8BBA\u548C\u7814\u7A76\u7EBF\u7D22\u3002" })] }), _jsxs("div", { className: css.searchGroup, children: [_jsx("input", { className: css.input, value: query, onChange: (event) => { setQuery(event.target.value); }, placeholder: "\u641C\u7D22\u6807\u9898\u3001\u6B63\u6587\u6216\u6807\u7B7E" }), _jsx("button", { className: css.secondaryButton, type: "button", onClick: () => { void refresh(query); }, children: "\u641C\u7D22" })] })] }), _jsxs("div", { className: css.columns, children: [_jsxs("form", { className: css.editor, onSubmit: submit, children: [_jsx("div", { className: css.sectionTitle, children: "\u65B0\u5EFA\u7B14\u8BB0" }), _jsx("input", { className: css.input, value: title, onChange: (event) => { setTitle(event.target.value); }, placeholder: "\u6807\u9898" }), _jsx("textarea", { className: css.textarea, value: content, onChange: (event) => { setContent(event.target.value); }, placeholder: "\u968F\u624B\u5199\u4E0B\u9700\u8981\u957F\u671F\u4FDD\u7559\u7684\u5185\u5BB9\u2026" }), _jsx("input", { className: css.input, value: tags, onChange: (event) => { setTags(event.target.value); }, placeholder: "\u6807\u7B7E\uFF0C\u7528\u9017\u53F7\u5206\u9694" }), _jsx("button", { className: css.primaryButton, type: "submit", disabled: busy, children: busy ? '保存中…' : '保存笔记' }), error === null ? null : _jsx("div", { className: css.error, role: "alert", children: error })] }), _jsxs("section", { className: css.library, "aria-label": "\u7B14\u8BB0\u5217\u8868", children: [_jsxs("div", { className: css.sectionTitle, children: ["\u5168\u90E8\u7B14\u8BB0 ", _jsx("span", { className: css.count, children: entries.length })] }), entries.length === 0 ? _jsx("div", { className: css.empty, children: "\u8FD8\u6CA1\u6709\u7B14\u8BB0\u3002\u4F60\u4E5F\u53EF\u4EE5\u8BA9\u6A21\u578B\u8C03\u7528 notebook_write \u4FDD\u5B58\u3002" }) : null, _jsx("div", { className: css.cardGrid, children: entries.map(entry => (_jsxs("article", { className: css.card, children: [_jsxs("div", { className: css.cardHeader, children: [_jsx("h3", { className: css.cardTitle, children: entry.title }), _jsx("button", { className: css.linkButton, type: "button", onClick: () => {
                                                        void remove(entry.id).then(() => refresh(query), (cause) => { setError(messageOf(cause)); });
                                                    }, children: "\u5220\u9664" })] }), _jsx("p", { className: css.cardBody, children: entry.content }), _jsx("div", { className: css.tags, children: entry.tags.map(tag => _jsx("span", { className: css.tag, children: tag }, tag)) })] }, entry.id))) })] })] })] }));
}
function messageOf(value) {
    return value instanceof Error ? value.message : String(value);
}
//# sourceMappingURL=NotebooksView.js.map