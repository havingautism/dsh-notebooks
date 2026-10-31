/** Codemini-style notebook picker launched from the composer tool row. */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NotebooksComposerFace } from './client-face.ts';
type NotebooksComposerButtonProps = PropsRuntime<'conversation.input.left'> & PropsLocale<'notebooks'> & NotebooksComposerFace & {
    readonly sessionId: SessionId;
};
/** Render the notebook launcher button and searchable picker popover. */
export declare function NotebooksComposerButton({ sessionId, input, t, api, selectNotebook, openNotebook, }: NotebooksComposerButtonProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=NotebooksComposerButton.d.ts.map