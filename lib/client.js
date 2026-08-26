window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-notebooks",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			return new ZodObject({
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			});
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			return new ZodEnum({
				type: "enum",
				entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region lib/typert.remote-client.js
		const _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"kind": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer")
			]).readonly(),
			"name": string().readonly(),
			"url": string().readonly().optional(),
			"mimeType": string().readonly().optional(),
			"content": string().readonly().optional(),
			"sessionId": string().readonly().optional(),
			"messageId": string().readonly().optional()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema = object({ "query": string().readonly().optional() });
		const _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema = object({ "candidates": array(object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"mention": string().readonly(),
			"summary": string().readonly(),
			"summarizing": boolean().readonly()
		})).readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema = object({
			"title": string().readonly().optional(),
			"content": string().readonly().optional(),
			"urls": array(string()).readonly().optional(),
			"documents": array(object({
				"name": string().readonly(),
				"mimeType": string().readonly().optional(),
				"content": string().readonly()
			})).readonly().optional(),
			"tags": array(string()).readonly().optional()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_create_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema = object({ "deleted": boolean().readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"kind": union([literal("mindmap"), literal("report")]).readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_get_result$schema = union([literal(null), object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})]);
		const _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema = object({
			"query": string().readonly().optional(),
			"tag": string().readonly().optional(),
			"sourceKind": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer")
			]).readonly().optional()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_list_result$schema = object({ "entries": array(object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})).readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly().optional(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly().optional(),
			"tags": array(string()).readonly().optional()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_put_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"sourceId": intersection(string(), unknown()).readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema = object({
			"removed": boolean().readonly(),
			"entry": object({
				"id": intersection(string(), unknown()).readonly(),
				"title": string().readonly(),
				"content": string().readonly(),
				"summary": string().readonly(),
				"tags": array(string()).readonly(),
				"sourceType": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer"),
					literal("notebook")
				]).readonly(),
				"sourceUrl": union([literal(null), string()]).readonly(),
				"fetchStatus": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sources": array(object({
					"id": intersection(string(), unknown()).readonly(),
					"kind": union([
						literal("manual"),
						literal("url"),
						literal("document"),
						literal("chat_answer")
					]).readonly(),
					"name": string().readonly(),
					"url": union([literal(null), string()]).readonly(),
					"mimeType": union([literal(null), string()]).readonly(),
					"content": string().readonly(),
					"selected": boolean().readonly(),
					"status": union([
						literal("failed"),
						literal("ready"),
						literal("pending_fetch")
					]).readonly(),
					"sessionId": union([literal(null), string()]).readonly(),
					"messageId": union([literal(null), string()]).readonly(),
					"createdAt": number().readonly()
				})).readonly(),
				"artifacts": array(object({
					"kind": union([literal("mindmap"), literal("report")]).readonly(),
					"content": string().readonly(),
					"updatedAt": number().readonly()
				})).readonly(),
				"latestJob": union([literal(null), object({
					"id": string().readonly(),
					"kind": union([
						literal("mindmap"),
						literal("report"),
						literal("summary")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("failed"),
						literal("pending"),
						literal("completed")
					]).readonly(),
					"partialText": string().readonly(),
					"errorText": string().readonly(),
					"updatedAt": number().readonly()
				})]).readonly(),
				"createdAt": number().readonly(),
				"updatedAt": number().readonly()
			}).readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema = object({
			"title": string().readonly().optional(),
			"answerText": string().readonly(),
			"questionText": string().readonly().optional(),
			"sessionId": string().readonly().optional(),
			"messageId": string().readonly().optional(),
			"tags": array(string()).readonly().optional()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"kind": union([literal("mindmap"), literal("report")]).readonly(),
			"content": string().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"sourceIds": array(intersection(string(), unknown())).readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"summary": string().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"content": string().readonly(),
			"summary": string().readonly(),
			"tags": array(string()).readonly(),
			"sourceType": union([
				literal("manual"),
				literal("url"),
				literal("document"),
				literal("chat_answer"),
				literal("notebook")
			]).readonly(),
			"sourceUrl": union([literal(null), string()]).readonly(),
			"fetchStatus": union([
				literal("failed"),
				literal("ready"),
				literal("pending_fetch")
			]).readonly(),
			"sources": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"kind": union([
					literal("manual"),
					literal("url"),
					literal("document"),
					literal("chat_answer")
				]).readonly(),
				"name": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"mimeType": union([literal(null), string()]).readonly(),
				"content": string().readonly(),
				"selected": boolean().readonly(),
				"status": union([
					literal("failed"),
					literal("ready"),
					literal("pending_fetch")
				]).readonly(),
				"sessionId": union([literal(null), string()]).readonly(),
				"messageId": union([literal(null), string()]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"artifacts": array(object({
				"kind": union([literal("mindmap"), literal("report")]).readonly(),
				"content": string().readonly(),
				"updatedAt": number().readonly()
			})).readonly(),
			"latestJob": union([literal(null), object({
				"id": string().readonly(),
				"kind": union([
					literal("mindmap"),
					literal("report"),
					literal("summary")
				]).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("completed")
				]).readonly(),
				"partialText": string().readonly(),
				"errorText": string().readonly(),
				"updatedAt": number().readonly()
			})]).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const TYPERT_REMOTE = {
			package: "@deepseek-ai/dsh-notebooks",
			descriptors: [
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/addSource",
					service: "notebooks",
					namespace: "notebooks",
					method: "addSource",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookAddSourceRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 245,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/candidates",
					service: "notebooks",
					namespace: "notebooks",
					method: "candidates",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCandidateRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCandidateResult",
						schema: _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 176,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/create",
					service: "notebooks",
					namespace: "notebooks",
					method: "create",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCreateRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_create_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 218,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/delete",
					service: "notebooks",
					namespace: "notebooks",
					method: "delete",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookDeleteRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookDeleteResult",
						schema: _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 334,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/generateStudio",
					service: "notebooks",
					namespace: "notebooks",
					method: "generateStudio",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGenerateStudioRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 300,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/get",
					service: "notebooks",
					namespace: "notebooks",
					method: "get",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGetRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks#notebooks/get:result",
						schema: _deepseek_ai_dsh_notebooks_notebooks_get_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 170,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/list",
					service: "notebooks",
					namespace: "notebooks",
					method: "list",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookListRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookListResult",
						schema: _deepseek_ai_dsh_notebooks_notebooks_list_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 157,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/put",
					service: "notebooks",
					namespace: "notebooks",
					method: "put",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookPutRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_put_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 188,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/removeSource",
					service: "notebooks",
					namespace: "notebooks",
					method: "removeSource",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookRemoveSourceRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookRemoveSourceResult",
						schema: _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 265,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/saveChatAnswer",
					service: "notebooks",
					namespace: "notebooks",
					method: "saveChatAnswer",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSaveChatAnswerRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 308,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/setArtifact",
					service: "notebooks",
					namespace: "notebooks",
					method: "setArtifact",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookArtifactRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 283,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/setSourceSelection",
					service: "notebooks",
					namespace: "notebooks",
					method: "setSourceSelection",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSourceSelectionRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 254,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/setSummary",
					service: "notebooks",
					namespace: "notebooks",
					method: "setSummary",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummaryRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 278,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-notebooks#notebooks/summarize",
					service: "notebooks",
					namespace: "notebooks",
					method: "summarize",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummarizeRequest",
							schema: _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						schema: _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 293,
						"column": 3
					}
				}
			]
		};
		//#endregion
		//#region src/types.ts
		/**
		* Construct a notebook identity at its owning boundary.
		* @param value - persisted or wire identity.
		* @returns branded notebook identity.
		*/
		const NotebookId = (value) => value;
		//#endregion
		//#region src/mention.ts
		/** Composer mention encoding for one notebook. */
		/** URI scheme reserved for notebook mentions. */
		const NOTEBOOK_REFERENCE_SCHEME = "dsh-notebook:";
		/**
		* Render a Markdown mention carrying one notebook identity.
		* @param id - notebook identity.
		* @param label - display label shown in the composer chip.
		* @returns escaped `@[label](dsh-notebook:id)` mention.
		*/
		function formatNotebookMention(id, label) {
			return `@[${escapeLabel(label)}](${NOTEBOOK_REFERENCE_SCHEME}${encodeURIComponent(id)})`;
		}
		/**
		* Extract notebook mentions from one text value. Only the first id is used
		* for follow-up injection, matching Codemini's single-note picker.
		* @param text - host text to scan.
		* @returns readable text and notebook identities in appearance order.
		*/
		function parseNotebookMentions(text) {
			const ids = [];
			return {
				text: text.replace(/@\[((?:\\.|[^\\\]])*)\]\((dsh-notebook:[^\s)]*)\)|(dsh-notebook:[A-Za-z0-9._~%-]+)/gu, (_match, _rawLabel, markdownUri, bareUri) => {
					const uri = markdownUri ?? bareUri;
					if (uri === void 0) return _match;
					const encoded = uri.slice(13);
					try {
						const id = NotebookId(decodeURIComponent(encoded));
						if (id.trim() === "") return _match;
						ids.push(id);
						return `@${_rawLabel === void 0 ? id : unescapeLabel(_rawLabel)}`;
					} catch {
						return _match;
					}
				}),
				ids
			};
		}
		function escapeLabel(label) {
			return label.replace(/[\\\]]/gu, (match) => `\\${match}`);
		}
		function unescapeLabel(label) {
			return label.replace(/\\(.)/gu, "$1");
		}
		//#endregion
		//#region src/client/hydrate.ts
		function hydrateSource(source) {
			return {
				...source,
				url: source.url ?? null,
				mimeType: source.mimeType ?? null,
				selected: source.selected !== false,
				status: source.status ?? "ready",
				sessionId: source.sessionId ?? null,
				messageId: source.messageId ?? null
			};
		}
		/** Normalize a notebook for the workspace renderer. */
		function hydrateNotebook(entry) {
			return {
				...entry,
				summary: entry.summary ?? "",
				tags: [...entry.tags ?? []],
				sourceType: entry.sourceType ?? "manual",
				sourceUrl: entry.sourceUrl ?? null,
				fetchStatus: entry.fetchStatus ?? "ready",
				sources: (entry.sources ?? []).map(hydrateSource),
				artifacts: [...entry.artifacts ?? []],
				latestJob: entry.latestJob == null ? null : {
					...entry.latestJob,
					stage: entry.latestJob.stage === "fetch" ? "fetch" : "generate",
					partialText: entry.latestJob.partialText ?? "",
					errorText: entry.latestJob.errorText ?? ""
				}
			};
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* `notebooks` namespace dictionaries (view copy + slot labels).
		*
		* Mirrors the locale pattern of `@deepseek-ai/dsh-deepresearch`.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "notebooks";
		/** Simplified Chinese dictionary. */
		const zh = {
			"view.notebooks": "随手记",
			"library.title": "我的笔记",
			"library.back": "返回对话",
			"library.backAria": "关闭随手记",
			"library.itemCount": "{count} 条笔记",
			"library.filterAria": "笔记筛选",
			"filter.all": "全部",
			"filter.manual": "我的笔记",
			"filter.url": "网页资料",
			"filter.document": "文档",
			"toolbar.search": "搜索笔记",
			"toolbar.searchAria": "搜索笔记",
			"toolbar.sortAria": "笔记排序",
			"toolbar.sortRecent": "最近更新",
			"toolbar.sortTitle": "按标题",
			"toolbar.gridView": "网格视图",
			"toolbar.listView": "列表视图",
			"action.new": "新建笔记",
			"action.cancel": "取消",
			"action.creating": "创建中…",
			"action.create": "创建笔记",
			"empty.none": "还没有笔记",
			"empty.noMatch": "没有匹配的笔记",
			"empty.hintStart": "记录灵感，或整理链接和文档。",
			"empty.hintNoMatch": "试试其他关键词或清除搜索条件。",
			"card.openAria": "打开笔记：{title}",
			"card.sources": "{count} 个来源 · {date}",
			"card.summarizing": "总结中",
			"card.fetching": "抓取中",
			"composer.title": "创建笔记",
			"composer.subtitle": "记录想法，稍后继续补充来源和产物。",
			"composer.closeAria": "关闭",
			"composer.titleLabel": "标题",
			"composer.titlePlaceholder": "可选，可包含 emoji",
			"composer.urls": "网页链接",
			"composer.urlsPlaceholder": "https://example.com/article\nhttps://example.com/report",
			"composer.documents": "文档",
			"composer.chooseDocuments": "上传 TXT 或 Markdown",
			"composer.content": "内容",
			"composer.contentPlaceholder": "写下背景、目标或第一条资料…",
			"composer.footer": "创建后会自动抓取链接并生成综合总结",
			"delete.title": "删除笔记？",
			"delete.body": "将永久删除「{title}」。",
			"delete.confirm": "删除",
			"workspace.back": "我的笔记",
			"workspace.delete": "删除笔记",
			"workspace.notebook": "NOTEBOOK",
			"workspace.loading": "正在打开笔记…",
			"sources.title": "来源",
			"sources.add": "添加链接",
			"sources.upload": "上传文本",
			"sources.urlPlaceholder": "https://",
			"sources.pending": "正在抓取…",
			"sources.failed": "抓取失败",
			"sources.openOriginal": "查看原文",
			"sources.openLink": "打开原链接",
			"sources.remove": "移除来源",
			"overview.title": "综合总结",
			"overview.hint": "基于当前选中的来源整理",
			"overview.empty": "还没有综合总结。",
			"overview.fetching": "正在抓取来源… {detail}",
			"overview.summarizing": "正在生成综合总结…",
			"overview.resummarize": "重新总结",
			"overview.failed": "总结失败：{error}",
			"studio.title": "Studio",
			"studio.mindmap": "思维导图",
			"studio.report": "报告",
			"studio.empty": "基于选中来源生成内容。",
			"studio.emptyMindmap": "从选中来源生成思维导图。",
			"studio.emptyReport": "从选中来源生成报告。",
			"studio.generate": "生成",
			"studio.generating": "生成中…",
			"studio.expand": "放大思维导图",
			"source.original": "原文",
			"source.empty": "暂无正文",
			"pane.sources": "来源",
			"pane.summary": "总结",
			"pane.studio": "Studio",
			"mention.section": "随手记",
			"picker.title": "随手记",
			"picker.help": "选一篇笔记作为追问上下文，发送后模型会读到它的综合总结。",
			"picker.search": "搜索笔记",
			"picker.loading": "正在加载笔记…",
			"picker.empty": "还没有可引用的笔记",
			"picker.active": "已选中",
			"picker.summarizing": "总结中",
			"picker.showMore": "显示更多 · {count}",
			"picker.summaryPending": "这篇笔记还在生成综合总结，请稍后再试。",
			"picker.selectFailed": "未能把笔记加入输入框，请重试。",
			"picker.remove": "移除笔记",
			"cite.open": "打开笔记",
			"overlay.crashTitle": "随手记无法显示",
			"overlay.crashHint": "工作区遇到渲染错误。可以返回笔记列表继续。",
			"overlay.crashBack": "返回列表"
		};
		/** English dictionary. */
		const en = {
			"view.notebooks": "Notebooks",
			"library.title": "My notes",
			"library.back": "Back to chat",
			"library.backAria": "Close notebooks",
			"library.itemCount": "{count} notes",
			"library.filterAria": "Note filters",
			"filter.all": "All",
			"filter.manual": "My notes",
			"filter.url": "Web",
			"filter.document": "Documents",
			"toolbar.search": "Search notes",
			"toolbar.searchAria": "Search notes",
			"toolbar.sortAria": "Sort notes",
			"toolbar.sortRecent": "Recently updated",
			"toolbar.sortTitle": "By title",
			"toolbar.gridView": "Grid view",
			"toolbar.listView": "List view",
			"action.new": "New note",
			"action.cancel": "Cancel",
			"action.creating": "Creating…",
			"action.create": "Create note",
			"empty.none": "No notes yet",
			"empty.noMatch": "No matching notes",
			"empty.hintStart": "Capture an idea, or collect links and documents.",
			"empty.hintNoMatch": "Try another keyword or clear the search.",
			"card.openAria": "Open note: {title}",
			"card.sources": "{count} sources · {date}",
			"card.summarizing": "Summarizing",
			"card.fetching": "Fetching",
			"composer.title": "Create note",
			"composer.subtitle": "Write an idea, then add sources and Studio later.",
			"composer.closeAria": "Close",
			"composer.titleLabel": "Title",
			"composer.titlePlaceholder": "Optional, emoji welcome",
			"composer.urls": "Web links",
			"composer.urlsPlaceholder": "https://example.com/article\nhttps://example.com/report",
			"composer.documents": "Documents",
			"composer.chooseDocuments": "Upload TXT or Markdown",
			"composer.content": "Content",
			"composer.contentPlaceholder": "Write the background, goal, or first source…",
			"composer.footer": "Links are fetched and an overview is generated after create",
			"delete.title": "Delete this note?",
			"delete.body": "“{title}” will be deleted permanently.",
			"delete.confirm": "Delete",
			"workspace.back": "My notes",
			"workspace.delete": "Delete note",
			"workspace.notebook": "NOTEBOOK",
			"workspace.loading": "Opening note…",
			"sources.title": "Sources",
			"sources.add": "Add link",
			"sources.upload": "Upload text",
			"sources.urlPlaceholder": "https://",
			"sources.pending": "Fetching…",
			"sources.failed": "Fetch failed",
			"sources.openOriginal": "View original",
			"sources.openLink": "Open original link",
			"sources.remove": "Remove source",
			"overview.title": "Overview",
			"overview.hint": "Synthesized from the selected sources",
			"overview.empty": "No overview yet.",
			"overview.fetching": "Fetching sources… {detail}",
			"overview.summarizing": "Generating overview…",
			"overview.resummarize": "Resummarize",
			"overview.failed": "Overview failed: {error}",
			"studio.title": "Studio",
			"studio.mindmap": "Mind map",
			"studio.report": "Report",
			"studio.empty": "Generate from the selected sources.",
			"studio.emptyMindmap": "Generate a mind map from the selected sources.",
			"studio.emptyReport": "Generate a report from the selected sources.",
			"studio.generate": "Generate",
			"studio.generating": "Generating…",
			"studio.expand": "Expand mind map",
			"source.original": "Original",
			"source.empty": "No captured text",
			"pane.sources": "Sources",
			"pane.summary": "Overview",
			"pane.studio": "Studio",
			"mention.section": "Notebooks",
			"picker.title": "Notebooks",
			"picker.help": "Pick one note as follow-up context. The model reads its synthesized overview for that turn.",
			"picker.search": "Search notes",
			"picker.loading": "Loading notes…",
			"picker.empty": "No notes to cite yet",
			"picker.active": "Selected",
			"picker.summarizing": "Summarizing",
			"picker.showMore": "Show more · {count}",
			"picker.summaryPending": "This note is still generating its overview. Try again soon.",
			"picker.selectFailed": "Could not attach the note to the composer. Try again.",
			"picker.remove": "Remove note",
			"cite.open": "Open note",
			"overlay.crashTitle": "Notebooks failed to render",
			"overlay.crashHint": "The workspace hit a render error. You can return to the library.",
			"overlay.crashBack": "Back to library"
		};
		//#endregion
		//#region src/client/ui-store.ts
		const HASH_ROOT = "#notes";
		/** Parse `#notes` and `#notes/<id>` from the current location. */
		function readNotebooksRoute(hash = typeof window === "undefined" ? "" : window.location.hash) {
			if (hash === HASH_ROOT || hash === `${HASH_ROOT}/`) return {
				open: true,
				notebookId: null
			};
			if (hash.startsWith(`${HASH_ROOT}/`)) {
				const notebookId = decodeURIComponent(hash.slice(7));
				return {
					open: true,
					notebookId: notebookId === "" ? null : notebookId
				};
			}
			return {
				open: false,
				notebookId: null
			};
		}
		function hashFor(route) {
			if (!route.open) return "";
			return route.notebookId === null ? HASH_ROOT : `${HASH_ROOT}/${encodeURIComponent(route.notebookId)}`;
		}
		function writeHash(route, mode) {
			if (typeof window === "undefined") return;
			const next = hashFor(route);
			if (window.location.hash === next) return;
			const url = `${window.location.pathname}${window.location.search}${next}`;
			if (mode === "push") window.history.pushState(null, "", url);
			else window.history.replaceState(null, "", url);
		}
		function notebookIdFromHashOrCurrent(current) {
			const routed = readNotebooksRoute();
			return routed.open ? routed.notebookId : current;
		}
		/** Create one overlay store shared by the sidebar entry and shell overlay. */
		function createNotebooksUiStore() {
			const initial = readNotebooksRoute();
			let open = initial.open;
			let notebookId = initial.notebookId;
			const listeners = /* @__PURE__ */ new Set();
			let writing = false;
			const emit = () => {
				for (const listener of listeners) listener();
			};
			const applyRoute = (next, mode) => {
				const changed = open !== next.open || notebookId !== next.notebookId;
				open = next.open;
				notebookId = next.open ? next.notebookId : null;
				if (mode !== "silent") {
					writing = true;
					writeHash({
						open,
						notebookId
					}, mode);
					writing = false;
				}
				if (changed) emit();
			};
			if (typeof window !== "undefined") {
				const syncFromLocation = () => {
					if (writing) return;
					applyRoute(readNotebooksRoute(), "silent");
				};
				window.addEventListener("popstate", syncFromLocation);
				window.addEventListener("hashchange", syncFromLocation);
			}
			return {
				getOpen: () => open,
				getNotebookId: () => notebookId,
				setOpen: (next) => {
					if (!next) {
						if (!open) return;
						applyRoute({
							open: false,
							notebookId: null
						}, "push");
						return;
					}
					const nextId = notebookIdFromHashOrCurrent(notebookId);
					if (open && nextId === notebookId) return;
					applyRoute({
						open: true,
						notebookId: nextId
					}, open ? "replace" : "push");
				},
				setNotebookId: (id) => {
					if (open && id === notebookId) return;
					applyRoute({
						open: true,
						notebookId: id
					}, "push");
				},
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				}
			};
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/sidebar-entry.module.css.mjs
		const css$4 = "[class*=footerActions]:has([data-slot=\"sidebar.footer.action\"]){flex-direction:column;align-items:stretch}.HPgrhq_layer{flex:none;align-items:center;width:100%;height:42px;margin:8px 0 0;display:flex;position:relative}.HPgrhq_badge{width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;margin:0 -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;display:inline-flex;overflow:hidden}.HPgrhq_badge:hover,.HPgrhq_badge[data-active]{background:var(--dsw-alias-interactive-bg-hover)}.HPgrhq_badgeLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.HPgrhq_layer.HPgrhq_rail{width:36px;height:36px;margin:0}.HPgrhq_rail .HPgrhq_badge{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;padding:0}";
		const tagId$4 = "@deepseek-ai/dsh-notebooks/sidebar-entry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-notebooks";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var sidebar_entry_module_css_default = {
			"badge": "HPgrhq_badge",
			"badgeLabel": "HPgrhq_badgeLabel",
			"layer": "HPgrhq_layer",
			"rail": "HPgrhq_rail"
		};
		//#endregion
		//#region src/client/NotebooksSidebarEntry.tsx
		/** Sidebar foot control that opens the global notebook workspace. */
		/** Render the sidebar launch button for the frame-wide notebook overlay. */
		function NotebooksSidebarEntry({ wide, t, ...face }) {
			const open = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getOpen);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: wide ? sidebar_entry_module_css_default.layer : `${sidebar_entry_module_css_default.layer} ${sidebar_entry_module_css_default.rail}`,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: sidebar_entry_module_css_default.badge,
					"data-active": open || void 0,
					"aria-pressed": open,
					"aria-label": t("view.notebooks"),
					onClick: () => {
						face.store.setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 16 }), wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_entry_module_css_default.badgeLabel,
						children: t("view.notebooks")
					}) : null]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/views.module.css.mjs
		const css$3 = ".xDpCDq_shell{box-sizing:border-box;background:var(--dsw-alias-bg-base);height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex:1;overflow:auto}.xDpCDq_workspace{box-sizing:border-box;background:var(--dsw-alias-bg-base);width:100%;height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex-direction:column;display:flex;overflow:hidden}.xDpCDq_content{box-sizing:border-box;width:min(1540px,100%);margin-inline:auto;padding:24px clamp(18px,3vw,40px) 48px}.xDpCDq_libraryTopBar{justify-content:flex-start;margin-bottom:8px;display:flex}.xDpCDq_notebookLoading{min-height:220px;color:var(--dsw-alias-label-caption);justify-content:center;align-items:center;gap:10px;font-size:12px;display:flex}.xDpCDq_spinner{flex:none;animation:.8s linear infinite xDpCDq_notebooks-spin}@keyframes xDpCDq_notebooks-spin{to{transform:rotate(360deg)}}.xDpCDq_toolbar,.xDpCDq_toolbarActions,.xDpCDq_filters,.xDpCDq_viewToggle,.xDpCDq_libraryTitle,.xDpCDq_workspaceHeader,.xDpCDq_sourceActions,.xDpCDq_paneHeader,.xDpCDq_paneActions,.xDpCDq_studioTabs,.xDpCDq_modalHeader,.xDpCDq_modalHeading,.xDpCDq_modalFooter,.xDpCDq_modalFooter>div,.xDpCDq_fileRow{align-items:center;display:flex}.xDpCDq_toolbar,.xDpCDq_libraryTitle,.xDpCDq_workspaceHeader,.xDpCDq_paneHeader,.xDpCDq_modalHeader,.xDpCDq_modalFooter{justify-content:space-between}.xDpCDq_toolbar{gap:20px}.xDpCDq_filters,.xDpCDq_toolbarActions,.xDpCDq_sourceActions,.xDpCDq_studioTabs,.xDpCDq_modalFooter>div{gap:7px}.xDpCDq_filters{min-width:0;overflow-x:auto}.xDpCDq_primaryButton,.xDpCDq_secondaryButton,.xDpCDq_backButton,.xDpCDq_deleteText,.xDpCDq_chip,.xDpCDq_activeChip,.xDpCDq_iconButton,.xDpCDq_createCard{color:inherit;font:inherit;cursor:pointer;border:0}.xDpCDq_primaryButton{background:var(--dsw-alias-label-primary);min-height:38px;color:var(--dsw-alias-bg-base);border-radius:999px;align-items:center;gap:6px;padding:0 16px;font-size:12px;font-weight:650;display:inline-flex;box-shadow:inset 0 1px #ffffff14,0 8px 18px #0000001f}.xDpCDq_primaryButton:hover{opacity:.9;transform:translateY(-.5px)}.xDpCDq_ghostButton{min-height:30px;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;border-radius:8px;align-items:center;gap:6px;padding:0 10px;font-size:11px;display:inline-flex}.xDpCDq_ghostButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_primaryButton:disabled,.xDpCDq_secondaryButton:disabled,.xDpCDq_iconButton:disabled{cursor:default;opacity:.5}.xDpCDq_secondaryButton,.xDpCDq_backButton{background:var(--dsw-alias-interactive-bg-hover-solid);min-height:36px;color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:6px;padding:0 13px;font-size:12px;display:inline-flex}.xDpCDq_deleteText{color:var(--dsw-alias-state-error-primary);background:0 0;border-radius:9px;padding:8px 11px}.xDpCDq_chip,.xDpCDq_activeChip{min-height:34px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:999px;flex:none;padding:0 14px;font-size:12px}.xDpCDq_chip:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_activeChip{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-label-primary)}.xDpCDq_input,.xDpCDq_textarea,.xDpCDq_search,.xDpCDq_select,.xDpCDq_sourceInput,.xDpCDq_summaryEditor,.xDpCDq_studioEditor{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}.xDpCDq_input,.xDpCDq_search,.xDpCDq_select{border-radius:999px;height:38px;padding:0 13px}.xDpCDq_search{width:min(230px,25vw)}.xDpCDq_textarea{resize:vertical;border-radius:12px;min-height:130px;padding:11px 13px}.xDpCDq_input:focus,.xDpCDq_textarea:focus,.xDpCDq_search:focus,.xDpCDq_select:focus,.xDpCDq_sourceInput:focus,.xDpCDq_summaryEditor:focus,.xDpCDq_studioEditor:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}.xDpCDq_viewToggle{border:1px solid var(--dsw-alias-border-l1);border-radius:999px;gap:0;overflow:hidden}.xDpCDq_iconButton{width:38px;height:38px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:10px;place-items:center;padding:0;display:inline-grid}.xDpCDq_viewToggle .xDpCDq_iconButton{border-radius:0}.xDpCDq_viewToggle .xDpCDq_iconButton+.xDpCDq_iconButton{border-left:1px solid var(--dsw-alias-border-l1)}.xDpCDq_iconButton[data-active=true],.xDpCDq_iconButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-state-business-primary)}.xDpCDq_library{margin-top:34px}.xDpCDq_libraryTitle h2{letter-spacing:-.025em;margin:0;font-size:24px;font-weight:600}.xDpCDq_libraryTitle p{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:12px}.xDpCDq_notebookGrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:22px;display:grid}.xDpCDq_notebookList{flex-direction:column;gap:10px;margin-top:22px;display:flex}.xDpCDq_createCard{border:1px solid var(--dsw-alias-border-l1);min-height:208px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;display:flex}.xDpCDq_createCard:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_createCard span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:54px;height:54px;color:var(--dsw-alias-state-business-primary);border-radius:50%;place-items:center;margin-bottom:14px;font-size:24px;display:grid}.xDpCDq_createCard strong{font-size:14px}.xDpCDq_notebookCard{--card-tint:#5b8def;isolation:isolate;box-sizing:border-box;border:1px solid color-mix(in srgb, var(--card-tint) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--card-tint) 15%, var(--dsw-alias-bg-base));border-radius:16px;flex-direction:column;min-height:208px;padding:18px;transition:transform .18s,border-color .18s;display:flex;position:relative;overflow:hidden}.xDpCDq_notebookCard:hover{border-color:color-mix(in srgb, var(--card-tint) 50%, var(--dsw-alias-border-l1));transform:translateY(-2px)}.xDpCDq_notebookCard[data-busy]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l1))}.xDpCDq_notebookCard[data-list]{flex-direction:row;align-items:center;gap:14px;min-height:86px}.xDpCDq_cardInfo span{color:var(--dsw-alias-label-caption);align-items:center;gap:6px;font-size:10px;display:inline-flex}.xDpCDq_cardOpen{z-index:0;cursor:pointer;background:0 0;border:0;position:absolute;inset:0}.xDpCDq_cardEmoji{z-index:1;pointer-events:none;font-size:36px}.xDpCDq_cardInfo{z-index:1;pointer-events:none;min-width:0;margin-top:auto}.xDpCDq_notebookCard[data-list] .xDpCDq_cardInfo{flex:1;margin-top:0}.xDpCDq_cardInfo h3{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:10px 0 6px;font-size:16px;overflow:hidden}.xDpCDq_notebookCard[data-list] .xDpCDq_cardInfo h3{margin-top:0}.xDpCDq_cardInfo p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0 0 12px;font-size:12px;line-height:1.55;display:-webkit-box;overflow:hidden}.xDpCDq_deleteButton{z-index:2;width:28px;height:28px;color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;border-radius:50%;position:absolute;top:10px;right:10px}.xDpCDq_deleteButton:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary)}.xDpCDq_emptyState{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;min-height:260px;margin-top:22px;padding:28px;display:flex}.xDpCDq_emptyState>span{background:var(--dsw-specific-tip);border-radius:14px;place-items:center;width:48px;height:48px;font-size:22px;display:grid}.xDpCDq_emptyState strong{margin-top:14px;font-size:13px}.xDpCDq_emptyState p{color:var(--dsw-alias-label-caption);margin:6px 0 16px;font-size:12px}.xDpCDq_error,.xDpCDq_modalError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:10px;padding:10px 12px;font-size:12px}.xDpCDq_error{margin-top:16px}.xDpCDq_modalBackdrop{z-index:100;box-sizing:border-box;backdrop-filter:blur(8px);background:#080a0e94;place-items:center;padding:8px;display:grid;position:fixed;inset:0}.xDpCDq_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:20px;flex-direction:column;width:min(580px,100%);max-height:min(720px,100dvh - 16px);display:flex;overflow:hidden;box-shadow:0 28px 90px #00000061}.xDpCDq_modalHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;padding:18px 22px}.xDpCDq_modalHeading{gap:12px;min-width:0}.xDpCDq_modalHeading>span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);border-radius:11px;flex:none;place-items:center;width:36px;height:36px;display:grid}.xDpCDq_modalHeading h3{margin:0;font-size:16px}.xDpCDq_modalHeading p{color:var(--dsw-alias-label-caption);margin:4px 0 0;font-size:11px}.xDpCDq_modalBody{gap:14px;min-height:0;padding:20px 22px;display:grid;overflow-y:auto}.xDpCDq_modalBody label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:7px;font-size:11px;display:flex}.xDpCDq_modalBody label b{color:var(--dsw-alias-label-caption);font-weight:400}.xDpCDq_modalBody .xDpCDq_input{border-radius:10px}.xDpCDq_modalFooter{border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-caption);flex:none;gap:14px;padding:14px 22px;font-size:10px}.xDpCDq_workspaceHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;gap:18px;padding:14px 24px}.xDpCDq_workspaceHeading{text-align:center;flex:1;min-width:0}.xDpCDq_workspaceHeader h2{text-overflow:ellipsis;white-space:nowrap;margin:0;font-size:19px;overflow:hidden}.xDpCDq_eyebrow{color:var(--dsw-alias-state-business-primary);letter-spacing:.12em;margin:0 0 6px;font-size:10px;font-weight:700}.xDpCDq_mobilePanes{gap:7px;padding:10px 16px 0;display:none}.xDpCDq_workspaceColumns{flex:1;grid-template-columns:minmax(220px,280px) minmax(360px,1fr) minmax(260px,360px);min-height:0;display:grid;overflow:hidden}.xDpCDq_sourcesPane,.xDpCDq_summaryPane,.xDpCDq_studioPane{border-right:1px solid var(--dsw-alias-border-l1);min-width:0;padding:20px;overflow:auto}.xDpCDq_studioPane{border-right:0}.xDpCDq_paneHeader{border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:14px;padding-bottom:12px}.xDpCDq_paneHeader h3{margin:0;font-size:13px}.xDpCDq_paneHeader p{color:var(--dsw-alias-label-caption);margin:5px 0 0;font-size:11px}.xDpCDq_paneHeader span{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-caption);border-radius:9px;padding:3px 7px;font-size:10px}.xDpCDq_paneActions{gap:7px}.xDpCDq_sourceInput,.xDpCDq_studioEditor{resize:vertical;border-radius:10px;width:100%;min-height:76px;padding:9px}.xDpCDq_sourceList{flex-direction:column;gap:7px;margin-top:14px;display:flex}.xDpCDq_sourceRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);opacity:.67;border-radius:11px;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:9px;display:grid}.xDpCDq_sourceRow[data-selected]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, var(--dsw-alias-border-l1));opacity:1}.xDpCDq_sourceRow[data-active]{box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}.xDpCDq_sourceOpen{min-width:0;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;gap:3px;padding:0;display:flex}.xDpCDq_sourceRow strong{text-overflow:ellipsis;white-space:nowrap;font-size:11px;overflow:hidden}.xDpCDq_sourceRow span{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;font-size:9px;overflow:hidden}.xDpCDq_sourceRow button,.xDpCDq_sourceLink{color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0}.xDpCDq_sourceLink{place-items:center;display:grid}.xDpCDq_summaryEditor{resize:vertical;border-radius:12px;width:100%;min-height:340px;padding:16px;line-height:1.7}.xDpCDq_contentPreview,.xDpCDq_artifactPreview{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;margin-top:18px;padding:14px}.xDpCDq_contentPreview h4{margin:0 0 8px;font-size:11px}.xDpCDq_contentPreview p,.xDpCDq_artifactPreview pre{color:var(--dsw-alias-label-tertiary);font:inherit;white-space:pre-wrap;margin:0;font-size:11px;line-height:1.65}.xDpCDq_studioEditor{min-height:210px;margin:12px 0}.xDpCDq_artifactPreview{gap:10px;max-height:none;display:grid;overflow:auto}.xDpCDq_markdownDocument{min-width:0;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere;font-size:13px;line-height:1.7}.xDpCDq_markdownDocument[data-streaming]{position:relative}.xDpCDq_progress{border:1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 22%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent);color:var(--dsw-alias-label-secondary);border-radius:12px;align-items:center;gap:8px;margin:0 0 16px;padding:10px 12px;font-size:12px;display:flex;position:relative;overflow:hidden}.xDpCDq_progressBar{background:linear-gradient(90deg, transparent, var(--dsw-alias-state-business-primary), transparent);background-size:40% 100%;height:2px;animation:1.1s linear infinite xDpCDq_notebooks-progress;position:absolute;inset:auto 0 0}.xDpCDq_jobError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:12px;margin:0 0 16px;padding:10px 12px;font-size:12px;line-height:1.5}.xDpCDq_studioTabs{grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;display:grid}.xDpCDq_studioTab,.xDpCDq_studioTabActive{min-height:42px;font:inherit;cursor:pointer;border:0;border-radius:12px;justify-content:center;align-items:center;padding:0 10px;font-size:12px;font-weight:600;display:flex}.xDpCDq_studioTab{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-secondary)}.xDpCDq_studioTab:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_studioTabActive{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);color:var(--dsw-alias-state-business-primary);box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}.xDpCDq_studioEmpty{text-align:center;flex-direction:column;justify-content:center;align-items:center;min-height:180px;padding:20px 16px;display:flex}.xDpCDq_studioEmpty strong{font-size:12px;font-weight:620}.xDpCDq_studioEmpty p{color:var(--dsw-alias-label-caption);margin:8px 0 0;font-size:11px;line-height:1.5}.xDpCDq_studioGenerate{background:var(--dsw-alias-label-primary);width:100%;min-height:40px;color:var(--dsw-alias-bg-base);font:inherit;cursor:pointer;border:0;border-radius:12px;justify-content:center;align-items:center;gap:8px;margin-top:auto;padding:0 14px;font-size:12px;font-weight:650;display:flex}.xDpCDq_studioGenerate:hover{opacity:.9}.xDpCDq_studioGenerate:disabled{cursor:default;opacity:.4}.xDpCDq_studioPane{flex-direction:column;display:flex}@keyframes xDpCDq_notebooks-progress{0%{background-position:-40% 0}to{background-position:140% 0}}.xDpCDq_emptyPane,.xDpCDq_hint{color:var(--dsw-alias-label-caption);margin-top:18px;font-size:12px;line-height:1.6}.xDpCDq_fileChips{flex-wrap:wrap;gap:6px;margin:8px 0 0;padding:0;list-style:none;display:flex}.xDpCDq_fileChips li{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:6px;padding:4px 8px;font-size:11px;display:inline-flex}.xDpCDq_fileChips button{color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.xDpCDq_studioPane>.xDpCDq_primaryButton{margin:4px 0 12px}.xDpCDq_confirmBackdrop{z-index:110;backdrop-filter:blur(10px);background:#0c0a096b;place-items:center;padding:24px;display:grid;position:fixed;inset:0}.xDpCDq_confirmCard{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 18%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:18px;gap:10px;width:min(380px,100%);padding:22px 22px 18px;display:grid;position:relative;overflow:hidden;box-shadow:0 18px 50px #00000038}.xDpCDq_confirmCard:before{background:var(--dsw-alias-state-error-primary);content:\"\";width:3px;position:absolute;inset:0 auto 0 0}.xDpCDq_confirmMark{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);border-radius:11px;place-items:center;width:36px;height:36px;display:grid}.xDpCDq_confirmMark:after{border:1.5px solid var(--dsw-alias-state-error-primary);background:radial-gradient(circle at 50% 32%, var(--dsw-alias-state-error-primary) 1.3px, transparent 1.5px) no-repeat, linear-gradient(var(--dsw-alias-state-error-primary), var(--dsw-alias-state-error-primary)) 50% 72% / 1.5px 5px no-repeat;content:\"\";border-radius:50%;width:14px;height:14px}.xDpCDq_confirmCard h3{letter-spacing:-.02em;margin:2px 0 0;font-size:16px;font-weight:620}.xDpCDq_confirmCard p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.xDpCDq_confirmActions{justify-content:flex-end;gap:8px;margin-top:8px;display:flex}.xDpCDq_confirmCancel,.xDpCDq_confirmDelete{height:34px;font:inherit;cursor:pointer;border:0;border-radius:10px;justify-content:center;align-items:center;gap:6px;padding:0 14px;font-size:12px;font-weight:600;display:inline-flex}.xDpCDq_confirmCancel{color:var(--dsw-alias-label-secondary);background:0 0}.xDpCDq_confirmCancel:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.xDpCDq_confirmDelete{background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-bg-base)}.xDpCDq_confirmDelete:hover{opacity:.9}.xDpCDq_confirmCancel:disabled,.xDpCDq_confirmDelete:disabled{opacity:.55}.xDpCDq_expandCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:18px;gap:12px;width:min(920px,100%);max-height:min(80dvh,720px);padding:18px 20px;display:grid;overflow:auto}.xDpCDq_expandCard header{justify-content:space-between;align-items:center;display:flex}.xDpCDq_expandCard h3{margin:0;font-size:16px}@media (width<=980px){.xDpCDq_toolbar{flex-direction:column;align-items:flex-start}.xDpCDq_toolbarActions{flex-wrap:wrap;width:100%}.xDpCDq_search{flex:1;width:auto}.xDpCDq_mobilePanes{display:flex}.xDpCDq_workspaceColumns{grid-template-columns:1fr}.xDpCDq_sourcesPane,.xDpCDq_summaryPane,.xDpCDq_studioPane{border-right:0;display:none}.xDpCDq_sourcesPane[data-mobile],.xDpCDq_summaryPane[data-mobile],.xDpCDq_studioPane[data-mobile]{display:block}}@media (width<=620px){.xDpCDq_content{padding:16px 12px 36px}.xDpCDq_toolbarActions{align-items:stretch}.xDpCDq_search{flex-basis:100%;width:100%}.xDpCDq_select{flex:1}.xDpCDq_notebookGrid{grid-template-columns:1fr}.xDpCDq_workspaceHeader{flex-wrap:wrap;align-items:flex-start}.xDpCDq_modalHeader,.xDpCDq_modalBody,.xDpCDq_modalFooter{padding-inline:16px}.xDpCDq_modalFooter{flex-direction:column;align-items:stretch}.xDpCDq_modalFooter>div{justify-content:flex-end}}@media (prefers-reduced-motion:reduce){.xDpCDq_notebookCard{transition:none}.xDpCDq_spinner,.xDpCDq_progressBar{animation:none}}";
		const tagId$3 = "@deepseek-ai/dsh-notebooks/views.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-notebooks";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var views_module_css_default = {
			"activeChip": "xDpCDq_activeChip",
			"artifactPreview": "xDpCDq_artifactPreview",
			"backButton": "xDpCDq_backButton",
			"cardEmoji": "xDpCDq_cardEmoji",
			"cardInfo": "xDpCDq_cardInfo",
			"cardOpen": "xDpCDq_cardOpen",
			"chip": "xDpCDq_chip",
			"confirmActions": "xDpCDq_confirmActions",
			"confirmBackdrop": "xDpCDq_confirmBackdrop",
			"confirmCancel": "xDpCDq_confirmCancel",
			"confirmCard": "xDpCDq_confirmCard",
			"confirmDelete": "xDpCDq_confirmDelete",
			"confirmMark": "xDpCDq_confirmMark",
			"content": "xDpCDq_content",
			"contentPreview": "xDpCDq_contentPreview",
			"createCard": "xDpCDq_createCard",
			"deleteButton": "xDpCDq_deleteButton",
			"deleteText": "xDpCDq_deleteText",
			"emptyPane": "xDpCDq_emptyPane",
			"emptyState": "xDpCDq_emptyState",
			"error": "xDpCDq_error",
			"expandCard": "xDpCDq_expandCard",
			"eyebrow": "xDpCDq_eyebrow",
			"fileChips": "xDpCDq_fileChips",
			"fileRow": "xDpCDq_fileRow",
			"filters": "xDpCDq_filters",
			"ghostButton": "xDpCDq_ghostButton",
			"hint": "xDpCDq_hint",
			"iconButton": "xDpCDq_iconButton",
			"input": "xDpCDq_input",
			"jobError": "xDpCDq_jobError",
			"library": "xDpCDq_library",
			"libraryTitle": "xDpCDq_libraryTitle",
			"libraryTopBar": "xDpCDq_libraryTopBar",
			"markdownDocument": "xDpCDq_markdownDocument",
			"mobilePanes": "xDpCDq_mobilePanes",
			"modal": "xDpCDq_modal",
			"modalBackdrop": "xDpCDq_modalBackdrop",
			"modalBody": "xDpCDq_modalBody",
			"modalError": "xDpCDq_modalError",
			"modalFooter": "xDpCDq_modalFooter",
			"modalHeader": "xDpCDq_modalHeader",
			"modalHeading": "xDpCDq_modalHeading",
			"notebookCard": "xDpCDq_notebookCard",
			"notebookGrid": "xDpCDq_notebookGrid",
			"notebookList": "xDpCDq_notebookList",
			"notebookLoading": "xDpCDq_notebookLoading",
			"notebooks-progress": "xDpCDq_notebooks-progress",
			"notebooks-spin": "xDpCDq_notebooks-spin",
			"paneActions": "xDpCDq_paneActions",
			"paneHeader": "xDpCDq_paneHeader",
			"primaryButton": "xDpCDq_primaryButton",
			"progress": "xDpCDq_progress",
			"progressBar": "xDpCDq_progressBar",
			"search": "xDpCDq_search",
			"secondaryButton": "xDpCDq_secondaryButton",
			"select": "xDpCDq_select",
			"shell": "xDpCDq_shell",
			"sourceActions": "xDpCDq_sourceActions",
			"sourceInput": "xDpCDq_sourceInput",
			"sourceLink": "xDpCDq_sourceLink",
			"sourceList": "xDpCDq_sourceList",
			"sourceOpen": "xDpCDq_sourceOpen",
			"sourceRow": "xDpCDq_sourceRow",
			"sourcesPane": "xDpCDq_sourcesPane",
			"spinner": "xDpCDq_spinner",
			"studioEditor": "xDpCDq_studioEditor",
			"studioEmpty": "xDpCDq_studioEmpty",
			"studioGenerate": "xDpCDq_studioGenerate",
			"studioPane": "xDpCDq_studioPane",
			"studioTab": "xDpCDq_studioTab",
			"studioTabActive": "xDpCDq_studioTabActive",
			"studioTabs": "xDpCDq_studioTabs",
			"summaryEditor": "xDpCDq_summaryEditor",
			"summaryPane": "xDpCDq_summaryPane",
			"textarea": "xDpCDq_textarea",
			"toolbar": "xDpCDq_toolbar",
			"toolbarActions": "xDpCDq_toolbarActions",
			"viewToggle": "xDpCDq_viewToggle",
			"workspace": "xDpCDq_workspace",
			"workspaceColumns": "xDpCDq_workspaceColumns",
			"workspaceHeader": "xDpCDq_workspaceHeader",
			"workspaceHeading": "xDpCDq_workspaceHeading"
		};
		//#endregion
		//#region src/client/NotebooksView.tsx
		/** Codemini-aligned notebook library, sources, overview, and Studio workspace. */
		/** Render the notebook library, source workspace, overview, and Studio artifacts. */
		function NotebooksView({ t, notebookId, onSelectNotebook, onClose, ...api }) {
			const [entries, setEntries] = (0, react.useState)([]);
			const [selected, setSelected] = (0, react.useState)(null);
			const [query, setQuery] = (0, react.useState)("");
			const [filter, setFilter] = (0, react.useState)("all");
			const [viewMode, setViewMode] = (0, react.useState)("grid");
			const [sort, setSort] = (0, react.useState)("recent");
			const [composerOpen, setComposerOpen] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [pendingDelete, setPendingDelete] = (0, react.useState)(null);
			const [deleteBusy, setDeleteBusy] = (0, react.useState)(false);
			const [notebookLoading, setNotebookLoading] = (0, react.useState)(false);
			const openNotebook = (0, react.useCallback)((entry) => {
				setSelected(entry === null ? null : hydrateNotebook(entry));
				onSelectNotebook?.(entry?.id ?? null);
			}, [onSelectNotebook]);
			const apiRef = (0, react.useRef)(api);
			apiRef.current = api;
			const refresh = (0, react.useCallback)(async (nextQuery) => {
				setError(null);
				try {
					const next = (await apiRef.current.list(nextQuery)).map(hydrateNotebook);
					setEntries(next);
					setSelected((current) => {
						if (current === null) return null;
						const listed = next.find((item) => item.id === current.id);
						return listed !== void 0 && listed.updatedAt > current.updatedAt ? listed : current;
					});
				} catch (cause) {
					setError(messageOf(cause));
				}
			}, []);
			(0, react.useEffect)(() => {
				if (selected !== null) return;
				const timer = window.setTimeout(() => {
					refresh(query);
				}, query === "" ? 0 : 250);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				query,
				refresh,
				selected
			]);
			(0, react.useEffect)(() => {
				if (notebookId === void 0) return;
				if (notebookId === null) {
					setSelected(null);
					setNotebookLoading(false);
					return;
				}
				const listed = entries.find((item) => item.id === notebookId);
				if (listed !== void 0) {
					setSelected((current) => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateNotebook(listed));
					setNotebookLoading(false);
					return;
				}
				let active = true;
				setNotebookLoading(true);
				apiRef.current.get(NotebookId(notebookId)).then((entry) => {
					if (!active) return;
					if (entry === null) {
						setSelected(null);
						setError(t("empty.noMatch"));
					} else setSelected(hydrateNotebook(entry));
					setNotebookLoading(false);
				}, (cause) => {
					if (active) {
						setError(messageOf(cause));
						setNotebookLoading(false);
					}
				});
				return () => {
					active = false;
				};
			}, [
				notebookId,
				entries,
				t
			]);
			const requestDelete = (0, react.useCallback)((target) => {
				setError(null);
				setPendingDelete(target);
			}, []);
			const confirmDelete = (0, react.useCallback)(async () => {
				if (pendingDelete === null || deleteBusy) return;
				setDeleteBusy(true);
				setError(null);
				try {
					await api.delete(pendingDelete.id);
					if (selected?.id === pendingDelete.id) openNotebook(null);
					setPendingDelete(null);
					await refresh(query);
				} catch (cause) {
					setError(messageOf(cause));
				} finally {
					setDeleteBusy(false);
				}
			}, [
				api,
				deleteBusy,
				openNotebook,
				pendingDelete,
				query,
				refresh,
				selected?.id
			]);
			const visible = (0, react.useMemo)(() => {
				const filtered = filter === "all" ? [...entries] : entries.filter((entry) => entry.sourceType === filter || entry.sources.some((source) => source.kind === filter));
				return sort === "title" ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
			}, [
				entries,
				filter,
				sort
			]);
			const updateSelected = (0, react.useCallback)((entry) => {
				const next = hydrateNotebook(entry);
				setSelected((current) => current?.id === next.id && current.updatedAt === next.updatedAt && current.latestJob?.partialText === next.latestJob?.partialText && current.latestJob?.stage === next.latestJob?.stage ? current : next);
				setEntries((current) => current.map((item) => item.id === next.id ? next : item));
			}, []);
			(0, react.useEffect)(() => {
				const unsubscribe = api.subscribeProgress?.((latest) => {
					updateSelected(hydrateNotebook(latest));
				});
				return () => {
					unsubscribe?.();
				};
			}, [api, updateSelected]);
			if (notebookId !== void 0 && notebookId !== null && selected === null && notebookLoading) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.shell,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: views_module_css_default.content,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.notebookLoading,
						role: "status",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
							className: views_module_css_default.spinner,
							size: 16
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("workspace.loading") })]
					})
				})
			});
			if (selected !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NotebookWorkspace, {
					entry: selected,
					api,
					t,
					onChange: updateSelected,
					onBack: () => {
						openNotebook(null);
					},
					onDelete: () => {
						requestDelete({
							id: selected.id,
							title: selected.title
						});
					},
					error,
					setError
				}), pendingDelete === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
					pending: pendingDelete,
					busy: deleteBusy,
					t,
					onCancel: () => {
						if (!deleteBusy) setPendingDelete(null);
					},
					onConfirm: () => {
						confirmDelete();
					}
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.content,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								"data-notebooks-view": "",
								hidden: true
							}),
							onClose === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: views_module_css_default.libraryTopBar,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									className: views_module_css_default.backButton,
									type: "button",
									"aria-label": t("library.backAria"),
									onClick: onClose,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { size: 15 }), t("library.back")]
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.toolbar,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.filters,
									"aria-label": t("library.filterAria"),
									children: [
										["all", "filter.all"],
										["manual", "filter.manual"],
										["url", "filter.url"],
										["document", "filter.document"]
									].map(([id, key]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: filter === id ? views_module_css_default.activeChip : views_module_css_default.chip,
										type: "button",
										"aria-current": filter === id ? "page" : void 0,
										onClick: () => {
											setFilter(id);
										},
										children: t(key)
									}, id))
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.toolbarActions,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											className: views_module_css_default.search,
											value: query,
											onChange: (event) => {
												setQuery(event.target.value);
											},
											placeholder: t("toolbar.search"),
											"aria-label": t("toolbar.searchAria")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
											className: views_module_css_default.select,
											value: sort,
											onChange: (event) => {
												setSort(event.target.value);
											},
											"aria-label": t("toolbar.sortAria"),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "recent",
												children: t("toolbar.sortRecent")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "title",
												children: t("toolbar.sortTitle")
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: views_module_css_default.viewToggle,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.gridView"),
												"aria-pressed": viewMode === "grid",
												"data-active": viewMode === "grid",
												onClick: () => {
													setViewMode("grid");
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutline16, { size: 16 })
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.listView"),
												"aria-pressed": viewMode === "list",
												"data-active": viewMode === "list",
												onClick: () => {
													setViewMode("list");
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 16 })
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.primaryButton,
											type: "button",
											onClick: () => {
												setError(null);
												setComposerOpen(true);
											},
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 15 }), t("action.new")]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.library,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("header", {
										className: views_module_css_default.libraryTitle,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("library.title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("library.itemCount", { count: visible.length }) })] })
									}),
									error === null || composerOpen ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.error,
										role: "alert",
										children: error
									}),
									visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.emptyState,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 22 })
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: query === "" ? t("empty.none") : t("empty.noMatch") }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: query === "" ? t("empty.hintStart") : t("empty.hintNoMatch") }),
											query === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													setComposerOpen(true);
												},
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 15 }), t("action.new")]
											}) : null
										]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: viewMode === "grid" ? views_module_css_default.notebookGrid : views_module_css_default.notebookList,
										"aria-label": t("library.title"),
										children: [viewMode === "grid" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.createCard,
											type: "button",
											onClick: () => {
												setComposerOpen(true);
											},
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 22 }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("action.new") })]
										}) : null, visible.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NotebookCard, {
											entry,
											index,
											list: viewMode === "list",
											t,
											onOpen: () => {
												openNotebook(entry);
											},
											onDelete: () => {
												requestDelete({
													id: entry.id,
													title: entry.title
												});
											}
										}, entry.id))]
									})
								]
							})
						]
					}),
					composerOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NotebookComposer, {
						busy,
						error,
						setBusy,
						t,
						onClose: () => {
							if (!busy) setComposerOpen(false);
						},
						onCreate: async (request) => {
							const entry = await api.create(request);
							setComposerOpen(false);
							await refresh(query);
							openNotebook(entry);
						},
						setError
					}) : null,
					pendingDelete === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
						pending: pendingDelete,
						busy: deleteBusy,
						t,
						onCancel: () => {
							if (!deleteBusy) setPendingDelete(null);
						},
						onConfirm: () => {
							confirmDelete();
						}
					})
				]
			});
		}
		function NotebookCard({ entry, index, list, t, onOpen, onDelete }) {
			const [emoji, title] = splitEmoji(entry.title);
			const job = entry.latestJob;
			const busy = job !== null && (job.status === "pending" || job.status === "running");
			const fetching = busy && job.kind === "summary" && job.stage === "fetch";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.notebookCard,
				"data-list": list || void 0,
				"data-busy": busy || void 0,
				style: { "--card-tint": CARD_TONES[index % CARD_TONES.length] },
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.cardOpen,
						type: "button",
						onClick: onOpen,
						"aria-label": t("card.openAria", { title: entry.title })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.cardEmoji,
						children: emoji || sourceEmoji(entry)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.cardInfo,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: title }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: busy ? fetching ? t("card.fetching") : t("card.summarizing") : entry.summary || entry.content }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
								className: views_module_css_default.spinner,
								size: 11
							}), fetching ? t("overview.fetching", { detail: job.partialText }) : t("overview.summarizing")] }) : t("card.sources", {
								count: entry.sources.length,
								date: formatDate(entry.updatedAt)
							}) })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.deleteButton,
						type: "button",
						"aria-label": t("workspace.delete"),
						onClick: (event) => {
							event.stopPropagation();
							onDelete();
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 15 })
					})
				]
			});
		}
		function NotebookComposer({ busy, error, setBusy, t, onClose, onCreate, setError }) {
			const [title, setTitle] = (0, react.useState)("");
			const [urls, setUrls] = (0, react.useState)("");
			const [content, setContent] = (0, react.useState)("");
			const [documents, setDocuments] = (0, react.useState)([]);
			const empty = title.trim() === "" && urls.trim() === "" && content.trim() === "" && documents.length === 0;
			const submit = (event) => {
				event.preventDefault();
				if (busy || empty) return;
				setBusy(true);
				setError(null);
				const parsedUrls = urls.split("\n").map((item) => item.trim()).filter(Boolean);
				onCreate({
					...title.trim() === "" ? {} : { title: title.trim() },
					...content.trim() === "" ? {} : { content: content.trim() },
					...parsedUrls.length === 0 ? {} : { urls: parsedUrls },
					...documents.length === 0 ? {} : { documents }
				}).catch((cause) => {
					setError(messageOf(cause));
				}).finally(() => {
					setBusy(false);
				});
			};
			const pickFiles = (event) => {
				const files = [...event.target.files ?? []];
				if (files.length === 0) return;
				Promise.all(files.map(async (file) => ({
					name: file.name,
					mimeType: file.type || "text/plain",
					content: await file.text()
				}))).then((next) => {
					setDocuments((current) => [...current, ...next]);
				}, (cause) => {
					setError(messageOf(cause));
				});
				event.target.value = "";
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.modalBackdrop,
				role: "presentation",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: views_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "new-notebook-title",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.modalHeading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 18 })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									id: "new-notebook-title",
									children: t("composer.title")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("composer.subtitle") })] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.iconButton,
								type: "button",
								"aria-label": t("composer.closeAria"),
								disabled: busy,
								onClick: onClose,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 })
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalBody,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [t("composer.titleLabel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: views_module_css_default.input,
									value: title,
									onChange: (event) => {
										setTitle(event.target.value);
									},
									placeholder: t("composer.titlePlaceholder")
								})] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [t("composer.urls"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									className: views_module_css_default.textarea,
									value: urls,
									onChange: (event) => {
										setUrls(event.target.value);
									},
									placeholder: t("composer.urlsPlaceholder")
								})] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [
									t("composer.documents"),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.fileRow,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: views_module_css_default.secondaryButton,
											children: [t("composer.chooseDocuments"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												hidden: true,
												multiple: true,
												type: "file",
												accept: ".txt,.md,text/plain,text/markdown",
												onChange: pickFiles
											})]
										})
									}),
									documents.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: views_module_css_default.fileChips,
										children: documents.map((document, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [document.name, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": document.name,
											onClick: () => {
												setDocuments((current) => current.filter((_, item) => item !== index));
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 12 })
										})] }, `${document.name}-${index}`))
									})
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [t("composer.content"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									autoFocus: true,
									className: views_module_css_default.textarea,
									value: content,
									onChange: (event) => {
										setContent(event.target.value);
									},
									placeholder: t("composer.contentPlaceholder")
								})] }),
								error === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.modalError,
									role: "alert",
									children: error
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalFooter,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("composer.footer") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.secondaryButton,
								type: "button",
								disabled: busy,
								onClick: onClose,
								children: t("action.cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.primaryButton,
								type: "submit",
								disabled: busy || empty,
								children: [busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
									className: views_module_css_default.spinner,
									size: 14
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), busy ? t("action.creating") : t("action.create")]
							})] })]
						})
					]
				})
			});
		}
		function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }) {
			const [, title] = splitEmoji(pending.title);
			const name = title || pending.title;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.confirmBackdrop,
				role: "presentation",
				onClick: () => {
					if (!busy) onCancel();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.confirmCard,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "delete-notebook-title",
					onClick: (event) => {
						event.stopPropagation();
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.confirmMark,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							id: "delete-notebook-title",
							children: t("delete.title")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("delete.body", { title: name }) }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.confirmActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.confirmCancel,
								type: "button",
								disabled: busy,
								onClick: onCancel,
								children: t("action.cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.confirmDelete,
								type: "button",
								disabled: busy,
								onClick: onConfirm,
								children: [busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
									className: views_module_css_default.spinner,
									size: 14
								}) : null, t("delete.confirm")]
							})]
						})
					]
				})
			});
		}
		function NotebookWorkspace({ entry, api, t, onChange, onBack, onDelete, error, setError }) {
			const [sourceDraft, setSourceDraft] = (0, react.useState)("");
			const [studioKind, setStudioKind] = (0, react.useState)("mindmap");
			const [viewingSourceId, setViewingSourceId] = (0, react.useState)(null);
			const [mobilePane, setMobilePane] = (0, react.useState)("summary");
			const [expandMindmap, setExpandMindmap] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const run = (0, react.useCallback)(async (operation) => {
				setBusy(true);
				setError(null);
				try {
					onChange(await operation());
				} catch (cause) {
					setError(messageOf(cause));
				} finally {
					setBusy(false);
				}
			}, [onChange, setError]);
			const addUrls = () => {
				const urls = sourceDraft.split("\n").map((item) => item.trim()).filter(Boolean);
				if (urls.length === 0 || busy) return;
				(async () => {
					let next = entry;
					for (const url of urls) next = await api.addSource({
						id: next.id,
						kind: "url",
						name: hostname(url),
						url
					});
					onChange(next);
					setSourceDraft("");
				})().catch((cause) => {
					setError(messageOf(cause));
				});
			};
			const upload = (event) => {
				const files = [...event.target.files ?? []];
				if (files.length === 0) return;
				(async () => {
					let next = entry;
					const contents = await Promise.all(files.map((file) => file.text()));
					for (let index = 0; index < files.length; index += 1) next = await api.addSource({
						id: next.id,
						kind: "document",
						name: files[index]?.name ?? "Document",
						mimeType: files[index]?.type || "text/plain",
						content: contents[index] ?? ""
					});
					onChange(next);
				})().catch((cause) => {
					setError(messageOf(cause));
				});
				event.target.value = "";
			};
			const job = entry.latestJob;
			const summarizing = job !== null && job.kind === "summary" && (job.status === "pending" || job.status === "running");
			const fetching = summarizing && job.stage === "fetch";
			const generatingStudio = job !== null && job.kind === studioKind && (job.status === "pending" || job.status === "running");
			const artifact = entry.artifacts.find((item) => item.kind === studioKind);
			const summaryDraft = summarizing && !fetching ? job.partialText : "";
			const summaryText = summaryDraft.trim() !== "" ? summaryDraft : entry.summary;
			const studioText = generatingStudio && job.partialText.trim() !== "" ? job.partialText : artifact?.content ?? "";
			const viewing = entry.sources.find((source) => source.id === viewingSourceId) ?? null;
			const jobFailed = job !== null && job.status === "failed" && job.kind === "summary";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.workspace,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: views_module_css_default.workspaceHeader,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.backButton,
								type: "button",
								onClick: onBack,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { size: 15 }), t("workspace.back")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.workspaceHeading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: views_module_css_default.eyebrow,
									children: t("workspace.notebook")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: entry.title })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.deleteText,
								type: "button",
								onClick: onDelete,
								children: t("workspace.delete")
							})
						]
					}),
					error === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.error,
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.mobilePanes,
						role: "tablist",
						"aria-label": t("library.title"),
						children: [
							["sources", "pane.sources"],
							["summary", "pane.summary"],
							["studio", "pane.studio"]
						].map(([id, key]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							className: mobilePane === id ? views_module_css_default.activeChip : views_module_css_default.chip,
							type: "button",
							role: "tab",
							"aria-selected": mobilePane === id,
							onClick: () => {
								setMobilePane(id);
							},
							children: t(key)
						}, id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.workspaceColumns,
						"data-pane": mobilePane,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
								className: views_module_css_default.sourcesPane,
								"data-mobile": mobilePane === "sources" || void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneHeader,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("sources.title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: entry.sources.length })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										className: views_module_css_default.sourceInput,
										value: sourceDraft,
										onChange: (event) => {
											setSourceDraft(event.target.value);
										},
										placeholder: t("sources.urlPlaceholder")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.sourceActions,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.secondaryButton,
											type: "button",
											disabled: busy,
											onClick: addUrls,
											children: t("sources.add")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: views_module_css_default.secondaryButton,
											children: [t("sources.upload"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												hidden: true,
												multiple: true,
												type: "file",
												accept: ".txt,.md,text/plain,text/markdown",
												onChange: upload
											})]
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.sourceList,
										children: entry.sources.map((source) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SourceRow, {
											source,
											t,
											active: source.id === viewingSourceId,
											onOpen: () => {
												setViewingSourceId(source.id);
												setMobilePane("summary");
											},
											onToggle: () => {
												const ids = entry.sources.filter((item) => item.id === source.id ? !item.selected : item.selected).map((item) => item.id);
												run(() => api.selectSources(entry.id, ids));
											},
											onRemove: () => {
												api.removeSource(entry.id, source.id).then((result) => {
													onChange(result.entry);
													if (viewingSourceId === source.id) setViewingSourceId(null);
												}, (cause) => {
													setError(messageOf(cause));
												});
											}
										}, source.id))
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("main", {
								className: views_module_css_default.summaryPane,
								"data-mobile": mobilePane === "summary" || void 0,
								children: viewing === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneHeader,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("overview.title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("overview.hint") })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.iconButton,
											type: "button",
											disabled: busy || summarizing,
											"aria-label": t("overview.resummarize"),
											title: t("overview.resummarize"),
											onClick: () => {
												run(() => api.summarize(entry.id));
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
												className: summarizing ? views_module_css_default.spinner : void 0,
												size: 15
											})
										})]
									}),
									summarizing ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.progress,
										role: "status",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: views_module_css_default.progressBar }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
												className: views_module_css_default.spinner,
												size: 14
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: fetching ? t("overview.fetching", { detail: job.partialText }) : t("overview.summarizing") })
										]
									}) : null,
									jobFailed && !summarizing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.jobError,
										role: "alert",
										children: t("overview.failed", { error: job.errorText || t("overview.empty") })
									}) : null,
									summaryText.trim() === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.emptyPane,
										children: summarizing ? null : t("overview.empty")
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("article", {
										className: views_module_css_default.markdownDocument,
										"data-streaming": summarizing && !fetching || void 0,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
											text: summaryText,
											streaming: summarizing && !fetching
										})
									})
								] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.paneHeader,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("source.original") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: viewing.name })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneActions,
										children: [viewing.url === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
											className: views_module_css_default.secondaryButton,
											href: viewing.url,
											target: "_blank",
											rel: "noreferrer",
											children: [t("sources.openLink"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 13 })]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.secondaryButton,
											type: "button",
											onClick: () => {
												setViewingSourceId(null);
											},
											children: t("overview.title")
										})]
									})]
								}), viewing.content.trim() === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.emptyPane,
									children: viewing.status === "pending_fetch" ? t("sources.pending") : t("source.empty")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("article", {
									className: views_module_css_default.markdownDocument,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: viewing.content })
								})] })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
								className: views_module_css_default.studioPane,
								"data-mobile": mobilePane === "studio" || void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.paneHeader,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("studio.title") })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.studioTabs,
										children: ["mindmap", "report"].map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											className: studioKind === kind ? views_module_css_default.studioTabActive : views_module_css_default.studioTab,
											type: "button",
											onClick: () => {
												setStudioKind(kind);
											},
											children: t(kind === "mindmap" ? "studio.mindmap" : "studio.report")
										}, kind))
									}),
									generatingStudio ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.progress,
										role: "status",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: views_module_css_default.progressBar }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
												className: views_module_css_default.spinner,
												size: 14
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("studio.generating") })
										]
									}) : null,
									studioText.trim() === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.studioEmpty,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: studioKind === "mindmap" ? t("studio.emptyMindmap") : t("studio.emptyReport") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("studio.empty") })]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.artifactPreview,
										children: [studioKind === "mindmap" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.ghostButton,
											type: "button",
											onClick: () => {
												setExpandMindmap(true);
											},
											children: t("studio.expand")
										}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("article", {
											className: views_module_css_default.markdownDocument,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
												text: studioText,
												streaming: generatingStudio
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										className: views_module_css_default.studioGenerate,
										type: "button",
										disabled: busy || generatingStudio || summarizing,
										onClick: () => {
											run(() => api.generateStudio(entry.id, studioKind));
										},
										children: [generatingStudio ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
											className: views_module_css_default.spinner,
											size: 14
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), generatingStudio ? t("studio.generating") : t("studio.generate")]
									})
								]
							})
						]
					}),
					expandMindmap && studioText.trim() !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.confirmBackdrop,
						role: "presentation",
						onClick: () => {
							setExpandMindmap(false);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.expandCard,
							role: "dialog",
							"aria-modal": "true",
							"aria-label": t("studio.mindmap"),
							onClick: (event) => {
								event.stopPropagation();
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("studio.mindmap") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.iconButton,
								type: "button",
								"aria-label": t("composer.closeAria"),
								onClick: () => {
									setExpandMindmap(false);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 })
							})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("article", {
								className: views_module_css_default.markdownDocument,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: studioText })
							})]
						})
					}) : null
				]
			});
		}
		function SourceRow({ source, t, active, onOpen, onToggle, onRemove }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.sourceRow,
				"data-selected": source.selected || void 0,
				"data-active": active || void 0,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: source.selected,
						onChange: onToggle,
						"aria-label": source.name
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: views_module_css_default.sourceOpen,
						type: "button",
						onClick: onOpen,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: source.name }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: source.status === "pending_fetch" ? t("sources.pending") : source.status === "failed" ? t("sources.failed") : source.kind === "url" ? hostname(source.url ?? "") : source.kind })]
					}),
					source.url === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
						className: views_module_css_default.sourceLink,
						href: source.url,
						target: "_blank",
						rel: "noreferrer",
						"aria-label": t("sources.openLink"),
						onClick: (event) => {
							event.stopPropagation();
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 13 })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRemove,
						"aria-label": t("sources.remove"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 })
					})
				]
			});
		}
		const CARD_TONES = [
			"#5b8def",
			"#3d9b8f",
			"#c27a4a",
			"#8b6bc9",
			"#4a9b6e",
			"#b85c7a"
		];
		function splitEmoji(value) {
			const first = Array.from(value.trim())[0] ?? "";
			return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ["", value];
		}
		function sourceEmoji(entry) {
			return entry.sourceType === "url" || entry.sources.some((source) => source.kind === "url") ? "🌐" : entry.sourceType === "document" || entry.sources.some((source) => source.kind === "document") ? "📄" : entry.sourceType === "chat_answer" ? "💬" : "📝";
		}
		function formatDate(value) {
			return new Intl.DateTimeFormat(void 0, {
				month: "short",
				day: "numeric"
			}).format(value);
		}
		function hostname(value) {
			try {
				return new URL(value).hostname.replace(/^www\./u, "");
			} catch {
				return value || "网页资料";
			}
		}
		function messageOf(value) {
			return value instanceof Error ? value.message : String(value);
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/overlay.module.css.mjs
		const css$2 = ".Yz-uwG_overlay{background:var(--dsw-alias-bg-base);pointer-events:auto;flex-direction:column;min-height:0;display:flex;position:absolute;inset:0;overflow:hidden}.Yz-uwG_crash{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:16px;gap:10px;width:min(520px,100% - 48px);margin:auto;padding:22px 24px;display:grid;box-shadow:0 18px 48px #00000029}.Yz-uwG_crash h3{margin:0;font-size:16px;font-weight:620}.Yz-uwG_crash p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.Yz-uwG_crash code{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;word-break:break-word;border-radius:10px;padding:10px 12px;font-size:11px;line-height:1.45}.Yz-uwG_crash button{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border:0;border-radius:10px;justify-self:start;margin-top:4px;padding:8px 14px;font-size:12px;font-weight:600}";
		const tagId$2 = "@deepseek-ai/dsh-notebooks/overlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-notebooks";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var overlay_module_css_default = {
			"crash": "Yz-uwG_crash",
			"overlay": "Yz-uwG_overlay"
		};
		//#endregion
		//#region src/client/NotebooksOverlay.tsx
		/** Frame-wide overlay hosting the notebook library and workspace. */
		/** Keep render failures inside the overlay instead of abdicating the shell slot. */
		var NotebooksViewCrashBoundary = class extends react.Component {
			state = { error: null };
			static getDerivedStateFromError(error) {
				return { error };
			}
			render() {
				if (this.state.error === null) return this.props.children;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: overlay_module_css_default.crash,
					role: "alert",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: this.props.t("overlay.crashTitle") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: this.props.t("overlay.crashHint") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: this.state.error.message }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								this.setState({ error: null });
								this.props.onReset();
							},
							children: this.props.t("overlay.crashBack")
						})
					]
				});
			}
		};
		/** Render the notebook workspace when the sidebar entry opens the overlay. */
		function NotebooksOverlay({ t, ...face }) {
			const open = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getOpen);
			const notebookId = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getNotebookId);
			if (!open) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: overlay_module_css_default.overlay,
				"data-notebooks-overlay": true,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("view.notebooks"),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NotebooksViewCrashBoundary, {
					t,
					onReset: () => {
						face.store.setNotebookId(null);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NotebooksView, {
						t,
						...face.api,
						notebookId,
						onSelectNotebook: (id) => {
							face.store.setNotebookId(id);
						},
						onClose: () => {
							face.store.setOpen(false);
						}
					})
				})
			});
		}
		//#endregion
		//#region src/client/composer-notebook.ts
		/** Remove the notebook occurrence, if any, and return the next insertion offset. */
		function clearNotebookOccurrence(shell) {
			const occurrence = shell.snapshot.occurrences.find((item) => item.source === "notebook");
			if (occurrence === void 0) return shell.snapshot.draft.length;
			shell.setDraft(shell.snapshot.draft.slice(0, occurrence.offset) + shell.snapshot.draft.slice(occurrence.offset + occurrence.length));
			return occurrence.offset;
		}
		/** Insert one notebook mention occurrence at the composer caret tail. */
		function selectNotebookInComposer(hub, sessionId, candidate) {
			const shell = hub.shell(sessionId);
			let offset = clearNotebookOccurrence(shell);
			let snapshot = shell.snapshot;
			if (offset > 0 && snapshot.draft[offset - 1] !== " " && snapshot.draft[offset - 1] !== "\n") {
				shell.setDraft(`${snapshot.draft.slice(0, offset)} ${snapshot.draft.slice(offset)}`);
				offset += 1;
				snapshot = shell.snapshot;
			}
			const span = {
				start: offset,
				end: offset,
				draftRev: snapshot.draftRev
			};
			const mention = candidate.mention;
			return shell.insertReference({
				source: "notebook",
				ref: mention,
				label: candidate.title,
				appearance: "file",
				clipboardText: mention
			}, span);
		}
		/** Clear the selected notebook occurrence from one composer draft. */
		function clearNotebookInComposer(hub, sessionId) {
			const shell = hub.shell(sessionId);
			if (!shell.snapshot.occurrences.some((item) => item.source === "notebook")) return false;
			clearNotebookOccurrence(shell);
			return true;
		}
		/** Whether a notebook can be cited while its overview is still generating. */
		function isNotebookAskBlocked(entry) {
			if (entry.summarizing === true) return true;
			if (((entry.summary?.trim() ?? "") || (entry.latestJob?.resultSummary?.trim() ?? "")) !== "") return false;
			const status = entry.latestJob?.status ?? "";
			return status === "pending" || status === "running";
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/composer-picker.module.css.mjs
		const css$1 = ".AAE8aW_composerPicker{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:14px;width:min(384px,100vw - 24px);overflow:hidden;box-shadow:0 16px 48px #0000002e}.AAE8aW_header{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);padding:12px 14px}.AAE8aW_headerRow{justify-content:space-between;align-items:center;gap:10px;display:flex}.AAE8aW_title{font-size:13px;font-weight:620}.AAE8aW_count{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);color:var(--dsw-alias-label-caption);border-radius:999px;flex:none;padding:2px 8px;font-size:10px;font-weight:600}.AAE8aW_help{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:11px;line-height:1.45}.AAE8aW_search{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-interactive-bg-hover-solid);border-radius:12px;align-items:center;gap:8px;margin-top:10px;padding:0 12px;display:flex}.AAE8aW_searchInput{min-width:0;height:36px;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:0;outline:none;flex:1;font-size:12px}.AAE8aW_searchInput::placeholder{color:var(--dsw-alias-label-caption)}.AAE8aW_list{flex-direction:column;gap:6px;max-height:320px;padding:8px;display:flex;overflow-y:auto}.AAE8aW_empty,.AAE8aW_loading{border:1px dashed var(--dsw-alias-border-l1);color:var(--dsw-alias-label-caption);text-align:center;border-radius:12px;padding:24px 12px;font-size:12px}.AAE8aW_entry{border:1px solid #0000;border-radius:12px;align-items:stretch;gap:4px;padding:2px;transition:background .15s,border-color .15s;display:flex}.AAE8aW_entry:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.AAE8aW_entryActive{border-color:var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent)}.AAE8aW_entryPick{min-width:0;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:10px;flex-direction:column;flex:1;gap:4px;padding:8px 10px;display:flex}.AAE8aW_entryPick:disabled{cursor:default;opacity:.55}.AAE8aW_entryTop{justify-content:space-between;align-items:flex-start;gap:8px;display:flex}.AAE8aW_entryTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:12px;font-weight:620;line-height:1.4;overflow:hidden}.AAE8aW_entryPreview{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:1.45;overflow:hidden}.AAE8aW_badge{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:2px 8px;font-size:10px;font-weight:600}.AAE8aW_entryOpen{width:32px;height:32px;color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;border-radius:10px;flex:none;justify-content:center;align-self:center;align-items:center;display:inline-flex}.AAE8aW_entryOpen:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.AAE8aW_more{color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;border-radius:10px;padding:8px 10px;font-size:12px}.AAE8aW_more:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.AAE8aW_toolButton{width:32px;height:32px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:8px;justify-content:center;align-items:center;display:inline-flex}.AAE8aW_toolButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.AAE8aW_toolButton:disabled{cursor:default;opacity:.45}.AAE8aW_dockChip{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-interactive-bg-hover-solid);max-width:min(100%,280px);color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:6px;padding:4px 8px;font-size:12px;display:inline-flex}.AAE8aW_dockOpen{min-width:0;color:inherit;font:inherit;cursor:pointer;background:0 0;border:0;align-items:center;gap:6px;display:inline-flex}.AAE8aW_dockOpen:hover{color:var(--dsw-alias-label-primary)}.AAE8aW_dockLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.AAE8aW_dockRemove{width:18px;height:18px;color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;border-radius:999px;justify-content:center;align-items:center;display:inline-flex}.AAE8aW_dockRemove:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.AAE8aW_dockError{color:var(--dsw-alias-state-error-primary);font-size:12px}";
		const tagId$1 = "@deepseek-ai/dsh-notebooks/composer-picker.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-notebooks";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var composer_picker_module_css_default = {
			"badge": "AAE8aW_badge",
			"composerPicker": "AAE8aW_composerPicker",
			"count": "AAE8aW_count",
			"dockChip": "AAE8aW_dockChip",
			"dockError": "AAE8aW_dockError",
			"dockLabel": "AAE8aW_dockLabel",
			"dockOpen": "AAE8aW_dockOpen",
			"dockRemove": "AAE8aW_dockRemove",
			"empty": "AAE8aW_empty",
			"entry": "AAE8aW_entry",
			"entryActive": "AAE8aW_entryActive",
			"entryOpen": "AAE8aW_entryOpen",
			"entryPick": "AAE8aW_entryPick",
			"entryPreview": "AAE8aW_entryPreview",
			"entryTitle": "AAE8aW_entryTitle",
			"entryTop": "AAE8aW_entryTop",
			"header": "AAE8aW_header",
			"headerRow": "AAE8aW_headerRow",
			"help": "AAE8aW_help",
			"list": "AAE8aW_list",
			"loading": "AAE8aW_loading",
			"more": "AAE8aW_more",
			"search": "AAE8aW_search",
			"searchInput": "AAE8aW_searchInput",
			"title": "AAE8aW_title",
			"toolButton": "AAE8aW_toolButton"
		};
		//#endregion
		//#region src/client/NotebooksComposerButton.tsx
		/** Codemini-style notebook picker launched from the composer tool row. */
		const PAGE_SIZE = 12;
		const VIEWPORT_MARGIN = 12;
		/** Render the notebook launcher button and searchable picker popover. */
		function NotebooksComposerButton({ sessionId, input, t, api, selectNotebook, openNotebook }) {
			const anchorRef = (0, react.useRef)(null);
			const panelRef = (0, react.useRef)(null);
			const [open, setOpen] = (0, react.useState)(false);
			const [query, setQuery] = (0, react.useState)("");
			const [entries, setEntries] = (0, react.useState)([]);
			const [loading, setLoading] = (0, react.useState)(false);
			const [visibleCount, setVisibleCount] = (0, react.useState)(PAGE_SIZE);
			const [error, setError] = (0, react.useState)("");
			const [fixedPos, setFixedPos] = (0, react.useState)(null);
			const locked = input.phase === "adjudicating" || input.phase === "submitting" || input.phase === "claimed";
			const activeOccurrence = input.occurrences.find((item) => item.source === "notebook");
			const filtered = (0, react.useMemo)(() => {
				const needle = query.trim().toLocaleLowerCase();
				if (needle === "") return entries;
				return entries.filter((entry) => [
					entry.title,
					entry.summary,
					entry.mention
				].join("\n").toLocaleLowerCase().includes(needle));
			}, [entries, query]);
			const visible = filtered.slice(0, visibleCount);
			const hasMore = filtered.length > visible.length;
			const loadEntries = (0, react.useCallback)(async () => {
				setLoading(true);
				try {
					setEntries(await api.candidates(""));
				} catch {
					setEntries([]);
				} finally {
					setLoading(false);
				}
			}, [api]);
			(0, react.useEffect)(() => {
				if (!open) return;
				loadEntries();
			}, [open, loadEntries]);
			(0, react.useLayoutEffect)(() => {
				if (!open) {
					setFixedPos(null);
					return;
				}
				const place = () => {
					const anchor = anchorRef.current?.getBoundingClientRect();
					if (anchor === void 0) return;
					const panel = panelRef.current;
					const width = panel?.offsetWidth ?? 384;
					const height = panel?.offsetHeight ?? 320;
					let left = anchor.left;
					let top = anchor.top - height - 8;
					left = Math.min(Math.max(left, VIEWPORT_MARGIN), window.innerWidth - width - VIEWPORT_MARGIN);
					top = Math.min(Math.max(top, VIEWPORT_MARGIN), window.innerHeight - height - VIEWPORT_MARGIN);
					setFixedPos({
						left,
						top
					});
				};
				place();
				window.addEventListener("scroll", place, true);
				window.addEventListener("resize", place);
				return () => {
					window.removeEventListener("scroll", place, true);
					window.removeEventListener("resize", place);
				};
			}, [
				open,
				loading,
				filtered.length,
				visible.length
			]);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onPointerDown = (event) => {
					if (!(event.target instanceof Node)) return;
					if (anchorRef.current?.contains(event.target)) return;
					if (panelRef.current?.contains(event.target)) return;
					setOpen(false);
				};
				const onKeyDown = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("pointerdown", onPointerDown);
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("pointerdown", onPointerDown);
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [open]);
			const pickEntry = (entry) => {
				if (isNotebookAskBlocked(entry)) {
					setError(t("picker.summaryPending"));
					return;
				}
				if (!selectNotebook(sessionId, entry)) {
					setError(t("picker.selectFailed"));
					return;
				}
				setError("");
				setOpen(false);
			};
			const panel = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: panelRef,
				className: composer_picker_module_css_default.composerPicker,
				role: "dialog",
				"aria-label": t("picker.title"),
				style: fixedPos === null ? {
					visibility: "hidden",
					position: "fixed",
					left: 0,
					top: 0
				} : {
					position: "fixed",
					left: fixedPos.left,
					top: fixedPos.top,
					zIndex: 120
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: composer_picker_module_css_default.header,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: composer_picker_module_css_default.headerRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: composer_picker_module_css_default.title,
								children: t("picker.title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: composer_picker_module_css_default.count,
								children: filtered.length
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: composer_picker_module_css_default.help,
							children: t("picker.help")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: composer_picker_module_css_default.search,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 14 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: composer_picker_module_css_default.searchInput,
								type: "search",
								value: query,
								onChange: (event) => {
									setQuery(event.target.value);
									setVisibleCount(PAGE_SIZE);
								},
								placeholder: t("picker.search"),
								"aria-label": t("picker.search")
							})]
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: composer_picker_module_css_default.list,
					children: loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: composer_picker_module_css_default.loading,
						children: t("picker.loading")
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: composer_picker_module_css_default.empty,
						children: t("picker.empty")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [visible.map((entry) => {
						const blocked = isNotebookAskBlocked(entry);
						const active = activeOccurrence?.clipboardText === entry.mention || activeOccurrence?.ref === entry.mention;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: active ? `${composer_picker_module_css_default.entry} ${composer_picker_module_css_default.entryActive}` : composer_picker_module_css_default.entry,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: composer_picker_module_css_default.entryPick,
								disabled: blocked,
								onClick: () => {
									pickEntry(entry);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: composer_picker_module_css_default.entryTop,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.entryTitle,
										children: entry.title
									}), active ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.badge,
										children: t("picker.active")
									}) : blocked ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.badge,
										children: t("picker.summarizing")
									}) : null]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: composer_picker_module_css_default.entryPreview,
									children: entry.summary
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: composer_picker_module_css_default.entryOpen,
								title: t("cite.open"),
								"aria-label": `${t("cite.open")}: ${entry.title}`,
								onClick: () => {
									openNotebook(entry.id);
									setOpen(false);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 15 })
							})]
						}, entry.id);
					}), hasMore ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: composer_picker_module_css_default.more,
						onClick: () => {
							setVisibleCount((count) => count + PAGE_SIZE);
						},
						children: t("picker.showMore", { count: String(filtered.length - visible.length) })
					}) : null] })
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					ref: anchorRef,
					type: "button",
					className: composer_picker_module_css_default.toolButton,
					title: t("picker.title"),
					"aria-label": t("picker.title"),
					"aria-expanded": open,
					disabled: locked,
					onClick: () => {
						if (locked) return;
						setOpen((value) => !value);
						if (!open) {
							setQuery("");
							setVisibleCount(PAGE_SIZE);
							setError("");
						}
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 18 })
				}),
				open && typeof document !== "undefined" ? (0, react_dom.createPortal)(panel, document.body) : null,
				error === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: composer_picker_module_css_default.dockError,
					children: error
				})
			] });
		}
		//#endregion
		//#region src/client/NotebooksComposerDock.tsx
		/** Show the active notebook cite chip when the composer holds one occurrence. */
		function NotebooksComposerDock({ sessionId, input, t, clearNotebook, openNotebook }) {
			const occurrence = input.occurrences.find((item) => item.source === "notebook");
			if (occurrence === void 0) return null;
			const notebookId = parseNotebookMentions(occurrence.clipboardText).ids[0];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: composer_picker_module_css_default.dockChip,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: composer_picker_module_css_default.dockOpen,
					title: t("cite.open"),
					"aria-label": `${t("cite.open")}: ${occurrence.label}`,
					onClick: () => {
						if (notebookId !== void 0) openNotebook(notebookId);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 14 }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: composer_picker_module_css_default.dockLabel,
							children: occurrence.label
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 11 })
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: composer_picker_module_css_default.dockRemove,
					title: t("picker.remove"),
					"aria-label": t("picker.remove"),
					onClick: () => {
						clearNotebook(sessionId);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 11 })
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/notebook-cite.module.css.mjs
		const css = ".GLdToW_row{justify-content:flex-end;padding:0 16px 4px;display:flex}.GLdToW_chip{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-interactive-bg-hover-solid);max-width:min(100%,320px);color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:999px;align-items:center;gap:6px;padding:4px 10px;font-family:inherit;font-size:12px;line-height:1.4;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.GLdToW_chip:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.GLdToW_label{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.GLdToW_external{opacity:.7;flex:none}[data-chat-flow-kind=notebook-cite]+[data-chat-flow-kind=context]{display:none}";
		const tagId = "@deepseek-ai/dsh-notebooks/notebook-cite.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-notebooks";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var notebook_cite_module_css_default = {
			"chip": "GLdToW_chip",
			"external": "GLdToW_external",
			"label": "GLdToW_label",
			"row": "GLdToW_row"
		};
		//#endregion
		//#region src/client/NotebooksCiteChip.tsx
		/** Render one notebook cite chip that opens the overlay workspace. */
		function NotebooksCiteChip({ node, t, store }) {
			const data = node.data;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: notebook_cite_module_css_default.row,
				"data-notebooks-cite": data.notebookId,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: notebook_cite_module_css_default.chip,
					title: t("cite.open"),
					"aria-label": `${t("cite.open")}: ${data.title}`,
					onClick: () => {
						store.setNotebookId(data.notebookId);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 14 }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: notebook_cite_module_css_default.label,
							children: data.title
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, {
							size: 12,
							className: notebook_cite_module_css_default.external
						})
					]
				})
			});
		}
		function isAppendUserMessage(event) {
			return event.type === "user/message" && event.surfaceOp === "append";
		}
		function textFromContent(content) {
			return content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
		}
		function readSourceField(source, key) {
			if (typeof source !== "object" || source === null) return void 0;
			const value = source[key];
			return typeof value === "string" && value.trim() !== "" ? value : void 0;
		}
		function citeFromPluginSource(source, content) {
			if (readSourceField(source, "kind") !== "plugin") return null;
			if (readSourceField(source, "plugin") !== "@deepseek-ai/dsh-notebooks") return null;
			const notebookId = readSourceField(source, "notebookId");
			const notebookTitle = readSourceField(source, "notebookTitle");
			if (notebookId !== void 0) return {
				notebookId,
				title: notebookTitle ?? notebookId
			};
			const text = textFromContent(content);
			const idMatch = text.match(/^Entry ID:\s*(.+)$/m);
			if (idMatch?.[1] === void 0) return null;
			const titleMatch = text.match(/^Title:\s*(.+)$/m);
			return {
				notebookId: idMatch[1].trim(),
				title: titleMatch?.[1]?.trim() || idMatch[1].trim()
			};
		}
		function citeFromUserMessage(content) {
			const parsed = parseNotebookMentions(textFromContent(content));
			const id = parsed.ids[0];
			if (id === void 0) return null;
			return {
				notebookId: id,
				title: parsed.text.match(/@([^\n]+)/u)?.[1]?.trim() ?? id
			};
		}
		function messageData(data) {
			if (typeof data !== "object" || data === null) return null;
			return data;
		}
		/** Extract a notebook cite from one user/message event, or null. */
		function citeFromMessageEvent(event) {
			if (event.type !== "user/message") return null;
			const data = messageData(event.data);
			if (data === null) return null;
			const content = data.content ?? [];
			return citeFromPluginSource(data.source, content) ?? citeFromUserMessage(content);
		}
		/** Fold citing notebook context into one anchored chip under the user bubble. */
		const notebookCiteDefinition = {
			kind: "notebook-cite",
			target: "chat",
			match: (event) => {
				if (!isAppendUserMessage(event)) return null;
				const cite = citeFromMessageEvent(event);
				if (cite === null) return null;
				return {
					id: `${cite.notebookId}:${String(event.seq)}`,
					role: "start"
				};
			},
			start: (_context, match) => {
				const cite = citeFromMessageEvent(match.event);
				if (cite === null) throw new Error("notebook-cite requires a notebook mention");
				return {
					...cite,
					seq: match.event.seq
				};
			},
			update: (context) => context.state,
			buildViewNode: (context) => {
				if (context.state === void 0) return null;
				const seq = context.state.seq;
				const sourceKind = readSourceField(messageData(context.start?.event.data)?.source, "kind");
				return {
					key: context.key,
					kind: "notebook-cite",
					id: context.id,
					target: "chat",
					anchorSeq: sourceKind === "plugin" ? seq - .1 : seq + .1,
					location: context.start?.location ?? { kind: "unresolved" },
					visibility: "visible",
					data: {
						notebookId: context.state.notebookId,
						title: context.state.title
					}
				};
			}
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services: Remote client, slots, locale, sessions, and optional triggers. */
		const inject = [
			"remote",
			"slots",
			"locale",
			"sessions",
			"inputTriggers"
		];
		/** Return one successful Remote value or surface the carrier failure. */
		function remoteValue(operation, result) {
			if (!result.ok) throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
			return result.value;
		}
		function createApi(clientRemote, notebooks) {
			return {
				list: async (query) => remoteValue("notebooks.list", await notebooks.list({ ...query === "" ? {} : { query } })).entries.map(hydrateNotebook),
				get: async (id) => {
					const entry = remoteValue("notebooks.get", await notebooks.get({ id }));
					return entry === null ? null : hydrateNotebook(entry);
				},
				put: async (request) => hydrateNotebook(remoteValue("notebooks.put", await notebooks.put(request))),
				create: async (request) => hydrateNotebook(remoteValue("notebooks.create", await notebooks.create(request))),
				addSource: async (request) => hydrateNotebook(remoteValue("notebooks.addSource", await notebooks.addSource(request))),
				selectSources: async (id, sourceIds) => hydrateNotebook(remoteValue("notebooks.setSourceSelection", await notebooks.setSourceSelection({
					id,
					sourceIds
				}))),
				removeSource: async (id, sourceId) => {
					const result = remoteValue("notebooks.removeSource", await notebooks.removeSource({
						id,
						sourceId
					}));
					return {
						...result,
						entry: hydrateNotebook(result.entry)
					};
				},
				setSummary: async (id, summary) => hydrateNotebook(remoteValue("notebooks.setSummary", await notebooks.setSummary({
					id,
					summary
				}))),
				setArtifact: async (request) => hydrateNotebook(remoteValue("notebooks.setArtifact", await notebooks.setArtifact(request))),
				summarize: async (id) => hydrateNotebook(remoteValue("notebooks.summarize", await notebooks.summarize({ id }))),
				generateStudio: async (id, kind) => hydrateNotebook(remoteValue("notebooks.generateStudio", await notebooks.generateStudio({
					id,
					kind
				}))),
				saveChatAnswer: async (request) => hydrateNotebook(remoteValue("notebooks.saveChatAnswer", await notebooks.saveChatAnswer(request))),
				candidates: async (query) => remoteValue("notebooks.candidates", await notebooks.candidates({ ...query === "" ? {} : { query } })).candidates,
				delete: async (id) => remoteValue("notebooks.delete", await notebooks.delete({ id })),
				subscribeProgress: (listener) => clientRemote.$on("notebooks/progress", (entry) => {
					listener(hydrateNotebook(entry));
				})
			};
		}
		function conversationInputHub(ctx) {
			return ctx.get("conversation")?.input;
		}
		function registerMentionSource(ctx) {
			const inputTriggers = ctx.inputTriggers;
			if (inputTriggers === void 0) return;
			const t = ctx.locale.bind(NS);
			const source = {
				trigger: "@",
				name: "notebook",
				order: 30,
				showGroupTitle: false,
				async candidates(_session, { query, signal }) {
					const result = await ctx.remote.notebooks.candidates({ ...query === "" ? {} : { query } });
					if (signal.aborted || !result.ok) return [];
					return result.value.candidates.map((candidate) => ({
						name: candidate.title,
						description: candidate.summary,
						section: t("mention.section"),
						value: JSON.stringify({
							id: candidate.id,
							title: candidate.title,
							mention: candidate.mention
						})
					}));
				},
				onPick({ candidate }) {
					const value = parseCandidate(candidate.value);
					if (value === void 0) return void 0;
					const mention = value.mention || formatNotebookMention(NotebookId(value.id), value.title);
					return { insert: {
						source: "notebook",
						ref: mention,
						label: value.title,
						appearance: "file",
						clipboardText: mention
					} };
				},
				codec: {
					clipboardText: (ref) => ref,
					serialize: (ref) => Promise.resolve(ref)
				}
			};
			ctx.effect(() => inputTriggers.registerSource(source), "notebooks: @ source");
		}
		function parseCandidate(value) {
			if (value === void 0) return void 0;
			return JSON.parse(value);
		}
		function registerConversationSurfaces(ctx, slots, face) {
			const conversationEvents = ctx.get("conversationEvents");
			if (conversationEvents === void 0) return;
			conversationEvents.register(notebookCiteDefinition);
			slots.inject("conversation.chat.node", () => slots.register({
				name: "conversation.chat.node",
				key: "notebook-cite",
				locale: NS,
				inject: face
			}, NotebooksCiteChip));
		}
		/**
		* Mount the notebook Remote namespace and its global sidebar/overlay surfaces.
		* @param ctx - Web client root carrying Remote, slot, and locale services.
		* @returns disposer after the namespace is ready.
		*/
		async function apply(ctx) {
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "notebooks: dictionaries");
			const store = createNotebooksUiStore();
			registerMentionSource(ctx);
			const view = ctx.inject(["remote.notebooks", "slots"], (remoteCtx) => {
				const api = createApi(ctx.remote, remoteCtx.remote.notebooks);
				const face = () => ({
					store,
					api
				});
				const composerFace = () => ({
					store,
					api,
					selectNotebook: (id, candidate) => {
						const hub = conversationInputHub(ctx);
						if (hub === void 0) return false;
						return selectNotebookInComposer(hub, id, candidate);
					},
					clearNotebook: (id) => {
						const hub = conversationInputHub(ctx);
						if (hub === void 0) return false;
						return clearNotebookInComposer(hub, id);
					},
					openNotebook: (notebookId) => {
						store.setNotebookId(notebookId);
					}
				});
				registerConversationSurfaces(ctx, remoteCtx.slots, face);
				remoteCtx.slots.inject("sidebar.footer.action", () => remoteCtx.slots.register({
					name: "sidebar.footer.action",
					id: "notebooks",
					order: 30,
					locale: NS,
					inject: face
				}, NotebooksSidebarEntry));
				remoteCtx.slots.inject("shell.overlay", () => remoteCtx.slots.register({
					name: "shell.overlay",
					id: "notebooks",
					order: 30,
					locale: NS,
					inject: face
				}, NotebooksOverlay));
				remoteCtx.slots.inject("conversation.input.left", () => remoteCtx.slots.register({
					name: "conversation.input.left",
					id: "notebooks",
					order: 30,
					locale: NS,
					inject: (sessionId) => ({
						...composerFace(),
						sessionId
					})
				}, NotebooksComposerButton));
				remoteCtx.slots.inject("conversation.input.dock", () => remoteCtx.slots.register({
					name: "conversation.input.dock",
					id: "notebooks",
					order: 25,
					locale: NS,
					inject: (sessionId) => ({
						...composerFace(),
						sessionId
					})
				}, NotebooksComposerDock));
			});
			await view;
			return async () => {
				await view.dispose();
				await disposeRemote();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map