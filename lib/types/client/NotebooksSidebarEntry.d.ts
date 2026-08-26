/** Sidebar foot control that opens the global notebook workspace. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NotebooksClientFace } from './client-face.ts';
type NotebooksSidebarEntryProps = PropsRuntime<'sidebar.footer.action'> & InjectFace<NotebooksClientFace> & PropsLocale<'notebooks'>;
/** Render the sidebar launch button for the frame-wide notebook overlay. */
export declare function NotebooksSidebarEntry({ wide, t, ...face }: NotebooksSidebarEntryProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=NotebooksSidebarEntry.d.ts.map