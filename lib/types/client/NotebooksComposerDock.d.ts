/** Selected notebook chip above the composer card. */
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NotebooksComposerFace } from './client-face.ts';
type NotebooksComposerDockProps = PropsRuntime<'conversation.input.dock'> & PropsLocale<'notebooks'> & NotebooksComposerFace & {
    readonly sessionId: SessionId;
};
/** Show the active notebook cite chip when the composer holds one occurrence. */
export declare function NotebooksComposerDock({ sessionId, input, t, clearNotebook, openNotebook, }: NotebooksComposerDockProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=NotebooksComposerDock.d.ts.map