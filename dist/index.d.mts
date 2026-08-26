import { Context, Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
import { Branded } from "@deepseek-ai/dsh-brand";

//#region src/types.d.ts
/** Opaque notebook entry identity. */
type NotebookId = Branded<'NotebookId'>;
/**
 * Construct a notebook identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded notebook identity.
 */
declare const NotebookId: (value: string) => NotebookId;
/** Opaque notebook source identity. */
type NotebookSourceId = Branded<'NotebookSourceId'>;
/**
 * Construct a notebook source identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded source identity.
 */
declare const NotebookSourceId: (value: string) => NotebookSourceId;
/** Origin of one notebook source. */
type NotebookSourceKind = 'manual' | 'url' | 'document' | 'chat_answer';
/** Dominant origin shown on library cards. */
type NotebookEntryKind = NotebookSourceKind | 'notebook';
/** Fetch or extraction status for one source or the whole notebook. */
type NotebookFetchStatus = 'ready' | 'pending_fetch' | 'failed';
/** Studio artifact generated from selected sources. */
type NotebookArtifactKind = 'mindmap' | 'report';
/** Host generation currently attached to a notebook. */
type NotebookJobKind = 'summary' | 'mindmap' | 'report';
/** Lifecycle of one host generation job. */
type NotebookJobStatus = 'pending' | 'running' | 'completed' | 'failed';
/** Host-visible stage while a summary job is running. */
type NotebookJobStage = 'fetch' | 'generate';
/** One source attached to a notebook. */
interface NotebookSource {
  readonly id: NotebookSourceId;
  readonly kind: NotebookSourceKind;
  readonly name: string;
  readonly url: string | null;
  readonly mimeType: string | null;
  readonly content: string;
  readonly selected: boolean;
  readonly status: NotebookFetchStatus;
  readonly sessionId: string | null;
  readonly messageId: string | null;
  readonly createdAt: number;
}
/** One persisted Studio artifact. */
interface NotebookArtifact {
  readonly kind: NotebookArtifactKind;
  readonly content: string;
  readonly updatedAt: number;
}
/** Latest host generation attached to a notebook. */
interface NotebookJob {
  readonly id: string;
  readonly kind: NotebookJobKind;
  readonly status: NotebookJobStatus;
  readonly stage: NotebookJobStage;
  readonly partialText: string;
  readonly errorText: string;
  readonly updatedAt: number;
}
/** One detached notebook entry returned to tools and Remote clients. */
interface NotebookEntry {
  readonly id: NotebookId;
  readonly title: string;
  readonly content: string;
  readonly summary: string;
  readonly tags: string[];
  readonly sourceType: NotebookEntryKind;
  readonly sourceUrl: string | null;
  readonly fetchStatus: NotebookFetchStatus;
  readonly sources: NotebookSource[];
  readonly artifacts: NotebookArtifact[];
  readonly latestJob: NotebookJob | null;
  readonly createdAt: number;
  readonly updatedAt: number;
}
/** Filter for notebook listing. */
interface NotebookListRequest {
  readonly query?: string;
  readonly tag?: string;
  readonly sourceKind?: NotebookSourceKind;
}
/** Notebook listing response, newest edit first. */
interface NotebookListResult {
  readonly entries: NotebookEntry[];
}
/** Exact notebook lookup. */
interface NotebookGetRequest {
  readonly id: NotebookId;
}
/** Create or replace a notebook entry. */
interface NotebookPutRequest {
  readonly id?: NotebookId;
  readonly title: string;
  readonly content: string;
  readonly summary?: string;
  readonly tags?: string[];
}
/** Uploaded text document attached at create time. */
interface NotebookDocumentInput {
  readonly name: string;
  readonly mimeType?: string;
  readonly content: string;
}
/** Create a notebook from mixed sources and start host summarization. */
interface NotebookCreateRequest {
  readonly title?: string;
  readonly content?: string;
  readonly urls?: string[];
  readonly documents?: NotebookDocumentInput[];
  readonly tags?: string[];
}
/** Attach a manual, URL, document, or chat source. */
interface NotebookAddSourceRequest {
  readonly id: NotebookId;
  readonly kind: NotebookSourceKind;
  readonly name: string;
  readonly url?: string;
  readonly mimeType?: string;
  readonly content?: string;
  readonly sessionId?: string;
  readonly messageId?: string;
}
/** Select the exact sources used by summary and Studio work. */
interface NotebookSourceSelectionRequest {
  readonly id: NotebookId;
  readonly sourceIds: NotebookSourceId[];
}
/** Remove one source from a notebook. */
interface NotebookRemoveSourceRequest {
  readonly id: NotebookId;
  readonly sourceId: NotebookSourceId;
}
/** Replace the notebook overview generated from selected sources. */
interface NotebookSummaryRequest {
  readonly id: NotebookId;
  readonly summary: string;
}
/** Create or replace a Studio artifact. */
interface NotebookArtifactRequest {
  readonly id: NotebookId;
  readonly kind: NotebookArtifactKind;
  readonly content: string;
}
/** Start host summarization for one notebook. */
interface NotebookSummarizeRequest {
  readonly id: NotebookId;
}
/** Start host Studio generation for one notebook. */
interface NotebookGenerateStudioRequest {
  readonly id: NotebookId;
  readonly kind: NotebookArtifactKind;
}
/** Save an assistant reply as a chat-answer notebook. */
interface NotebookSaveChatAnswerRequest {
  readonly title?: string;
  readonly answerText: string;
  readonly questionText?: string;
  readonly sessionId?: string;
  readonly messageId?: string;
  readonly tags?: string[];
}
/** Filter for composer mention candidates. */
interface NotebookCandidateRequest {
  readonly query?: string;
}
/** One composer mention candidate. */
interface NotebookMentionCandidate {
  readonly id: NotebookId;
  readonly title: string;
  readonly mention: string;
  readonly summary: string;
  /** True while overview generation is still running and no summary exists yet. */
  readonly summarizing: boolean;
}
/** Mention candidate listing. */
interface NotebookCandidateResult {
  readonly candidates: NotebookMentionCandidate[];
}
/** Delete one notebook entry. */
interface NotebookDeleteRequest {
  readonly id: NotebookId;
}
/** Stable deletion outcome. */
interface NotebookDeleteResult {
  readonly deleted: boolean;
}
/** Stable source-removal outcome. */
interface NotebookRemoveSourceResult {
  readonly removed: boolean;
  readonly entry: NotebookEntry;
}
declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * Live notebook snapshot after each durable mutation so the workspace
     * can refresh sources, summaries, and Studio drafts without polling.
     * @param entry - detached notebook after the mutation.
     * @mode emit
     */
    'notebooks/progress'(entry: NotebookEntry): void;
  }
} //# sourceMappingURL=types.d.ts.map
//#endregion
//#region src/spec.d.ts
/** Stored notebook source schema. */
declare const notebookSourceSchema: z.ZodObject<{
  id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookSourceId, string>>;
  kind: z.ZodEnum<{
    manual: "manual";
    url: "url";
    document: "document";
    chat_answer: "chat_answer";
  }>;
  name: z.ZodString;
  url: z.ZodDefault<z.ZodNullable<z.ZodString>>;
  mimeType: z.ZodDefault<z.ZodNullable<z.ZodString>>;
  content: z.ZodDefault<z.ZodString>;
  selected: z.ZodDefault<z.ZodBoolean>;
  status: z.ZodDefault<z.ZodEnum<{
    ready: "ready";
    pending_fetch: "pending_fetch";
    failed: "failed";
  }>>;
  sessionId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
  messageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
  createdAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored Studio artifact schema. */
declare const notebookArtifactSchema: z.ZodObject<{
  kind: z.ZodEnum<{
    mindmap: "mindmap";
    report: "report";
  }>;
  content: z.ZodString;
  updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored host generation job schema. */
declare const notebookJobSchema: z.ZodObject<{
  id: z.ZodString;
  kind: z.ZodEnum<{
    mindmap: "mindmap";
    report: "report";
    summary: "summary";
  }>;
  status: z.ZodEnum<{
    failed: "failed";
    pending: "pending";
    running: "running";
    completed: "completed";
  }>;
  stage: z.ZodDefault<z.ZodEnum<{
    fetch: "fetch";
    generate: "generate";
  }>>;
  partialText: z.ZodDefault<z.ZodString>;
  errorText: z.ZodDefault<z.ZodString>;
  updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored notebook record schema. */
declare const notebookEntrySchema: z.ZodObject<{
  id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookId, string>>;
  title: z.ZodString;
  content: z.ZodString;
  summary: z.ZodDefault<z.ZodString>;
  tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
  sourceType: z.ZodDefault<z.ZodEnum<{
    manual: "manual";
    url: "url";
    document: "document";
    chat_answer: "chat_answer";
    notebook: "notebook";
  }>>;
  sourceUrl: z.ZodDefault<z.ZodNullable<z.ZodString>>;
  fetchStatus: z.ZodDefault<z.ZodEnum<{
    ready: "ready";
    pending_fetch: "pending_fetch";
    failed: "failed";
  }>>;
  sources: z.ZodArray<z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookSourceId, string>>;
    kind: z.ZodEnum<{
      manual: "manual";
      url: "url";
      document: "document";
      chat_answer: "chat_answer";
    }>;
    name: z.ZodString;
    url: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    mimeType: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    content: z.ZodDefault<z.ZodString>;
    selected: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodDefault<z.ZodEnum<{
      ready: "ready";
      pending_fetch: "pending_fetch";
      failed: "failed";
    }>>;
    sessionId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    messageId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodNumber;
  }, z.core.$strip>>;
  artifacts: z.ZodDefault<z.ZodArray<z.ZodObject<{
    kind: z.ZodEnum<{
      mindmap: "mindmap";
      report: "report";
    }>;
    content: z.ZodString;
    updatedAt: z.ZodNumber;
  }, z.core.$strip>>>;
  latestJob: z.ZodDefault<z.ZodNullable<z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
      mindmap: "mindmap";
      report: "report";
      summary: "summary";
    }>;
    status: z.ZodEnum<{
      failed: "failed";
      pending: "pending";
      running: "running";
      completed: "completed";
    }>;
    stage: z.ZodDefault<z.ZodEnum<{
      fetch: "fetch";
      generate: "generate";
    }>>;
    partialText: z.ZodDefault<z.ZodString>;
    errorText: z.ZodDefault<z.ZodString>;
    updatedAt: z.ZodNumber;
  }, z.core.$strip>>>;
  createdAt: z.ZodNumber;
  updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Global notebook store shared by Sessions. */
declare const notebooksDomainSpec: {
  name: string;
  version: number;
  tables: {
    entries: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<NotebookId, NotebookEntry>;
  };
};
//#endregion
//#region src/mention.d.ts
/**
 * Render a Markdown mention carrying one notebook identity.
 * @param id - notebook identity.
 * @param label - display label shown in the composer chip.
 * @returns escaped `@[label](dsh-notebook:id)` mention.
 */
declare function formatNotebookMention(id: NotebookId, label: string): string;
/** Mentions extracted from one user message. */
interface ParsedNotebookMentions {
  readonly text: string;
  readonly ids: NotebookId[];
}
/**
 * Extract notebook mentions from one text value. Only the first id is used
 * for follow-up injection, matching Codemini's single-note picker.
 * @param text - host text to scan.
 * @returns readable text and notebook identities in appearance order.
 */
declare function parseNotebookMentions(text: string): ParsedNotebookMentions;
//#endregion
//#region src/generate.d.ts
/** Sources currently selected for summary and Studio work. */
declare function selectedSources(entry: NotebookEntry): NotebookSource[];
/** Combine selected source bodies into one bounded generation input. */
declare function combineSources(sources: readonly NotebookSource[], maxChars?: number): string;
/** Parse a model summary that starts with Title/Summary markers. */
declare function parseGeneratedSummary(rawResult: string): {
  title: string;
  summary: string;
};
/** Fallback title when the model omits one. */
declare function fallbackTitle(input: {
  title?: string;
  sourceUrl?: string | null;
  contentText?: string;
}): string;
/** Fallback title for a saved chat answer. */
declare function fallbackChatTitle(questionText: string, answerText: string): string;
/** Library card kind derived from attached sources. */
declare function entryKindFromSources(sources: readonly NotebookSource[]): NotebookEntryKind;
/** Follow-up context injected beside a citing user message. */
declare function buildAskContext(entry: NotebookEntry, summary: string): string;
/** Codemini-aligned readable text: strip script/style/noscript, keep body text. */
declare function readableFetchText(body: string, maxChars?: number): string;
/** Page title from HTML fallback, matching Codemini `webFetchPage` title extraction. */
declare function extractWebPageTitle(html: string, pageUrl?: string): string;
/**
 * Pull a readable title and body out of a web-fetch HTML fallback.
 * Jina already returns markdown; this only runs when the fallback stored a page.
 */
declare function extractHtmlArticle(html: string, sourceUrl?: string): {
  title: string;
  content: string;
};
/** Jina Reader proxy URL for one source page, matching Codemini scrapbook. */
declare function jinaReaderUrl(sourceUrl: string): string;
/** Parsed Jina Reader markdown: article title plus cleaned body. */
interface ParsedJinaReader {
  readonly title: string;
  readonly text: string;
}
/**
 * Parse a Jina Reader response into title and markdown body.
 * Strips Title/URL/Published/Warning metadata lines, matching Codemini.
 */
declare function parseJinaReaderResponse(text: string, sourceUrl?: string): ParsedJinaReader;
/** Optional `ctx.web` fetch used after Jina fails. */
interface NotebookWebFetch {
  fetch(request: {
    url: string;
  }, signal?: AbortSignal): Promise<{
    url: string;
    statusCode: number;
    body: {
      kind: string;
      content: string;
    };
  }>;
}
/** Title plus body from Jina Reader or a web-fetch fallback. */
interface NotebookFetchedPage {
  readonly title: string;
  readonly content: string;
}
/**
 * Fetch one notebook URL the Codemini way: Jina Reader first, then `ctx.web.fetch`.
 * Jina does not require `web-fetch-http`; the fallback does.
 */
declare function fetchNotebookUrl(url: string, options?: {
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  web?: NotebookWebFetch;
  userAgent?: string;
}): Promise<NotebookFetchedPage>;
//#endregion
//#region src/platform.d.ts
/** Canonical sqlite file both product plugins mount when the host has none. */
declare function defaultSharedSqlitePath(env?: NodeJS.ProcessEnv): string;
/** @deprecated Use {@link defaultSharedSqlitePath}; kept for callers that still name the notebooks file. */
declare function defaultNotebooksSqlitePath(env?: NodeJS.ProcessEnv): string;
/** Leftover plugin-named sqlite from before the shared-file cutover. */
declare function legacyNotebooksSqlitePath(sqlitePath: string): string;
//#endregion
//#region src/migrate.d.ts
/**
 * Copy leftover `notebooks.sqlite` entries into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
declare function importLegacyNotebooksIfEmpty(legacyPath: string, liveSqlitePath: string, table: {
  entries(): Iterable<[NotebookId, NotebookEntry]>;
  put(id: NotebookId, entry: NotebookEntry): Promise<void>;
}): Promise<number>;
//#endregion
//#region src/index.d.ts
/** Required notebook capacity, generation, and content policy. */
interface Config {
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
/** Durable notebook service. */
declare class NotebooksService extends TypertRemoteService {
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
//#endregion
export { Config, type NotebookAddSourceRequest, type NotebookArtifact, type NotebookArtifactKind, type NotebookArtifactRequest, type NotebookCandidateRequest, type NotebookCandidateResult, type NotebookCreateRequest, type NotebookDeleteRequest, type NotebookDeleteResult, type NotebookDocumentInput, type NotebookEntry, type NotebookEntryKind, type NotebookFetchStatus, type NotebookGenerateStudioRequest, type NotebookGetRequest, NotebookId, type NotebookJob, type NotebookJobKind, type NotebookJobStage, type NotebookJobStatus, type NotebookListRequest, type NotebookListResult, type NotebookMentionCandidate, type NotebookPutRequest, type NotebookRemoveSourceRequest, type NotebookRemoveSourceResult, type NotebookSaveChatAnswerRequest, type NotebookSource, NotebookSourceId, type NotebookSourceKind, type NotebookSourceSelectionRequest, type NotebookSummarizeRequest, type NotebookSummaryRequest, NotebooksService, NotebooksService as default, buildAskContext, combineSources, defaultNotebooksSqlitePath, defaultSharedSqlitePath, entryKindFromSources, extractHtmlArticle, extractWebPageTitle, fallbackChatTitle, fallbackTitle, fetchNotebookUrl, formatNotebookMention, importLegacyNotebooksIfEmpty, jinaReaderUrl, legacyNotebooksSqlitePath, notebookArtifactSchema, notebookEntrySchema, notebookJobSchema, notebookSourceSchema, notebooksDomainSpec, parseGeneratedSummary, parseJinaReaderResponse, parseNotebookMentions, readableFetchText, selectedSources };