//#region lib/types/invariant.js
/** Package-owned invariant companion for notebooks. */
/**
* No runtime invariant: the storage domain owns persistence and the tool and
* Remote registries own every cross-plugin contribution.
*/
const install = () => {};
/** Companion name. */
const name = "notebooks-invariant";
/** Required registry. */
const inject = ["invariants"];
/** Reserve this package's invariant ownership. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register("@deepseek-ai/dsh-notebooks", install));
//#endregion
export { apply, inject, name };
