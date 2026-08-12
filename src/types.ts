/** Public wire values for durable Codemini-style notebooks. */

import type { Branded } from '@deepseek-ai/dsh-brand'

/** Opaque notebook entry identity. */
export type NotebookId = Branded<'NotebookId'>
/**
 * Construct a notebook identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded notebook identity.
 */
export const NotebookId = (value: string): NotebookId => value as NotebookId

/** Opaque notebook source identity. */
export type NotebookSourceId = Branded<'NotebookSourceId'>
/**
 * Construct a notebook source identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded source identity.
 */
export const NotebookSourceId = (value: string): NotebookSourceId => value as NotebookSourceId

/** Origin of one notebook source. */
export type NotebookSourceKind = 'manual' | 'url' | 'document' | 'chat_answer'
/** Studio artifact generated from selected sources. */
export type NotebookArtifactKind = 'mindmap' | 'report'

/** One source attached to a notebook. */
export interface NotebookSource {
  readonly id: NotebookSourceId
  readonly kind: NotebookSourceKind
  readonly name: string
  readonly url: string | null
  readonly mimeType: string | null
  readonly content: string
  readonly selected: boolean
  readonly createdAt: number
}

/** One persisted Studio artifact. */
export interface NotebookArtifact {
  readonly kind: NotebookArtifactKind
  readonly content: string
  readonly updatedAt: number
}

/** One detached notebook entry returned to tools and Remote clients. */
export interface NotebookEntry {
  readonly id: NotebookId
  readonly title: string
  readonly content: string
  readonly summary: string
  readonly tags: string[]
  readonly sources: NotebookSource[]
  readonly artifacts: NotebookArtifact[]
  readonly createdAt: number
  readonly updatedAt: number
}

/** Filter for notebook listing. */
export interface NotebookListRequest {
  readonly query?: string
  readonly tag?: string
  readonly sourceKind?: NotebookSourceKind
}
/** Notebook listing response, newest edit first. */
export interface NotebookListResult { readonly entries: NotebookEntry[] }
/** Exact notebook lookup. */
export interface NotebookGetRequest { readonly id: NotebookId }

/** Create or replace a notebook entry. */
export interface NotebookPutRequest {
  readonly id?: NotebookId
  readonly title: string
  readonly content: string
  readonly summary?: string
  readonly tags?: string[]
}

/** Attach a manual, URL, document, or chat source. */
export interface NotebookAddSourceRequest {
  readonly id: NotebookId
  readonly kind: NotebookSourceKind
  readonly name: string
  readonly url?: string
  readonly mimeType?: string
  readonly content: string
}
/** Select the exact sources used by summary and Studio work. */
export interface NotebookSourceSelectionRequest {
  readonly id: NotebookId
  readonly sourceIds: NotebookSourceId[]
}
/** Remove one source from a notebook. */
export interface NotebookRemoveSourceRequest {
  readonly id: NotebookId
  readonly sourceId: NotebookSourceId
}
/** Replace the notebook overview generated from selected sources. */
export interface NotebookSummaryRequest {
  readonly id: NotebookId
  readonly summary: string
}
/** Create or replace a Studio artifact. */
export interface NotebookArtifactRequest {
  readonly id: NotebookId
  readonly kind: NotebookArtifactKind
  readonly content: string
}
/** Delete one notebook entry. */
export interface NotebookDeleteRequest { readonly id: NotebookId }
/** Stable deletion outcome. */
export interface NotebookDeleteResult { readonly deleted: boolean }
/** Stable source-removal outcome. */
export interface NotebookRemoveSourceResult { readonly removed: boolean; readonly entry: NotebookEntry }
