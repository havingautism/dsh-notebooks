/** Durable storage declaration for notebooks. */
import { z } from 'zod';
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain';
import { NotebookId } from "./types.js";
/** Stored notebook record schema. */
export const notebookEntrySchema = z.object({
    id: z.string().transform(NotebookId),
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
    createdAt: z.number(),
    updatedAt: z.number(),
});
/** Global notebook store shared by Sessions. */
export const notebooksDomainSpec = defineDomain({
    name: 'notebooks',
    version: 1,
    tables: {
        entries: domainTable(notebookEntrySchema),
    },
});
//# sourceMappingURL=spec.js.map