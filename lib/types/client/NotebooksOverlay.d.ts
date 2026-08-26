/** Frame-wide overlay hosting the notebook library and workspace. */
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { NotebooksClientFace } from './client-face.ts';
type NotebooksOverlayProps = InjectFace<NotebooksClientFace> & PropsLocale<'notebooks'>;
/** Render the notebook workspace when the sidebar entry opens the overlay. */
export declare function NotebooksOverlay({ t, ...face }: NotebooksOverlayProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=NotebooksOverlay.d.ts.map