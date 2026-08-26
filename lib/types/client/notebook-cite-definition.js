/** Conversation node for a clickable notebook badge under citing user bubbles. */
import { parseNotebookMentions } from "../mention.js";
export const NOTEBOOKS_PLUGIN_ID = '@deepseek-ai/dsh-notebooks';
function isAppendUserMessage(event) {
    return event.type === 'user/message' && event.surfaceOp === 'append';
}
function textFromContent(content) {
    return content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('\n');
}
function readSourceField(source, key) {
    if (typeof source !== 'object' || source === null)
        return undefined;
    const value = source[key];
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}
function citeFromPluginSource(source, content) {
    if (readSourceField(source, 'kind') !== 'plugin')
        return null;
    if (readSourceField(source, 'plugin') !== NOTEBOOKS_PLUGIN_ID)
        return null;
    const notebookId = readSourceField(source, 'notebookId');
    const notebookTitle = readSourceField(source, 'notebookTitle');
    if (notebookId !== undefined) {
        return { notebookId, title: notebookTitle ?? notebookId };
    }
    const text = textFromContent(content);
    const idMatch = text.match(/^Entry ID:\s*(.+)$/m);
    if (idMatch?.[1] === undefined)
        return null;
    const titleMatch = text.match(/^Title:\s*(.+)$/m);
    return { notebookId: idMatch[1].trim(), title: titleMatch?.[1]?.trim() || idMatch[1].trim() };
}
function citeFromUserMessage(content) {
    const parsed = parseNotebookMentions(textFromContent(content));
    const id = parsed.ids[0];
    if (id === undefined)
        return null;
    const labelMatch = parsed.text.match(/@([^\n]+)/u);
    const title = labelMatch?.[1]?.trim() ?? id;
    return { notebookId: id, title };
}
/** Extract a notebook cite from one user/message event, or null. */
export function citeFromMessageEvent(event) {
    if (event.type !== 'user/message' || event.data === undefined)
        return null;
    const content = event.data.content ?? [];
    return citeFromPluginSource(event.data.source, content) ?? citeFromUserMessage(content);
}
/** Fold citing notebook context into one anchored chip under the user bubble. */
export const notebookCiteDefinition = {
    kind: 'notebook-cite',
    target: 'chat',
    match: (event) => {
        if (!isAppendUserMessage(event))
            return null;
        const cite = citeFromMessageEvent(event);
        if (cite === null)
            return null;
        return { id: `${cite.notebookId}:${String(event.seq)}`, role: 'start' };
    },
    start: (_context, match) => {
        const cite = citeFromMessageEvent(match.event);
        if (cite === null)
            throw new Error('notebook-cite requires a notebook mention');
        return { ...cite, seq: match.event.seq };
    },
    update: context => context.state,
    buildViewNode: (context) => {
        if (context.state === undefined)
            return null;
        const seq = context.state.seq;
        const sourceKind = readSourceField(context.start?.event.data.source, 'kind');
        return {
            key: context.key,
            kind: 'notebook-cite',
            id: context.id,
            target: 'chat',
            anchorSeq: sourceKind === 'plugin' ? seq - 0.1 : seq + 0.1,
            location: context.start?.location ?? { kind: 'unresolved' },
            visibility: 'visible',
            data: { notebookId: context.state.notebookId, title: context.state.title },
        };
    },
};
//# sourceMappingURL=notebook-cite-definition.js.map