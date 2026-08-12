/** Durable storage declaration for notebooks. */

import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { NotebookId, NotebookSourceId } from './types.ts'

/** Stored notebook source schema. */
export const notebookSourceSchema = z.object({
  id: z.string().transform(NotebookSourceId),
  kind: z.enum(['manual', 'url', 'document', 'chat_answer']),
  name: z.string(),
  url: z.string().nullable(),
  mimeType: z.string().nullable(),
  content: z.string(),
  selected: z.boolean(),
  createdAt: z.number(),
})

/** Stored Studio artifact schema. */
export const notebookArtifactSchema = z.object({
  kind: z.enum(['mindmap', 'report']),
  content: z.string(),
  updatedAt: z.number(),
})

/** Stored notebook record schema. */
export const notebookEntrySchema = z.object({
  id: z.string().transform(NotebookId),
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  sources: z.array(notebookSourceSchema),
  artifacts: z.array(notebookArtifactSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
})

/** Global notebook store shared by Sessions. */
export const notebooksDomainSpec = defineDomain({
  name: 'notebooks',
  version: 2,
  tables: { entries: domainTable<import('./types.ts').NotebookId, import('./types.ts').NotebookEntry>(notebookEntrySchema) },
})
