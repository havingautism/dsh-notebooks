/** Pure notebook generation helpers shared by the service and tests. */
import type { NotebookArtifactKind, NotebookEntry, NotebookEntryKind, NotebookSource } from './types.ts';
/** Sources currently selected for summary and Studio work. */
export declare function selectedSources(entry: NotebookEntry): NotebookSource[];
/** Combine selected source bodies into one bounded generation input. */
export declare function combineSources(sources: readonly NotebookSource[], maxChars?: number): string;
/** Parse a model summary that starts with Title/Summary markers. */
export declare function parseGeneratedSummary(rawResult: string): {
    title: string;
    summary: string;
};
/** Codemini-aligned user prompt for notebook summary generation. */
export declare function buildSummaryUserPrompt(input: {
    title?: string;
    sourceUrl?: string | null;
    contentText: string;
    sourceQuestionText?: string;
}): string;
/** Ensure a generated title has an emoji and stays short. */
export declare function normalizeGeneratedTitle(rawTitle: string): string;
/** Fallback title when the model omits one. */
export declare function fallbackTitle(input: {
    title?: string;
    sourceUrl?: string | null;
    contentText?: string;
}): string;
/** Fallback title for a saved chat answer. */
export declare function fallbackChatTitle(questionText: string, answerText: string): string;
/** Library card kind derived from attached sources. */
export declare function entryKindFromSources(sources: readonly NotebookSource[]): NotebookEntryKind;
/** Follow-up context injected beside a citing user message. */
export declare function buildAskContext(entry: NotebookEntry, summary: string): string;
/** Whether a URL can be fetched as a notebook source. */
export declare function isAbsoluteHttpUrl(value: string): boolean;
/** Codemini-aligned readable text: strip script/style/noscript, keep body text. */
export declare function readableFetchText(body: string, maxChars?: number): string;
/** Page title from HTML fallback, matching Codemini `webFetchPage` title extraction. */
export declare function extractWebPageTitle(html: string, pageUrl?: string): string;
/**
 * Pull a readable title and body out of a web-fetch HTML fallback.
 * Jina already returns markdown; this only runs when the fallback stored a page.
 */
export declare function extractHtmlArticle(html: string, sourceUrl?: string): {
    title: string;
    content: string;
};
/** Jina Reader proxy URL for one source page, matching Codemini scrapbook. */
export declare function jinaReaderUrl(sourceUrl: string): string;
/** Parsed Jina Reader markdown: article title plus cleaned body. */
export interface ParsedJinaReader {
    readonly title: string;
    readonly text: string;
}
/**
 * Parse a Jina Reader response into title and markdown body.
 * Strips Title/URL/Published/Warning metadata lines, matching Codemini.
 */
export declare function parseJinaReaderResponse(text: string, sourceUrl?: string): ParsedJinaReader;
/** Optional `ctx.web` fetch used after Jina fails. */
export interface NotebookWebFetch {
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
export interface NotebookFetchedPage {
    readonly title: string;
    readonly content: string;
}
/**
 * Fetch one notebook URL the Codemini way: Jina Reader first, then `ctx.web.fetch`.
 * Jina does not require `web-fetch-http`; the fallback does.
 */
export declare function fetchNotebookUrl(url: string, options?: {
    signal?: AbortSignal;
    fetchImpl?: typeof fetch;
    web?: NotebookWebFetch;
    userAgent?: string;
}): Promise<NotebookFetchedPage>;
/** Clip generation input and mark truncation. */
export declare function truncateForGeneration(text: string, maxChars?: number): string;
/** Resolve Studio system prompt text. */
export declare function studioPrompt(kind: NotebookArtifactKind): string;
/** Compact preview used when a summary is still missing. */
export declare function previewSummary(entry: NotebookEntry): string;
//# sourceMappingURL=generate.d.ts.map