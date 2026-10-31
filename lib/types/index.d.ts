/**
 * Cross-session notebook workspace with sources, summaries, Studio artifacts,
 * model tools, and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { NotebookId } from './types.ts';
import type { NotebookAddSourceRequest, NotebookArtifactRequest, NotebookCandidateRequest, NotebookCandidateResult, NotebookCreateRequest, NotebookDeleteRequest, NotebookDeleteResult, NotebookEntry, NotebookGetRequest, NotebookGenerateStudioRequest, NotebookListRequest, NotebookListResult, NotebookPutRequest, NotebookRemoveSourceRequest, NotebookRemoveSourceResult, NotebookSaveChatAnswerRequest, NotebookSourceSelectionRequest, NotebookSummarizeRequest, NotebookSummaryRequest } from './types.ts';
export type * from './types.ts';
export { NotebookId, NotebookSourceId } from './types.ts';
export { notebookArtifactSchema, notebookEntrySchema, notebookJobSchema, notebookSourceSchema, notebooksDomainSpec } from './spec.ts';
export { formatNotebookMention, parseNotebookMentions } from './mention.ts';
export { buildAskContext, buildSummaryUserPrompt, combineSources, entryKindFromSources, fallbackChatTitle, fallbackTitle, fetchNotebookUrl, jinaReaderUrl, parseGeneratedSummary, parseJinaReaderResponse, extractHtmlArticle, extractWebPageTitle, readableFetchText, selectedSources, } from './generate.ts';
export { extractMermaidFence, mermaidSourceFromArtifact, parseMindmapTree } from './studio-mermaid.ts';
export { defaultSharedSqlitePath, defaultNotebooksSqlitePath, legacyNotebooksSqlitePath } from './platform.ts';
export { importLegacyNotebooksIfEmpty } from './migrate.ts';
/** Required notebook capacity, generation, and content policy. */
export interface Config {
    /** Spawn private Agents to fetch URLs, summarize, and generate Studio artifacts. */
    readonly runnerEnabled: boolean;
    /** Working directory recorded on private generation Agents. */
    readonly runnerCwd: string;
    readonly maxEntries: number;
    readonly maxContentChars: number;
    readonly maxSourcesPerEntry: number;
    readonly maxSourceChars: number;
    readonly maxArtifactChars: number;
    /** Override sqlite path when this plugin mounts the backend; tests use a temp file. */
    readonly sqlitePath?: string;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        notebooks: NotebooksService;
    }
}
/** Durable recall envelope injected beside a user message that @-mentions a notebook. */
export interface NotebooksRecallSource {
    readonly kind: 'notebooks-recall';
    readonly form: 'recall';
    readonly notebookId: NotebookId;
    readonly notebookTitle: string;
}
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'notebooks-recall': NotebooksRecallSource;
    }
}
/** Durable notebook service. */
export declare class NotebooksService extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    static Config: s<Config>;
    private table?;
    private mutationTail;
    private readonly activeJobs;
    /** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and generation limits. */
    constructor(ctx: Context, config: Config);
    protected [Service.init](): Promise<void>;
    list(request: NotebookListRequest): NotebookListResult;
    get(request: NotebookGetRequest): NotebookEntry | null;
    candidates(request: NotebookCandidateRequest): NotebookCandidateResult;
    put(request: NotebookPutRequest): Promise<NotebookEntry>;
    create(request: NotebookCreateRequest): Promise<NotebookEntry>;
    addSource(request: NotebookAddSourceRequest): Promise<NotebookEntry>;
    setSourceSelection(request: NotebookSourceSelectionRequest): Promise<NotebookEntry>;
    removeSource(request: NotebookRemoveSourceRequest): Promise<NotebookRemoveSourceResult>;
    setSummary(request: NotebookSummaryRequest): Promise<NotebookEntry>;
    setArtifact(request: NotebookArtifactRequest): Promise<NotebookEntry>;
    summarize(request: NotebookSummarizeRequest): Promise<NotebookEntry>;
    generateStudio(request: NotebookGenerateStudioRequest): Promise<NotebookEntry>;
    saveChatAnswer(request: NotebookSaveChatAnswerRequest): Promise<NotebookEntry>;
    delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult>;
    private registerTools;
    private injectMentions;
    private launchSummary;
    private launchStudio;
    private launchJob;
    private fetchPendingSources;
    private fetchUrl;
    private complete;
    private patchJob;
    private stopJob;
    private buildCreateSources;
    private buildSource;
    private createSource;
    private manualSource;
    private withInvalidatedDerived;
    private update;
    private enqueue;
    private requireTable;
    private requireEntry;
    private emitProgress;
    private assertLength;
}
export default NotebooksService;
//# sourceMappingURL=index.d.ts.map