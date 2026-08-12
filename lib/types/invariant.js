/** Package-owned invariant companion for notebooks. */
/**
 * No runtime invariant: the storage domain owns persistence and the tool and
 * Remote registries own every cross-plugin contribution.
 */
const install = () => { };
/** Companion name. */
export const name = 'notebooks-invariant';
/** Required registry. */
export const inject = ['invariants'];
/** Reserve this package's invariant ownership. */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register('@deepseek-ai/dsh-notebooks', install));
//# sourceMappingURL=invariant.js.map