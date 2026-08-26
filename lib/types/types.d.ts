/** Public wire values for durable Codemini-style notebooks. */
import type { Branded } from '@deepseek-ai/dsh-brand';
/** Opaque notebook entry identity. */
export type NotebookId = Branded<'NotebookId'>;
/**
 * Construct a notebook identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded notebook identity.
 */
export declare const NotebookId: (value: string) => NotebookId;
/** Opaque notebook source identity. */
export type NotebookSourceId = Branded<'NotebookSourceId'>;
/**
 * Construct a notebook source identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded source identity.
 */
export declare const NotebookSourceId: (value: string) => NotebookSourceId;
/** Origin of one notebook source. */
export type NotebookSourceKind = 'manual' | 'url' | 'document' | 'chat_answer';
/** Dominant origin shown on library cards. */
export type NotebookEntryKind = NotebookSourceKind | 'notebook';
/** Fetch or extraction status for one source or the whole notebook. */
export type NotebookFetchStatus = 'ready' | 'pending_fetch' | 'failed';
/** Studio artifact generated from selected sources. */
export type NotebookArtifactKind = 'mindmap' | 'report';
/** Host generation currently attached to a notebook. */
export type NotebookJobKind = 'summary' | 'mindmap' | 'report';
/** Lifecycle of one host generation job. */
export type NotebookJobStatus = 'pending' | 'running' | 'completed' | 'failed';
/** One source attached to a notebook. */
export interface NotebookSource {
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
export interface NotebookArtifact {
    readonly kind: NotebookArtifactKind;
    readonly content: string;
    readonly updatedAt: number;
}
/** Latest host generation attached to a notebook. */
export interface NotebookJob {
    readonly id: string;
    readonly kind: NotebookJobKind;
    readonly status: NotebookJobStatus;
    readonly partialText: string;
    readonly errorText: string;
    readonly updatedAt: number;
}
/** One detached notebook entry returned to tools and Remote clients. */
export interface NotebookEntry {
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
export interface NotebookListRequest {
    readonly query?: string;
    readonly tag?: string;
    readonly sourceKind?: NotebookSourceKind;
}
/** Notebook listing response, newest edit first. */
export interface NotebookListResult {
    readonly entries: NotebookEntry[];
}
/** Exact notebook lookup. */
export interface NotebookGetRequest {
    readonly id: NotebookId;
}
/** Create or replace a notebook entry. */
export interface NotebookPutRequest {
    readonly id?: NotebookId;
    readonly title: string;
    readonly content: string;
    readonly summary?: string;
    readonly tags?: string[];
}
/** Uploaded text document attached at create time. */
export interface NotebookDocumentInput {
    readonly name: string;
    readonly mimeType?: string;
    readonly content: string;
}
/** Create a notebook from mixed sources and start host summarization. */
export interface NotebookCreateRequest {
    readonly title?: string;
    readonly content?: string;
    readonly urls?: string[];
    readonly documents?: NotebookDocumentInput[];
    readonly tags?: string[];
}
/** Attach a manual, URL, document, or chat source. */
export interface NotebookAddSourceRequest {
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
export interface NotebookSourceSelectionRequest {
    readonly id: NotebookId;
    readonly sourceIds: NotebookSourceId[];
}
/** Remove one source from a notebook. */
export interface NotebookRemoveSourceRequest {
    readonly id: NotebookId;
    readonly sourceId: NotebookSourceId;
}
/** Replace the notebook overview generated from selected sources. */
export interface NotebookSummaryRequest {
    readonly id: NotebookId;
    readonly summary: string;
}
/** Create or replace a Studio artifact. */
export interface NotebookArtifactRequest {
    readonly id: NotebookId;
    readonly kind: NotebookArtifactKind;
    readonly content: string;
}
/** Start host summarization for one notebook. */
export interface NotebookSummarizeRequest {
    readonly id: NotebookId;
}
/** Start host Studio generation for one notebook. */
export interface NotebookGenerateStudioRequest {
    readonly id: NotebookId;
    readonly kind: NotebookArtifactKind;
}
/** Save an assistant reply as a chat-answer notebook. */
export interface NotebookSaveChatAnswerRequest {
    readonly title?: string;
    readonly answerText: string;
    readonly questionText?: string;
    readonly sessionId?: string;
    readonly messageId?: string;
    readonly tags?: string[];
}
/** Filter for composer mention candidates. */
export interface NotebookCandidateRequest {
    readonly query?: string;
}
/** One composer mention candidate. */
export interface NotebookMentionCandidate {
    readonly id: NotebookId;
    readonly title: string;
    readonly mention: string;
    readonly summary: string;
    /** True while overview generation is still running and no summary exists yet. */
    readonly summarizing: boolean;
}
/** Mention candidate listing. */
export interface NotebookCandidateResult {
    readonly candidates: NotebookMentionCandidate[];
}
/** Delete one notebook entry. */
export interface NotebookDeleteRequest {
    readonly id: NotebookId;
}
/** Stable deletion outcome. */
export interface NotebookDeleteResult {
    readonly deleted: boolean;
}
/** Stable source-removal outcome. */
export interface NotebookRemoveSourceResult {
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
}
//# sourceMappingURL=types.d.ts.map