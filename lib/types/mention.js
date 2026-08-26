/** Composer mention encoding for one notebook. */
import { NotebookId } from "./types.js";
/** URI scheme reserved for notebook mentions. */
export const NOTEBOOK_REFERENCE_SCHEME = 'dsh-notebook:';
/**
 * Render a Markdown mention carrying one notebook identity.
 * @param id - notebook identity.
 * @param label - display label shown in the composer chip.
 * @returns escaped `@[label](dsh-notebook:id)` mention.
 */
export function formatNotebookMention(id, label) {
    return `@[${escapeLabel(label)}](${NOTEBOOK_REFERENCE_SCHEME}${encodeURIComponent(id)})`;
}
/**
 * Extract notebook mentions from one text value. Only the first id is used
 * for follow-up injection, matching Codemini's single-note picker.
 * @param text - host text to scan.
 * @returns readable text and notebook identities in appearance order.
 */
export function parseNotebookMentions(text) {
    const ids = [];
    const pattern = /@\[((?:\\.|[^\\\]])*)\]\((dsh-notebook:[^\s)]*)\)|(dsh-notebook:[A-Za-z0-9._~%-]+)/gu;
    const rendered = text.replace(pattern, (_match, _rawLabel, markdownUri, bareUri) => {
        const uri = markdownUri ?? bareUri;
        if (uri === undefined)
            return _match;
        const encoded = uri.slice(NOTEBOOK_REFERENCE_SCHEME.length);
        try {
            const id = NotebookId(decodeURIComponent(encoded));
            if (id.trim() === '')
                return _match;
            ids.push(id);
            const label = _rawLabel === undefined ? id : unescapeLabel(_rawLabel);
            return `@${label}`;
        }
        catch {
            return _match;
        }
    });
    return { text: rendered, ids };
}
function escapeLabel(label) {
    return label.replace(/[\\\]]/gu, match => `\\${match}`);
}
function unescapeLabel(label) {
    return label.replace(/\\(.)/gu, '$1');
}
//# sourceMappingURL=mention.js.map