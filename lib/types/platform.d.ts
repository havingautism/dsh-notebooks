/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
import type { Context } from '@deepseek-ai/cordis';
/** Resolve `$DSH_HOME`, defaulting to `~/.dsh`. */
export declare function resolveDshHome(env?: NodeJS.ProcessEnv): string;
/** Default sqlite file when this plugin is the one that mounts the backend. */
export declare function defaultNotebooksSqlitePath(env?: NodeJS.ProcessEnv): string;
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