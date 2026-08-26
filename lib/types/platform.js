/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
import { homedir } from 'node:os';
import { join } from 'node:path';
import * as StorageSqlite from '@deepseek-ai/dsh-storage-sqlite';
import * as WebFetchHttp from '@deepseek-ai/dsh-web-fetch-http';
/** Resolve `$DSH_HOME`, defaulting to `~/.dsh`. */
export function resolveDshHome(env = process.env) {
    const configured = env.DSH_HOME?.trim();
    if (configured === undefined || configured === '')
        return join(homedir(), '.dsh');
    return configured.startsWith('~') ? join(homedir(), configured.slice(1)) : configured;
}
/** Default sqlite file when this plugin is the one that mounts the backend. */
export function defaultNotebooksSqlitePath(env = process.env) {
    return join(resolveDshHome(env), 'storages', 'notebooks.sqlite');
}
function sqliteMounted(ctx) {
    return ctx.storage.backend.names().includes('sqlite');
}
function canMountHttpFetch(ctx) {
    const web = ctx.get('web');
    return web !== undefined && typeof web.registerFetchProvider === 'function';
}
function isAlreadyMountedError(error) {
    const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
    return /already registered|duplicate-backend|WEB_DUPLICATE_PROVIDER/i.test(text);
}
/** Register the sqlite backend when the host has not already done so. */
export async function ensureSqliteBackend(ctx, path) {
    if (sqliteMounted(ctx))
        return;
    try {
        await ctx.plugin(StorageSqlite, { path });
    }
    catch (error) {
        if (sqliteMounted(ctx) || isAlreadyMountedError(error))
            return;
        throw error;
    }
}
/** Register the HTTP fetch provider when `ctx.web` exists and has none. */
export async function ensureHttpFetchProvider(ctx) {
    if (!canMountHttpFetch(ctx))
        return;
    try {
        await ctx.plugin(WebFetchHttp);
    }
    catch (error) {
        if (isAlreadyMountedError(error))
            return;
        throw error;
    }
}
/** Send one storage-domain name to sqlite without replacing other routes. */
export function routeDomainToSqlite(ctx, domain) {
    const facility = ctx.storageDomain;
    const routes = facility.config.routes ?? (facility.config.routes = {});
    routes[domain] = 'sqlite';
}
/** Ensure sqlite/fetch exist, then route this plugin's domain to sqlite. */
export async function ensurePluginPlatform(ctx, options) {
    await ensureSqliteBackend(ctx, options.sqlitePath);
    routeDomainToSqlite(ctx, options.domain);
    await ensureHttpFetchProvider(ctx);
}
//# sourceMappingURL=platform.js.map