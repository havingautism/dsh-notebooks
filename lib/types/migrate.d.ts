/** Copy leftover plugin-named sqlite rows into an empty notebooks domain table. */
import type { NotebookId, NotebookEntry } from './types.ts';
/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
export declare function loadSqliteTableValues(path: string, unit: string, table: string): unknown[];
/**
 * Copy leftover `notebooks.sqlite` entries into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
export declare function importLegacyNotebooksIfEmpty(legacyPath: string, liveSqlitePath: string, table: {
    entries(): Iterable<[NotebookId, NotebookEntry]>;
    put(id: NotebookId, entry: NotebookEntry): Promise<void>;
}): Promise<number>;
//# sourceMappingURL=migrate.d.ts.map