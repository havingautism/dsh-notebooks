/** Copy leftover plugin-named sqlite rows into an empty notebooks domain table. */

import { access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { notebookEntrySchema } from './spec.ts'
import type { NotebookId, NotebookEntry } from './types.ts'

const UNIT = 'notebooks'
const TABLE = 'entries'

/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
export function loadSqliteTableValues(path: string, unit: string, table: string): unknown[] {
  let db: DatabaseSync
  try {
    db = new DatabaseSync(path, { readOnly: true })
  } catch {
    return []
  }
  try {
    const physical = `u_${unit}_${table}`
    const found = db.prepare(
      'SELECT name FROM sqlite_master WHERE type = \'table\' AND name = ?',
    ).get(physical) as { name: string } | undefined
    if (found === undefined) return []
    const rows = db.prepare(`SELECT value FROM "${physical}"`).all() as Array<{ value: string }>
    return rows.map(row => JSON.parse(row.value) as unknown)
  } finally {
    db.close()
  }
}

/**
 * Copy leftover `notebooks.sqlite` entries into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
export async function importLegacyNotebooksIfEmpty(
  legacyPath: string,
  liveSqlitePath: string,
  table: { entries(): Iterable<[NotebookId, NotebookEntry]>; put(id: NotebookId, entry: NotebookEntry): Promise<void> },
): Promise<number> {
  if ([...table.entries()].length > 0) return 0
  if (resolve(legacyPath) === resolve(liveSqlitePath)) return 0
  try {
    await access(legacyPath, constants.R_OK)
  } catch {
    return 0
  }
  let imported = 0
  for (const raw of loadSqliteTableValues(legacyPath, UNIT, TABLE)) {
    const entry = notebookEntrySchema.parse(raw)
    await table.put(entry.id, entry)
    imported += 1
  }
  return imported
}
