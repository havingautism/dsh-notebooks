/** Durable storage declaration for notebooks. */
import { z } from 'zod';
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain';
import { NotebookId, NotebookSourceId } from "./types.js";
/** Stored notebook source schema. */
export const notebookSourceSchema = z.object({
    id: z.string().transform(NotebookSourceId),
    kind: z.enum(['manual', 'url', 'document', 'chat_answer']),
    name: z.string(),
    url: z.string().nullable().default(null),
    mimeType: z.string().nullable().default(null),
    content: z.string().default(''),
    selected: z.boolean().default(true),
    status: z.enum(['ready', 'pending_fetch', 'failed']).default('ready'),
    sessionId: z.string().nullable().default(null),
    messageId: z.string().nullable().default(null),
    createdAt: z.number(),
});
/** Stored Studio artifact schema. */
export const notebookArtifactSchema = z.object({
    kind: z.enum(['mindmap', 'report']),
    content: z.string(),
    updatedAt: z.number(),
});
/** Stored host generation job schema. */
export const notebookJobSchema = z.object({
    id: z.string(),
    kind: z.enum(['summary', 'mindmap', 'report']),
    status: z.enum(['pending', 'running', 'completed', 'failed']),
    stage: z.enum(['fetch', 'generate']).default('generate'),
    partialText: z.string().default(''),
    errorText: z.string().default(''),
    updatedAt: z.number(),
});
/** Stored notebook record schema. */
export const notebookEntrySchema = z.object({
    id: z.string().transform(NotebookId),
    title: z.string(),
    content: z.string(),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    sourceType: z.enum(['manual', 'url', 'document', 'chat_answer', 'notebook']).default('manual'),
    sourceUrl: z.string().nullable().default(null),
    fetchStatus: z.enum(['ready', 'pending_fetch', 'failed']).default('ready'),
    sources: z.array(notebookSourceSchema),
    artifacts: z.array(notebookArtifactSchema).default([]),
    latestJob: notebookJobSchema.nullable().default(null),
    createdAt: z.number(),
    updatedAt: z.number(),
});
/** Global notebook store shared by Sessions. */
export const notebooksDomainSpec = defineDomain({
    name: 'notebooks',
    version: 3,
    tables: { entries: domainTable(notebookEntrySchema) },
});
//# sourceMappingURL=spec.js.map