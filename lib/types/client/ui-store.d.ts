/** Root-scoped overlay route: open/close plus the selected notebook, synced to the URL hash. */
export interface NotebooksUiStore {
    getOpen(): boolean;
    setOpen(open: boolean): void;
    getNotebookId(): string | null;
    setNotebookId(id: string | null): void;
    subscribe(listener: () => void): () => void;
}
interface NotebooksRoute {
    open: boolean;
    notebookId: string | null;
}
/** Parse `#notes` and `#notes/<id>` from the current location. */
export declare function readNotebooksRoute(hash?: string): NotebooksRoute;
/** Create one overlay store shared by the sidebar entry and shell overlay. */
export declare function createNotebooksUiStore(): NotebooksUiStore;
export {};
//# sourceMappingURL=ui-store.d.ts.map