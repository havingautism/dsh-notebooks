/**
 * Cross-session notebook workspace with sources, summaries, Studio artifacts,
 * model tools, and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { NotebookAddSourceRequest, NotebookArtifactRequest, NotebookDeleteRequest, NotebookDeleteResult, NotebookEntry, NotebookGetRequest, NotebookListRequest, NotebookListResult, NotebookPutRequest, NotebookRemoveSourceRequest, NotebookRemoveSourceResult, NotebookSourceSelectionRequest, NotebookSummaryRequest } from './types.ts';
export type * from './types.ts';
export { NotebookId, NotebookSourceId } from './types.ts';
export { notebookArtifactSchema, notebookEntrySchema, notebookSourceSchema, notebooksDomainSpec } from './spec.ts';
/** Required notebook capacity and content policy. */
export interface Config {
    /** Maximum durable notebook entries. */
    readonly maxEntries: number;
    /** Maximum characters in the primary note body. */
    readonly maxContentChars: number;
    /** Maximum attached sources in one notebook, including the primary note. */
    readonly maxSourcesPerEntry: number;
    /** Maximum captured characters in one attached source. */
    readonly maxSourceChars: number;
    /** Maximum characters in one Studio artifact. */
    readonly maxArtifactChars: number;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        notebooks: NotebooksService;
    }
}
/** Durable notebook service. */
export declare class NotebooksService extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    /** Loader validation for deployment-varying notebook limits. */
    static Config: s<Config>;
    private table?;
    private mutationTail;
    /** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and content limits. */
    constructor(ctx: Context, config: Config);
    /** Open durable storage and publish notebook Tools. */
    protected [Service.init](): Promise<void>;
    /**
     * List entries matching optional text, tag, and source filters.
     * @param request - optional notebook filters.
     * @returns matching entries ordered by newest edit.
     */
    list(request: NotebookListRequest): NotebookListResult;
    /**
     * Read one exact notebook.
     * @param request - notebook identity to read.
     * @returns detached notebook data, or null when absent.
     */
    get(request: NotebookGetRequest): NotebookEntry | null;
    /**
     * Create or replace a notebook after validating configured limits.
     * @param request - complete notebook write request.
     * @returns the detached stored notebook.
     */
    put(request: NotebookPutRequest): Promise<NotebookEntry>;
    /**
     * Attach a selected source to a notebook.
     * @param request - source content and owning notebook identity.
     * @returns the updated detached notebook.
     */
    addSource(request: NotebookAddSourceRequest): Promise<NotebookEntry>;
    /**
     * Replace the source selection used for summaries and Studio artifacts.
     * @param request - owning notebook and selected source identities.
     * @returns the updated detached notebook.
     */
    setSourceSelection(request: NotebookSourceSelectionRequest): Promise<NotebookEntry>;
    /**
     * Remove one source and report whether it existed.
     * @param request - notebook and source identities.
     * @returns the removal outcome and updated notebook.
     */
    removeSource(request: NotebookRemoveSourceRequest): Promise<NotebookRemoveSourceResult>;
    /**
     * Replace the overview synthesized from selected sources.
     * @param request - notebook identity and new overview.
     * @returns the updated detached notebook.
     */
    setSummary(request: NotebookSummaryRequest): Promise<NotebookEntry>;
    /**
     * Create or replace a report or Mermaid mind-map artifact.
     * @param request - notebook identity and Studio artifact content.
     * @returns the updated detached notebook.
     */
    setArtifact(request: NotebookArtifactRequest): Promise<NotebookEntry>;
    /**
     * Delete an entry; absence is a successful stable outcome.
     * @param request - notebook identity to delete.
     * @returns whether the notebook existed.
     */
    delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult>;
    private registerTools;
    private update;
    private enqueue;
    private requireTable;
    private assertLength;
}
export default NotebooksService;
//# sourceMappingURL=index.d.ts.map