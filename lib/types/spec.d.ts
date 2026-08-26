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
export declare const notebookArtifactSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        mindmap: "mindmap";
        report: "report";
    }>;
    content: z.ZodString;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored host generation job schema. */
export declare const notebookJobSchema: z.ZodObject<{
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
export declare const notebookEntrySchema: z.ZodObject<{
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
export declare const notebooksDomainSpec: {
    name: string;
    version: number;
    tables: {
        entries: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<NotebookId, import("./types.ts").NotebookEntry>;
    };
};
//# sourceMappingURL=spec.d.ts.map