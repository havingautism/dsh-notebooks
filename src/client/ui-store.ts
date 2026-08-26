/** Root-scoped overlay route: open/close plus the selected notebook, synced to the URL hash. */

export interface NotebooksUiStore {
  getOpen(): boolean
  setOpen(open: boolean): void
  getNotebookId(): string | null
  setNotebookId(id: string | null): void
  subscribe(listener: () => void): () => void
}

const HASH_ROOT = '#notes'

interface NotebooksRoute {
  open: boolean
  notebookId: string | null
}

/** Parse `#notes` and `#notes/<id>` from the current location. */
export function readNotebooksRoute(hash = typeof window === 'undefined' ? '' : window.location.hash): NotebooksRoute {
  if (hash === HASH_ROOT || hash === `${HASH_ROOT}/`) return { open: true, notebookId: null }
  if (hash.startsWith(`${HASH_ROOT}/`)) {
    const notebookId = decodeURIComponent(hash.slice(HASH_ROOT.length + 1))
    return { open: true, notebookId: notebookId === '' ? null : notebookId }
  }
  return { open: false, notebookId: null }
}

function hashFor(route: NotebooksRoute): string {
  if (!route.open) return ''
  return route.notebookId === null ? HASH_ROOT : `${HASH_ROOT}/${encodeURIComponent(route.notebookId)}`
}

function writeHash(route: NotebooksRoute, mode: 'push' | 'replace'): void {
  if (typeof window === 'undefined') return
  const next = hashFor(route)
  if (window.location.hash === next) return
  const url = `${window.location.pathname}${window.location.search}${next}`
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

function notebookIdFromHashOrCurrent(current: string | null): string | null {
  const routed = readNotebooksRoute()
  return routed.open ? routed.notebookId : current
}

/** Create one overlay store shared by the sidebar entry and shell overlay. */
export function createNotebooksUiStore(): NotebooksUiStore {
  const initial = readNotebooksRoute()
  let open = initial.open
  let notebookId = initial.notebookId
  const listeners = new Set<() => void>()
  let writing = false

  const emit = () => { for (const listener of listeners) listener() }

  const applyRoute = (next: NotebooksRoute, mode: 'push' | 'replace' | 'silent') => {
    const changed = open !== next.open || notebookId !== next.notebookId
    open = next.open
    notebookId = next.open ? next.notebookId : null
    if (mode !== 'silent') {
      writing = true
      writeHash({ open, notebookId }, mode)
      writing = false
    }
    if (changed) emit()
  }

  if (typeof window !== 'undefined') {
    const syncFromLocation = () => {
      if (writing) return
      applyRoute(readNotebooksRoute(), 'silent')
    }
    window.addEventListener('popstate', syncFromLocation)
    window.addEventListener('hashchange', syncFromLocation)
  }

  return {
    getOpen: () => open,
    getNotebookId: () => notebookId,
    setOpen: (next) => {
      if (!next) {
        if (!open) return
        applyRoute({ open: false, notebookId: null }, 'push')
        return
      }
      const nextId = notebookIdFromHashOrCurrent(notebookId)
      if (open && nextId === notebookId) return
      applyRoute({ open: true, notebookId: nextId }, open ? 'replace' : 'push')
    },
    setNotebookId: (id) => {
      if (open && id === notebookId) return
      applyRoute({ open: true, notebookId: id }, 'push')
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}
