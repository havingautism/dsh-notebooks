/**
 * Cross-session notebook storage with model tools and a typed Remote API.
 * @module @deepseek-ai/dsh-notebooks
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { GatewayService } from '@deepseek-ai/dsh-type-meta';
import type { NotebookDeleteRequest, NotebookDeleteResult, NotebookEntry, NotebookListRequest, NotebookListResult, NotebookPutRequest } from './types.ts';
export type * from './types.ts';
export { NotebookId } from './types.ts';
export { notebookEntrySchema, notebooksDomainSpec } from './spec.ts';
/** Required notebook capacity and entry-size policy. */
export interface Config {
    readonly maxEntries: number;
    readonly maxContentChars: number;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        notebooks: NotebooksService;
    }
}
/** Durable notebook service. */
export declare class NotebooksService extends GatewayService {
    private readonly config;
    static inject: string[];
    /** Loader validation for deployment-varying notebook limits. */
    static Config: s<Config>;
    private table?;
    private mutationTail;
    /**
     * @param ctx - Host context carrying storage and tool registries.
     * @param config - Capacity and content limits.
     */
    constructor(ctx: Context, config: Config);
    /** Open durable storage and publish the three model tools. */
    protected [Service.init](): Promise<void>;
    /** List entries matching optional text and tag filters. */
    list(request: NotebookListRequest): NotebookListResult;
    /** Create or replace an entry after validating configured limits. */
    put(request: NotebookPutRequest): Promise<NotebookEntry>;
    /** Delete an entry; absence is a successful stable outcome. */
    delete(request: NotebookDeleteRequest): Promise<NotebookDeleteResult>;
    /** Register model-facing CRUD tools over the same service operations. */
    private registerTools;
    /** Serialize read-check-write mutations. */
    private enqueue;
    /** Resolve the initialized table. */
    private requireTable;
}
export default NotebooksService;
//# sourceMappingURL=index.d.ts.map