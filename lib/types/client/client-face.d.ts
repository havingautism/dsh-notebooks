import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { NotebookMentionCandidate } from '../types.ts';
import type { NotebooksViewApi } from './view-types.ts';
import type { NotebooksUiStore } from './ui-store.ts';
/** Shared client face for the sidebar entry and shell overlay. */
export interface NotebooksClientFace {
    readonly api: NotebooksViewApi;
    readonly store: NotebooksUiStore;
}
/** Composer picker face shared by the tool-row button and dock chip. */
export interface NotebooksComposerFace extends NotebooksClientFace {
    readonly selectNotebook: (sessionId: SessionId, candidate: NotebookMentionCandidate) => boolean;
    readonly clearNotebook: (sessionId: SessionId) => boolean;
    readonly openNotebook: (notebookId: string) => void;
}
//# sourceMappingURL=client-face.d.ts.map