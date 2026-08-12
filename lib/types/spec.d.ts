/** Durable storage declaration for notebooks. */
import { z } from 'zod';
import { NotebookId } from './types.ts';
/** Stored notebook record schema. */
export declare const notebookEntrySchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookId, string>>;
    title: z.ZodString;
    content: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Global notebook store shared by Sessions. */
export declare const notebooksDomainSpec: {
    name: string;
    version: number;
    tables: {
        entries: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<NotebookId, import("./types.ts").NotebookEntry>;
    };
};
//# sourceMappingURL=spec.d.ts.map