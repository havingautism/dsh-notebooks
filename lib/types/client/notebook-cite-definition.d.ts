/** Conversation node for a clickable notebook badge under citing user bubbles. */
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-runtime/client';
import { NotebookId } from '../types.ts';
export declare const NOTEBOOKS_PLUGIN_ID = "@deepseek-ai/dsh-notebooks";
/** Renderer payload for one notebook cite chip. */
export interface NotebookCiteData {
    readonly notebookId: string;
    readonly title: string;
}
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface ChatNodeDataMap {
        /** Clickable notebook badge anchored under a citing user bubble. */
        'notebook-cite': NotebookCiteData;
    }
}
interface NotebookCiteState extends NotebookCiteData {
    readonly seq: number;
}
/** Extract a notebook cite from one user/message event, or null. */
export declare function citeFromMessageEvent(event: {
    readonly type: string;
    readonly seq?: number;
    readonly data?: unknown;
}): NotebookCiteData | null;
/** Fold citing notebook context into one anchored chip under the user bubble. */
export declare const notebookCiteDefinition: ConversationNodeDefinition<NotebookCiteState>;
/** Notebook recall source fields carried on injected context messages. */
export interface NotebookRecallSource {
    readonly kind: 'plugin';
    readonly plugin: typeof NOTEBOOKS_PLUGIN_ID;
    readonly form: 'recall';
    readonly notebookId: NotebookId;
    readonly notebookTitle: string;
}
export {};
//# sourceMappingURL=notebook-cite-definition.d.ts.map