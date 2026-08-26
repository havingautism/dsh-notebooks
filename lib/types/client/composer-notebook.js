/** Composer helpers: insert or clear one notebook reference occurrence. */
/** Remove the notebook occurrence, if any, and return the next insertion offset. */
function clearNotebookOccurrence(shell) {
    const occurrence = shell.snapshot.occurrences.find(item => item.source === 'notebook');
    if (occurrence === undefined)
        return shell.snapshot.draft.length;
    shell.setDraft(shell.snapshot.draft.slice(0, occurrence.offset)
        + shell.snapshot.draft.slice(occurrence.offset + occurrence.length));
    return occurrence.offset;
}
/** Insert one notebook mention occurrence at the composer caret tail. */
export function selectNotebookInComposer(hub, sessionId, candidate) {
    const shell = hub.shell(sessionId);
    let offset = clearNotebookOccurrence(shell);
    let snapshot = shell.snapshot;
    if (offset > 0 && snapshot.draft[offset - 1] !== ' ' && snapshot.draft[offset - 1] !== '\n') {
        shell.setDraft(`${snapshot.draft.slice(0, offset)} ${snapshot.draft.slice(offset)}`);
        offset += 1;
        snapshot = shell.snapshot;
    }
    const span = {
        start: offset,
        end: offset,
        draftRev: snapshot.draftRev,
    };
    const mention = candidate.mention;
    return shell.insertReference({
        source: 'notebook',
        ref: mention,
        label: candidate.title,
        appearance: 'file',
        clipboardText: mention,
    }, span);
}
/** Clear the selected notebook occurrence from one composer draft. */
export function clearNotebookInComposer(hub, sessionId) {
    const shell = hub.shell(sessionId);
    const had = shell.snapshot.occurrences.some(item => item.source === 'notebook');
    if (!had)
        return false;
    clearNotebookOccurrence(shell);
    return true;
}
/** Whether a notebook can be cited while its overview is still generating. */
export function isNotebookAskBlocked(entry) {
    if (entry.summarizing === true)
        return true;
    const summary = (entry.summary?.trim() ?? '') || (entry.latestJob?.resultSummary?.trim() ?? '');
    if (summary !== '')
        return false;
    const status = entry.latestJob?.status ?? '';
    return status === 'pending' || status === 'running';
}
//# sourceMappingURL=composer-notebook.js.map