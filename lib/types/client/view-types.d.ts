/** Operations injected into the notebook workspace. */
import type { NotebookAddSourceRequest, NotebookArtifactKind, NotebookArtifactRequest, NotebookCreateRequest, NotebookDeleteResult, NotebookEntry, NotebookId, NotebookMentionCandidate, NotebookPutRequest, NotebookRemoveSourceResult, NotebookSourceId } from '../types.ts';
/** Notebook workspace operations over the package-owned Remote namespace. */
export interface NotebooksViewApi {
    readonly list: (query: string) => Promise<readonly NotebookEntry[]>;
    readonly get: (id: NotebookId) => Promise<NotebookEntry | null>;
    readonly put: (request: NotebookPutRequest) => Promise<NotebookEntry>;
    readonly create: (request: NotebookCreateRequest) => Promise<NotebookEntry>;
    readonly addSource: (request: NotebookAddSourceRequest) => Promise<NotebookEntry>;
    readonly selectSources: (id: NotebookId, sourceIds: NotebookSourceId[]) => Promise<NotebookEntry>;
    readonly removeSource: (id: NotebookId, sourceId: NotebookSourceId) => Promise<NotebookRemoveSourceResult>;
    readonly setSummary: (id: NotebookId, summary: string) => Promise<NotebookEntry>;
    readonly setArtifact: (request: NotebookArtifactRequest) => Promise<NotebookEntry>;
    readonly summarize: (id: NotebookId) => Promise<NotebookEntry>;
    readonly generateStudio: (id: NotebookId, kind: NotebookArtifactKind) => Promise<NotebookEntry>;
    readonly saveChatAnswer: (request: {
        answerText: string;
        questionText?: string;
        title?: string;
    }) => Promise<NotebookEntry>;
    readonly candidates: (query: string) => Promise<readonly NotebookMentionCandidate[]>;
    readonly delete: (id: NotebookId) => Promise<NotebookDeleteResult>;
    readonly subscribeProgress: (listener: (entry: NotebookEntry) => void) => () => void;
}
//# sourceMappingURL=view-types.d.ts.map