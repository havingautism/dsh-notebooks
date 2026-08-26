/** Composer helpers: insert or clear one notebook reference occurrence. */
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { ReferenceInsert, TokenSpan } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { NotebookMentionCandidate } from '../types.ts';
interface InputShell {
    readonly snapshot: {
        readonly draft: string;
        readonly draftRev: number;
        readonly occurrences: readonly {
            readonly source: string;
            readonly offset: number;
            readonly length: number;
        }[];
    };
    setDraft(text: string): void;
    insertReference(reference: ReferenceInsert, span: TokenSpan): boolean;
}
interface ConversationInputHub {
    shell(sessionId: SessionId): InputShell;
}
/** Insert one notebook mention occurrence at the composer caret tail. */
export declare function selectNotebookInComposer(hub: ConversationInputHub, sessionId: SessionId, candidate: NotebookMentionCandidate): boolean;
/** Clear the selected notebook occurrence from one composer draft. */
export declare function clearNotebookInComposer(hub: ConversationInputHub, sessionId: SessionId): boolean;
/** Whether a notebook can be cited while its overview is still generating. */
export declare function isNotebookAskBlocked(entry: {
    summary?: string;
    summarizing?: boolean;
    latestJob?: {
        status?: string;
        resultSummary?: string;
    } | null;
}): boolean;
export {};
//# sourceMappingURL=composer-notebook.d.ts.map