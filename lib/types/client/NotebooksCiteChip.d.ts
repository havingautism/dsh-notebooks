/** Clickable notebook badge under a citing user message bubble. */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NotebooksClientFace } from './client-face.ts';
type NotebooksCiteChipProps = PropsRuntime<'conversation.chat.node', 'notebook-cite'> & PropsLocale<'notebooks'> & NotebooksClientFace;
/** Render one notebook cite chip that opens the overlay workspace. */
export declare function NotebooksCiteChip({ node, t, store }: NotebooksCiteChipProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=NotebooksCiteChip.d.ts.map