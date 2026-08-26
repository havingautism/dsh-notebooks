/** Composer mention encoding for one notebook. */
import { NotebookId } from './types.ts';
/** URI scheme reserved for notebook mentions. */
export declare const NOTEBOOK_REFERENCE_SCHEME = "dsh-notebook:";
/**
 * Render a Markdown mention carrying one notebook identity.
 * @param id - notebook identity.
 * @param label - display label shown in the composer chip.
 * @returns escaped `@[label](dsh-notebook:id)` mention.
 */
export declare function formatNotebookMention(id: NotebookId, label: string): string;
/** Mentions extracted from one user message. */
export interface ParsedNotebookMentions {
    readonly text: string;
    readonly ids: NotebookId[];
}
/**
 * Extract notebook mentions from one text value. Only the first id is used
 * for follow-up injection, matching Codemini's single-note picker.
 * @param text - host text to scan.
 * @returns readable text and notebook identities in appearance order.
 */
export declare function parseNotebookMentions(text: string): ParsedNotebookMentions;
//# sourceMappingURL=mention.d.ts.map