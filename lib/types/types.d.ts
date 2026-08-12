/** Public wire values for durable notebook entries. */
import type { Branded } from '@deepseek-ai/dsh-brand';
/** Opaque notebook entry identity. */
export type NotebookId = Branded<'NotebookId'>;
/** Construct a notebook identity at its owning boundary. */
export declare const NotebookId: (value: string) => NotebookId;
/** One detached notebook entry returned to tools and Remote clients. */
export interface NotebookEntry {
    readonly id: NotebookId;
    readonly title: string;
    readonly content: string;
    readonly tags: string[];
    readonly createdAt: number;
    readonly updatedAt: number;
}
/** Filter for notebook listing. */
export interface NotebookListRequest {
    readonly query?: string;
    readonly tag?: string;
}
/** Notebook listing response, newest edit first. */
export interface NotebookListResult {
    readonly entries: NotebookEntry[];
}
/** Create or replace a notebook entry. */
export interface NotebookPutRequest {
    readonly id?: NotebookId;
    readonly title: string;
    readonly content: string;
    readonly tags?: string[];
}
/** Delete one notebook entry. */
export interface NotebookDeleteRequest {
    readonly id: NotebookId;
}
/** Stable deletion outcome. */
export interface NotebookDeleteResult {
    readonly deleted: boolean;
}
//# sourceMappingURL=types.d.ts.map