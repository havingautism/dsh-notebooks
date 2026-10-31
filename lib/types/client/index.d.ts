/** Client mount for the notebook Remote contribution. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { TypertClientRemote } from '@deepseek-ai/dsh-typert-protocol';
export type {} from '@deepseek-ai/dsh-notebooks/remote';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Generated Remote namespaces, including notebooks. */
        remote: TypertClientRemote;
    }
}
/** Required services: Remote client, slots, locale, sessions, conversation nodes, and optional triggers. */
export declare const inject: string[];
/**
 * Mount the notebook Remote namespace and its global sidebar/overlay surfaces.
 * @param ctx - Web client root carrying Remote, slot, and locale services.
 * @returns disposer after the namespace is ready.
 */
export declare function apply(ctx: ClientContext): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map