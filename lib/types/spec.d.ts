/** Durable storage declaration for notebooks. */
import { z } from 'zod';
import { NotebookId, NotebookSourceId } from './types.ts';
/** Stored notebook source schema. */
export declare const notebookSourceSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookSourceId, string>>;
    kind: z.ZodEnum<{
        manual: "manual";
        url: "url";
        document: "document";
        chat_answer: "chat_answer";
    }>;
    name: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    mimeType: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    selected: z.ZodBoolean;
    createdAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored Studio artifact schema. */
export declare const notebookArtifactSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        mindmap: "mindmap";
        report: "report";
    }>;
    content: z.ZodString;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored notebook record schema. */
export declare const notebookEntrySchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookId, string>>;
    title: z.ZodString;
    content: z.ZodString;
    summary: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    sources: z.ZodArray<z.ZodObject<{
        id: z.ZodPipe<z.ZodString, z.ZodTransform<NotebookSourceId, string>>;
        kind: z.ZodEnum<{
            manual: "manual";
            url: "url";
            document: "document";
            chat_answer: "chat_answer";
        }>;
        name: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        mimeType: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        selected: z.ZodBoolean;
        createdAt: z.ZodNumber;
    }, z.core.$strip>>;
    artifacts: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            mindmap: "mindmap";
            report: "report";
        }>;
        content: z.ZodString;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
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