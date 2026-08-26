/** Codemini-aligned notebook library, sources, overview, and Studio workspace. */
import type { NotebooksKey } from './locales.ts';
import type { NotebooksViewApi } from './view-types.ts';
type Translate = (key: NotebooksKey, params?: Record<string, unknown>) => string;
type NotebooksViewProps = NotebooksViewApi & {
    t: Translate;
    notebookId?: string | null;
    onSelectNotebook?: (id: string | null) => void;
    onClose?: () => void;
};
/** Render the notebook library, source workspace, overview, and Studio artifacts. */
export declare function NotebooksView({ t, notebookId, onSelectNotebook, onClose, ...api }: NotebooksViewProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=NotebooksView.d.ts.map