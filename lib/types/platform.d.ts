/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
import type { Context } from '@deepseek-ai/cordis';
/** Shared sqlite filename for notebooks and deepresearch domains. */
export declare const SHARED_SQLITE_FILENAME = "dsh.sqlite";
/** Resolve `$DSH_HOME`, defaulting to `~/.dsh`. */
export declare function resolveDshHome(env?: NodeJS.ProcessEnv): string;
/** Canonical sqlite file both product plugins mount when the host has none. */
export declare function defaultSharedSqlitePath(env?: NodeJS.ProcessEnv): string;
/** @deprecated Use {@link defaultSharedSqlitePath}; kept for callers that still name the notebooks file. */
export declare function defaultNotebooksSqlitePath(env?: NodeJS.ProcessEnv): string;
/** Leftover plugin-named sqlite from before the shared-file cutover. */
export declare function legacyNotebooksSqlitePath(sqlitePath: string): string;
/** Register the sqlite backend when the host has not already done so. */
export declare function ensureSqliteBackend(ctx: Context, path: string): Promise<void>;
/** Register the HTTP fetch provider when `ctx.web` exists and has none. */
export declare function ensureHttpFetchProvider(ctx: Context): Promise<void>;
/** Send one storage-domain name to sqlite without replacing other routes. */
export declare function routeDomainToSqlite(ctx: Context, domain: string): void;
/** Ensure sqlite/fetch exist, then route this plugin's domain to sqlite. */
export declare function ensurePluginPlatform(ctx: Context, options: {
    domain: string;
    sqlitePath: string;
}): Promise<void>;
//# sourceMappingURL=platform.d.ts.map