import { randomUUID } from "node:crypto";
import { Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { GatewayService, Remote } from "@deepseek-ai/dsh-type-meta";
import { z } from "zod";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
//#region lib/types/types.js
/** Public wire values for durable Codemini-style notebooks. */
/**
* Construct a notebook identity at its owning boundary.
* @param value - persisted or wire identity.
* @returns branded notebook identity.
*/
const NotebookId = (value) => value;
/**
* Construct a notebook source identity at its owning boundary.
* @param value - persisted or wire identity.
* @returns branded source identity.
*/
const NotebookSourceId = (value) => value;
//#endregion
//#region lib/types/spec.js
/** Durable storage declaration for notebooks. */
/** Stored notebook source schema. */
const notebookSourceSchema = z.object({
	id: z.string().transform(NotebookSourceId),
	kind: z.enum([
		"manual",
		"url",
		"document",
		"chat_answer"
	]),
	name: z.string(),
	url: z.string().nullable(),
	mimeType: z.string().nullable(),
	content: z.string(),
	selected: z.boolean(),
	createdAt: z.number()
});
/** Stored Studio artifact schema. */
const notebookArtifactSchema = z.object({
	kind: z.enum(["mindmap", "report"]),
	content: z.string(),
	updatedAt: z.number()
});
/** Stored notebook record schema. */
const notebookEntrySchema = z.object({
	id: z.string().transform(NotebookId),
	title: z.string(),
	content: z.string(),
	summary: z.string(),
	tags: z.array(z.string()),
	sources: z.array(notebookSourceSchema),
	artifacts: z.array(notebookArtifactSchema),
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Global notebook store shared by Sessions. */
const notebooksDomainSpec = defineDomain({
	name: "notebooks",
	version: 2,
	tables: { entries: domainTable(notebookEntrySchema) }
});
//#endregion
//#region lib/types/index.js
/**
* Cross-session notebook workspace with sources, summaries, Studio artifacts,
* model tools, and a typed Remote API.
* @module @deepseek-ai/dsh-notebooks
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
const ENTRY_SCHEMA = {
	type: "object",
	additionalProperties: false,
	properties: {
		id: {
			type: "string",
			required: true
		},
		title: {
			type: "string",
			required: true
		},
		content: {
			type: "string",
			required: true
		},
		summary: {
			type: "string",
			required: true
		},
		tags: {
			type: "array",
			required: true,
			items: { type: "string" }
		},
		sources: {
			type: "array",
			required: true,
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					id: {
						type: "string",
						required: true
					},
					kind: {
						type: "string",
						required: true,
						enum: [
							"manual",
							"url",
							"document",
							"chat_answer"
						]
					},
					name: {
						type: "string",
						required: true
					},
					url: {
						required: true,
						oneOf: [{ type: "string" }, { type: "null" }]
					},
					mimeType: {
						required: true,
						oneOf: [{ type: "string" }, { type: "null" }]
					},
					content: {
						type: "string",
						required: true
					},
					selected: {
						type: "boolean",
						required: true
					},
					createdAt: {
						type: "number",
						required: true
					}
				}
			}
		},
		artifacts: {
			type: "array",
			required: true,
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					kind: {
						type: "string",
						required: true,
						enum: ["mindmap", "report"]
					},
					content: {
						type: "string",
						required: true
					},
					updatedAt: {
						type: "number",
						required: true
					}
				}
			}
		},
		createdAt: {
			type: "number",
			required: true
		},
		updatedAt: {
			type: "number",
			required: true
		}
	}
};
/** Durable notebook service. */
let NotebooksService = (() => {
	let _classSuper = GatewayService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _get_decorators;
	let _put_decorators;
	let _addSource_decorators;
	let _setSourceSelection_decorators;
	let _removeSource_decorators;
	let _setSummary_decorators;
	let _setArtifact_decorators;
	let _delete_decorators;
	return class NotebooksService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_get_decorators = [Remote("get")];
			_put_decorators = [Remote("put")];
			_addSource_decorators = [Remote("addSource")];
			_setSourceSelection_decorators = [Remote("setSourceSelection")];
			_removeSource_decorators = [Remote("removeSource")];
			_setSummary_decorators = [Remote("setSummary")];
			_setArtifact_decorators = [Remote("setArtifact")];
			_delete_decorators = [Remote("delete")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _get_decorators, {
				kind: "method",
				name: "get",
				static: false,
				private: false,
				access: {
					has: (obj) => "get" in obj,
					get: (obj) => obj.get
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _put_decorators, {
				kind: "method",
				name: "put",
				static: false,
				private: false,
				access: {
					has: (obj) => "put" in obj,
					get: (obj) => obj.put
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _addSource_decorators, {
				kind: "method",
				name: "addSource",
				static: false,
				private: false,
				access: {
					has: (obj) => "addSource" in obj,
					get: (obj) => obj.addSource
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setSourceSelection_decorators, {
				kind: "method",
				name: "setSourceSelection",
				static: false,
				private: false,
				access: {
					has: (obj) => "setSourceSelection" in obj,
					get: (obj) => obj.setSourceSelection
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _removeSource_decorators, {
				kind: "method",
				name: "removeSource",
				static: false,
				private: false,
				access: {
					has: (obj) => "removeSource" in obj,
					get: (obj) => obj.removeSource
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setSummary_decorators, {
				kind: "method",
				name: "setSummary",
				static: false,
				private: false,
				access: {
					has: (obj) => "setSummary" in obj,
					get: (obj) => obj.setSummary
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setArtifact_decorators, {
				kind: "method",
				name: "setArtifact",
				static: false,
				private: false,
				access: {
					has: (obj) => "setArtifact" in obj,
					get: (obj) => obj.setArtifact
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _delete_decorators, {
				kind: "method",
				name: "delete",
				static: false,
				private: false,
				access: {
					has: (obj) => "delete" in obj,
					get: (obj) => obj.delete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		static inject = ["storageDomain", "tools"];
		/** Loader validation for deployment-varying notebook limits. */
		static Config = s.object({
			maxEntries: s.number().step(1).min(1).required(),
			maxContentChars: s.number().step(1).min(1).required(),
			maxSourcesPerEntry: s.number().step(1).min(1).required(),
			maxSourceChars: s.number().step(1).min(1).required(),
			maxArtifactChars: s.number().step(1).min(1).required()
		});
		table;
		mutationTail = Promise.resolve();
		/** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and content limits. */
		constructor(ctx, config) {
			super(ctx, "notebooks");
			this.config = config;
		}
		/** Open durable storage and publish notebook Tools. */
		async [Service.init]() {
			const domain = await this.ctx.storageDomain.open(notebooksDomainSpec);
			this.ctx.effect(() => () => domain.close(), "notebooks.domainClose");
			this.table = domain.table("entries");
			this.registerTools();
		}
		/**
		* List entries matching optional text, tag, and source filters.
		* @param request - optional notebook filters.
		* @returns matching entries ordered by newest edit.
		*/
		list(request) {
			const query = request.query?.trim().toLocaleLowerCase();
			const tag = request.tag?.trim().toLocaleLowerCase();
			return { entries: [...this.requireTable().entries()].map(([, entry]) => snapshot(entry)).filter((entry) => query === void 0 || query === "" || searchableText(entry).includes(query)).filter((entry) => tag === void 0 || tag === "" || entry.tags.some((candidate) => candidate.toLocaleLowerCase() === tag)).filter((entry) => request.sourceKind === void 0 || entry.sources.some((source) => source.kind === request.sourceKind)).sort((left, right) => right.updatedAt - left.updatedAt) };
		}
		/**
		* Read one exact notebook.
		* @param request - notebook identity to read.
		* @returns detached notebook data, or null when absent.
		*/
		get(request) {
			const entry = this.requireTable().get(request.id);
			return entry === void 0 ? null : snapshot(entry);
		}
		/**
		* Create or replace a notebook after validating configured limits.
		* @param request - complete notebook write request.
		* @returns the detached stored notebook.
		*/
		put(request) {
			return this.enqueue(async () => {
				const title = requiredText(request.title, "title");
				const content = requiredText(request.content, "content");
				this.assertLength(content, this.config.maxContentChars, "content");
				const table = this.requireTable();
				const id = request.id ?? NotebookId(`note-${randomUUID()}`);
				const current = table.get(id);
				if (current === void 0 && table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
				const now = Date.now();
				const entry = snapshot({
					id,
					title,
					content,
					summary: request.summary?.trim() ?? current?.summary ?? "",
					tags: normalizeTags(request.tags ?? current?.tags ?? []),
					sources: current?.sources ?? [manualSource(title, content, now)],
					artifacts: current?.artifacts ?? [],
					createdAt: current?.createdAt ?? now,
					updatedAt: current === void 0 ? now : Math.max(now, current.updatedAt + 1)
				});
				await table.put(id, entry);
				return snapshot(entry);
			});
		}
		/**
		* Attach a selected source to a notebook.
		* @param request - source content and owning notebook identity.
		* @returns the updated detached notebook.
		*/
		addSource(request) {
			return this.update(request.id, (entry) => {
				if (entry.sources.length >= this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`);
				const content = requiredText(request.content, "source content");
				this.assertLength(content, this.config.maxSourceChars, "source content");
				const source = {
					id: NotebookSourceId(`source-${randomUUID()}`),
					kind: request.kind,
					name: requiredText(request.name, "source name"),
					url: optionalText(request.url),
					mimeType: optionalText(request.mimeType),
					content,
					selected: true,
					createdAt: Date.now()
				};
				return {
					...entry,
					sources: [...entry.sources, source]
				};
			});
		}
		/**
		* Replace the source selection used for summaries and Studio artifacts.
		* @param request - owning notebook and selected source identities.
		* @returns the updated detached notebook.
		*/
		setSourceSelection(request) {
			return this.update(request.id, (entry) => {
				const selected = new Set(request.sourceIds);
				const known = new Set(entry.sources.map((source) => source.id));
				for (const id of selected) if (!known.has(id)) throw new Error(`notebooks: source ${id} not found`);
				return {
					...entry,
					sources: entry.sources.map((source) => ({
						...source,
						selected: selected.has(source.id)
					}))
				};
			});
		}
		/**
		* Remove one source and report whether it existed.
		* @param request - notebook and source identities.
		* @returns the removal outcome and updated notebook.
		*/
		removeSource(request) {
			let removed = false;
			return this.update(request.id, (entry) => {
				const sources = entry.sources.filter((source) => source.id !== request.sourceId);
				removed = sources.length !== entry.sources.length;
				return {
					...entry,
					sources
				};
			}).then((entry) => ({
				removed,
				entry
			}));
		}
		/**
		* Replace the overview synthesized from selected sources.
		* @param request - notebook identity and new overview.
		* @returns the updated detached notebook.
		*/
		setSummary(request) {
			return this.update(request.id, (entry) => ({
				...entry,
				summary: requiredText(request.summary, "summary")
			}));
		}
		/**
		* Create or replace a report or Mermaid mind-map artifact.
		* @param request - notebook identity and Studio artifact content.
		* @returns the updated detached notebook.
		*/
		setArtifact(request) {
			return this.update(request.id, (entry) => {
				const content = requiredText(request.content, `${request.kind} content`);
				this.assertLength(content, this.config.maxArtifactChars, `${request.kind} content`);
				const artifact = {
					kind: request.kind,
					content,
					updatedAt: Date.now()
				};
				return {
					...entry,
					artifacts: [...entry.artifacts.filter((item) => item.kind !== request.kind), artifact]
				};
			});
		}
		/**
		* Delete an entry; absence is a successful stable outcome.
		* @param request - notebook identity to delete.
		* @returns whether the notebook existed.
		*/
		delete(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const deleted = table.get(request.id) !== void 0;
				if (deleted) await table.delete(request.id);
				return { deleted };
			});
		}
		registerTools() {
			this.ctx.tools.register(defineTool({
				name: "notebook_list",
				description: "Search durable notebooks, their summaries, and attached source text.",
				parameters: {
					query: { type: "string" },
					tag: { type: "string" }
				},
				output: {
					schema: {
						type: "object",
						additionalProperties: false,
						properties: { entries: {
							type: "array",
							required: true,
							items: ENTRY_SCHEMA
						} }
					},
					render: (_args, value) => [{
						type: "text",
						text: value.entries.length === 0 ? "No notebooks matched." : value.entries.map((entry) => `- ${entry.title} (${entry.id})\n  ${entry.summary || entry.content}`).join("\n")
					}]
				},
				execute: (args) => Promise.resolve(this.list(args)),
				presentCall: (args) => ({
					card: "generic",
					kind: "search",
					title: "Search notebooks",
					rawInput: args.query ?? args.tag
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "notebook_write",
				description: "Create or update a durable notebook entry.",
				parameters: {
					id: { type: "string" },
					title: {
						type: "string",
						required: true
					},
					content: {
						type: "string",
						required: true
					},
					summary: { type: "string" },
					tags: {
						type: "array",
						items: { type: "string" }
					}
				},
				output: {
					schema: ENTRY_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Saved notebook "${value.title}" (${value.id}).`
					}]
				},
				execute: (args) => this.put({
					title: args.title,
					content: args.content,
					...args.summary === void 0 ? {} : { summary: args.summary },
					...args.tags === void 0 ? {} : { tags: args.tags },
					...args.id === void 0 ? {} : { id: NotebookId(args.id) }
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: args.id === void 0 ? "Create notebook" : "Update notebook",
					rawInput: args.title
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "notebook_add_source",
				description: "Attach source text after reading a URL, document, conversation answer, or manual note.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
					kind: {
						type: "string",
						required: true,
						enum: [
							"manual",
							"url",
							"document",
							"chat_answer"
						]
					},
					name: {
						type: "string",
						required: true
					},
					url: { type: "string" },
					mimeType: { type: "string" },
					content: {
						type: "string",
						required: true
					}
				},
				output: {
					schema: ENTRY_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Notebook ${value.id} now has ${value.sources.length} sources.`
					}]
				},
				execute: (args) => this.addSource({
					...args,
					id: NotebookId(args.id)
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Add notebook source",
					rawInput: args.name
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "notebook_set_summary",
				description: "Save an evidence-grounded overview of the notebook selected sources.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
					summary: {
						type: "string",
						required: true
					}
				},
				output: {
					schema: ENTRY_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Updated summary for ${value.id}.`
					}]
				},
				execute: (args) => this.setSummary({
					id: NotebookId(args.id),
					summary: args.summary
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Update notebook summary",
					rawInput: args.id
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "notebook_set_artifact",
				description: "Save a Markdown report or Mermaid mind map derived from selected notebook sources.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
					kind: {
						type: "string",
						required: true,
						enum: ["mindmap", "report"]
					},
					content: {
						type: "string",
						required: true
					}
				},
				output: {
					schema: ENTRY_SCHEMA,
					render: (args, value) => [{
						type: "text",
						text: `Saved ${args.kind} for ${value.id}.`
					}]
				},
				execute: (args) => this.setArtifact({
					id: NotebookId(args.id),
					kind: args.kind,
					content: args.content
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Update notebook Studio",
					rawInput: args.kind
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "notebook_delete",
				description: "Delete one durable notebook by exact id.",
				parameters: { id: {
					type: "string",
					required: true
				} },
				output: {
					schema: {
						type: "object",
						additionalProperties: false,
						properties: { deleted: {
							type: "boolean",
							required: true
						} }
					},
					render: (args, value) => [{
						type: "text",
						text: value.deleted ? `Deleted notebook ${args.id}.` : `Notebook ${args.id} was already absent.`
					}]
				},
				execute: (args) => this.delete({ id: NotebookId(args.id) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "delete",
					title: "Delete notebook",
					rawInput: args.id
				})
			}));
		}
		update(id, mutate) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const current = table.get(id);
				if (current === void 0) throw new Error(`notebooks: entry ${id} not found`);
				const entry = snapshot({
					...mutate(snapshot(current)),
					updatedAt: Math.max(Date.now(), current.updatedAt + 1)
				});
				await table.put(id, entry);
				return snapshot(entry);
			});
		}
		enqueue(operation) {
			const result = this.mutationTail.then(operation);
			this.mutationTail = result.then(() => void 0, () => void 0);
			return result;
		}
		requireTable() {
			if (this.table === void 0) throw new Error("notebooks: durable domain is not initialized");
			return this.table;
		}
		assertLength(value, limit, field) {
			if (value.length > limit) throw new RangeError(`notebooks: ${field} exceeds ${limit} characters`);
		}
	};
})();
function requiredText(value, field) {
	const text = value.trim();
	if (text === "") throw new TypeError(`notebooks: ${field} must not be blank`);
	return text;
}
function optionalText(value) {
	const text = value?.trim();
	return text === void 0 || text === "" ? null : text;
}
function normalizeTags(tags) {
	return [...new Set(tags.map((tag) => tag.trim()).filter((tag) => tag !== ""))];
}
function searchableText(entry) {
	return [
		entry.title,
		entry.content,
		entry.summary,
		...entry.tags,
		...entry.sources.flatMap((source) => [
			source.name,
			source.url ?? "",
			source.content
		])
	].join("\n").toLocaleLowerCase();
}
function manualSource(title, content, createdAt) {
	return {
		id: NotebookSourceId(`source-${randomUUID()}`),
		kind: "manual",
		name: title,
		url: null,
		mimeType: "text/plain",
		content,
		selected: true,
		createdAt
	};
}
function snapshot(entry) {
	return Object.freeze({
		...entry,
		tags: [...entry.tags],
		sources: entry.sources.map((source) => Object.freeze({ ...source })),
		artifacts: entry.artifacts.map((artifact) => Object.freeze({ ...artifact }))
	});
}
//#endregion
export { NotebookId, NotebookSourceId, NotebooksService, NotebooksService as default, notebookArtifactSchema, notebookEntrySchema, notebookSourceSchema, notebooksDomainSpec };
