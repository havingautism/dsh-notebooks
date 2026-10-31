window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-notebooks",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let zod = require("zod");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_dom = require("react-dom");
		//#region ../deepseek-harness/packages/typert/protocol/lib/types/remote-info.js
		/** Lazy assembly of generated Remote definitions using caller-supplied Zod; no runtime imports. */
		/**
		* Retain one generated definition per endpoint without constructing parsers or projections.
		* The class instance builds its shared descriptor/method index on first access;
		* input schemas and JSON Schema projections are cached only when requested.
		* @param spec - compiler-produced method facts and Zod factories.
		* @param zod - the generated artifact's Zod runtime for named-input parsers.
		* @returns a lazy, mountable info instance with no registration or transport effects.
		*/
		function createTypertRemoteInfo(spec, zod) {
			return new RemoteInfo(spec, zod);
		}
		var RemoteInfo = class {
			spec;
			zod;
			index;
			constructor(spec, zod) {
				this.spec = spec;
				this.zod = zod;
			}
			get package() {
				return this.spec.package;
			}
			get descriptors() {
				return this.resolve().descriptors;
			}
			get methods() {
				return this.resolve().methods;
			}
			resolve() {
				if (this.index !== void 0) return this.index;
				const zod = this.zod;
				const descriptors = [];
				const methods = Object.create(null);
				for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
					const separator = endpoint.indexOf("/");
					const namespace = endpoint.slice(0, separator);
					const method = endpoint.slice(separator + 1);
					const parameters = definition.parameters.map((parameter) => ({
						...parameter,
						wire: parameter.wire ?? parameter.name
					}));
					const descriptor = {
						...definition,
						id: `${this.spec.package}#${endpoint}`,
						namespace,
						method,
						parameters,
						result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
					};
					if (definition.invocation.kind === "direct") {
						const inputs = [];
						methods[endpoint] = Object.assign(descriptor, {
							input(options) {
								const strict = options?.strict === true;
								return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
							},
							invoke(remote, input, signal) {
								const named = input;
								const values = parameters.map((parameter) => named[parameter.wire]);
								if (definition.cancellation !== void 0) values.push(signal);
								const receiver = Reflect.get(remote, namespace);
								return Reflect.get(receiver, method).apply(receiver, values);
							}
						});
					}
					descriptors.push(descriptor);
				}
				return this.index = {
					descriptors,
					methods
				};
			}
		};
		function optional(parameter) {
			return parameter.source === "json" && parameter.acceptsUndefined === true;
		}
		var NamedInput = class {
			parameters;
			strict;
			zod;
			schema;
			projection;
			constructor(parameters, strict, zod) {
				this.parameters = parameters;
				this.strict = strict;
				this.zod = zod;
			}
			codec(parameter) {
				return this.strict ? parameter.strictCodec : parameter.codec;
			}
			create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
				const value = this.codec(parameter).create();
				return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
			})));
			get jsonSchema() {
				return this.project().jsonSchema;
			}
			get jsonSchemaError() {
				return this.project().jsonSchemaError;
			}
			project() {
				if (this.projection !== void 0) return this.projection;
				const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
				if (unavailable !== void 0) return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
				return this.projection = { jsonSchema: {
					type: "object",
					properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
						...this.codec(parameter).jsonSchema,
						...parameter.description === void 0 ? {} : { description: parameter.description }
					}])),
					required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
					additionalProperties: false
				} };
			}
		};
		var ResultValue = class {
			spec;
			projection;
			constructor(spec) {
				this.spec = spec;
			}
			get mode() {
				return this.spec.mode;
			}
			get typeSymbol() {
				return this.spec.typeSymbol;
			}
			get create() {
				return this.spec.create;
			}
			get decode() {
				return this.spec.decode;
			}
			get encode() {
				return this.spec.encode;
			}
			get description() {
				return this.spec.description;
			}
			get jsonSchemaError() {
				return this.spec.jsonSchemaError;
			}
			get jsonSchema() {
				if (this.projection === void 0) {
					const schema = this.spec.jsonSchema;
					this.projection = { value: schema === void 0 ? void 0 : {
						...schema,
						description: this.spec.description
					} };
				}
				return this.projection.value;
			}
		};
		//#endregion
		//#region lib/typert.remote-client.js
		let _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer")
			]).readonly(),
			"name": zod.z.string().readonly(),
			"url": zod.z.string().readonly().optional(),
			"mimeType": zod.z.string().readonly().optional(),
			"content": zod.z.string().readonly().optional(),
			"sessionId": zod.z.string().readonly().optional(),
			"messageId": zod.z.string().readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema$value ??= zod.z.object({ "query": zod.z.string().readonly().optional() });
		let _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema$value ??= zod.z.object({ "candidates": zod.z.array(zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"mention": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"summarizing": zod.z.boolean().readonly().describe("True while overview generation is still running and no summary exists yet.")
		})).readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema$value ??= zod.z.object({
			"title": zod.z.string().readonly().optional(),
			"content": zod.z.string().readonly().optional(),
			"urls": zod.z.array(zod.z.string()).readonly().optional(),
			"documents": zod.z.array(zod.z.object({
				"name": zod.z.string().readonly(),
				"mimeType": zod.z.string().readonly().optional(),
				"content": zod.z.string().readonly()
			})).readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_create_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_create_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_create_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema$value ??= zod.z.object({ "deleted": zod.z.boolean().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_get_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_get_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_get_result$schema$value ??= zod.z.union([zod.z.literal(null), zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		})]);
		let _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema$value ??= zod.z.object({
			"query": zod.z.string().readonly().optional(),
			"tag": zod.z.string().readonly().optional(),
			"sourceKind": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_list_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_list_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_list_result$schema$value ??= zod.z.object({ "entries": zod.z.array(zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		})).readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly().optional(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_put_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_put_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_put_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"sourceId": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema$value ??= zod.z.object({
			"removed": zod.z.boolean().readonly(),
			"entry": zod.z.object({
				"id": zod.z.string().readonly(),
				"title": zod.z.string().readonly(),
				"content": zod.z.string().readonly(),
				"summary": zod.z.string().readonly(),
				"tags": zod.z.array(zod.z.string()).readonly(),
				"sourceType": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer"),
					zod.z.literal("notebook")
				]).readonly(),
				"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"fetchStatus": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sources": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"kind": zod.z.union([
						zod.z.literal("manual"),
						zod.z.literal("url"),
						zod.z.literal("document"),
						zod.z.literal("chat_answer")
					]).readonly(),
					"name": zod.z.string().readonly(),
					"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
					"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
					"content": zod.z.string().readonly(),
					"selected": zod.z.boolean().readonly(),
					"status": zod.z.union([
						zod.z.literal("failed"),
						zod.z.literal("ready"),
						zod.z.literal("pending_fetch")
					]).readonly(),
					"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
					"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
					"createdAt": zod.z.number().readonly()
				})).readonly(),
				"artifacts": zod.z.array(zod.z.object({
					"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
					"content": zod.z.string().readonly(),
					"updatedAt": zod.z.number().readonly()
				})).readonly(),
				"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
					"id": zod.z.string().readonly(),
					"kind": zod.z.union([
						zod.z.literal("mindmap"),
						zod.z.literal("report"),
						zod.z.literal("summary")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("failed"),
						zod.z.literal("running"),
						zod.z.literal("completed"),
						zod.z.literal("pending")
					]).readonly(),
					"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
					"partialText": zod.z.string().readonly(),
					"errorText": zod.z.string().readonly(),
					"updatedAt": zod.z.number().readonly()
				})]).readonly(),
				"createdAt": zod.z.number().readonly(),
				"updatedAt": zod.z.number().readonly()
			}).readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema$value ??= zod.z.object({
			"title": zod.z.string().readonly().optional(),
			"answerText": zod.z.string().readonly(),
			"questionText": zod.z.string().readonly().optional(),
			"sessionId": zod.z.string().readonly().optional(),
			"messageId": zod.z.string().readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
			"content": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"sourceIds": zod.z.array(zod.z.string()).readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"summary": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema = () => _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema = () => _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly(),
			"tags": zod.z.array(zod.z.string()).readonly(),
			"sourceType": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer"),
				zod.z.literal("notebook")
			]).readonly(),
			"sourceUrl": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"fetchStatus": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("ready"),
				zod.z.literal("pending_fetch")
			]).readonly(),
			"sources": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("manual"),
					zod.z.literal("url"),
					zod.z.literal("document"),
					zod.z.literal("chat_answer")
				]).readonly(),
				"name": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"mimeType": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"content": zod.z.string().readonly(),
				"selected": zod.z.boolean().readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("ready"),
					zod.z.literal("pending_fetch")
				]).readonly(),
				"sessionId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"messageId": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"artifacts": zod.z.array(zod.z.object({
				"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
				"content": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})).readonly(),
			"latestJob": zod.z.union([zod.z.literal(null), zod.z.object({
				"id": zod.z.string().readonly(),
				"kind": zod.z.union([
					zod.z.literal("mindmap"),
					zod.z.literal("report"),
					zod.z.literal("summary")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("completed"),
					zod.z.literal("pending")
				]).readonly(),
				"stage": zod.z.union([zod.z.literal("fetch"), zod.z.literal("generate")]).readonly(),
				"partialText": zod.z.string().readonly(),
				"errorText": zod.z.string().readonly(),
				"updatedAt": zod.z.number().readonly()
			})]).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer")
			]).readonly(),
			"name": zod.z.string().readonly(),
			"url": zod.z.string().readonly().optional(),
			"mimeType": zod.z.string().readonly().optional(),
			"content": zod.z.string().readonly().optional(),
			"sessionId": zod.z.string().readonly().optional(),
			"messageId": zod.z.string().readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0_strict$schema$value ??= zod.z.strictObject({ "query": zod.z.string().readonly().optional() });
		let _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"title": zod.z.string().readonly().optional(),
			"content": zod.z.string().readonly().optional(),
			"urls": zod.z.array(zod.z.string()).readonly().optional(),
			"documents": zod.z.array(zod.z.strictObject({
				"name": zod.z.string().readonly(),
				"mimeType": zod.z.string().readonly().optional(),
				"content": zod.z.string().readonly()
			})).readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"query": zod.z.string().readonly().optional(),
			"tag": zod.z.string().readonly().optional(),
			"sourceKind": zod.z.union([
				zod.z.literal("manual"),
				zod.z.literal("url"),
				zod.z.literal("document"),
				zod.z.literal("chat_answer")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly().optional(),
			"title": zod.z.string().readonly(),
			"content": zod.z.string().readonly(),
			"summary": zod.z.string().readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"sourceId": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"title": zod.z.string().readonly().optional(),
			"answerText": zod.z.string().readonly(),
			"questionText": zod.z.string().readonly().optional(),
			"sessionId": zod.z.string().readonly().optional(),
			"messageId": zod.z.string().readonly().optional(),
			"tags": zod.z.array(zod.z.string()).readonly().optional()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"kind": zod.z.union([zod.z.literal("mindmap"), zod.z.literal("report")]).readonly(),
			"content": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"sourceIds": zod.z.array(zod.z.string()).readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"summary": zod.z.string().readonly()
		});
		let _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0_strict$schema = () => _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		const TYPERT_REMOTE = createTypertRemoteInfo({
			package: "@deepseek-ai/dsh-notebooks",
			methods: {
				"notebooks/addSource": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookAddSourceRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": [
											"manual",
											"url",
											"document",
											"chat_answer"
										]
									},
									"name": { "type": "string" },
									"url": { "type": "string" },
									"mimeType": { "type": "string" },
									"content": { "type": "string" },
									"sessionId": { "type": "string" },
									"messageId": { "type": "string" }
								},
								"required": [
									"id",
									"kind",
									"name"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookAddSourceRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_addSource_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": [
											"manual",
											"url",
											"document",
											"chat_answer"
										]
									},
									"name": { "type": "string" },
									"url": { "type": "string" },
									"mimeType": { "type": "string" },
									"content": { "type": "string" },
									"sessionId": { "type": "string" },
									"messageId": { "type": "string" }
								},
								"required": [
									"id",
									"kind",
									"name"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_addSource_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 278,
						"column": 3
					}
				},
				"notebooks/candidates": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCandidateRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "query": { "type": "string" } },
								"required": [],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCandidateRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_candidates_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "query": { "type": "string" } },
								"required": [],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCandidateResult",
						create: _deepseek_ai_dsh_notebooks_notebooks_candidates_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": { "candidates": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"title": { "type": "string" },
										"mention": { "type": "string" },
										"summary": { "type": "string" },
										"summarizing": {
											"type": "boolean",
											"description": "True while overview generation is still running and no summary exists yet."
										}
									},
									"required": [
										"id",
										"title",
										"mention",
										"summary",
										"summarizing"
									],
									"additionalProperties": true
								}
							} },
							"required": ["candidates"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 207,
						"column": 3
					}
				},
				"notebooks/create": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCreateRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"content": { "type": "string" },
									"urls": {
										"type": "array",
										"items": { "type": "string" }
									},
									"documents": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"name": { "type": "string" },
												"mimeType": { "type": "string" },
												"content": { "type": "string" }
											},
											"required": ["name", "content"],
											"additionalProperties": true
										}
									},
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": [],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookCreateRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_create_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"content": { "type": "string" },
									"urls": {
										"type": "array",
										"items": { "type": "string" }
									},
									"documents": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"name": { "type": "string" },
												"mimeType": { "type": "string" },
												"content": { "type": "string" }
											},
											"required": ["name", "content"],
											"additionalProperties": false
										}
									},
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": [],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_create_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 251,
						"column": 3
					}
				},
				"notebooks/delete": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookDeleteRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookDeleteRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_delete_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookDeleteResult",
						create: _deepseek_ai_dsh_notebooks_notebooks_delete_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": { "deleted": { "type": "boolean" } },
							"required": ["deleted"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 367,
						"column": 3
					}
				},
				"notebooks/generateStudio": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGenerateStudioRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": ["mindmap", "report"]
									}
								},
								"required": ["id", "kind"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGenerateStudioRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_generateStudio_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": ["mindmap", "report"]
									}
								},
								"required": ["id", "kind"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_generateStudio_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 333,
						"column": 3
					}
				},
				"notebooks/get": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGetRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookGetRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_get_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks#notebooks/get:result",
						create: _deepseek_ai_dsh_notebooks_notebooks_get_result$schema,
						jsonSchema: { "oneOf": [{
							"type": "null",
							"const": null
						}, {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}] }
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 201,
						"column": 3
					}
				},
				"notebooks/list": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookListRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"query": { "type": "string" },
									"tag": { "type": "string" },
									"sourceKind": {
										"type": "string",
										"enum": [
											"manual",
											"url",
											"document",
											"chat_answer"
										]
									}
								},
								"required": [],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookListRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_list_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"query": { "type": "string" },
									"tag": { "type": "string" },
									"sourceKind": {
										"type": "string",
										"enum": [
											"manual",
											"url",
											"document",
											"chat_answer"
										]
									}
								},
								"required": [],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookListResult",
						create: _deepseek_ai_dsh_notebooks_notebooks_list_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": { "entries": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"title": { "type": "string" },
										"content": { "type": "string" },
										"summary": { "type": "string" },
										"tags": {
											"type": "array",
											"items": { "type": "string" }
										},
										"sourceType": {
											"type": "string",
											"enum": [
												"manual",
												"url",
												"document",
												"chat_answer",
												"notebook"
											]
										},
										"sourceUrl": { "oneOf": [{
											"type": "null",
											"const": null
										}, { "type": "string" }] },
										"fetchStatus": {
											"type": "string",
											"enum": [
												"failed",
												"ready",
												"pending_fetch"
											]
										},
										"sources": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"kind": {
														"type": "string",
														"enum": [
															"manual",
															"url",
															"document",
															"chat_answer"
														]
													},
													"name": { "type": "string" },
													"url": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"mimeType": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"content": { "type": "string" },
													"selected": { "type": "boolean" },
													"status": {
														"type": "string",
														"enum": [
															"failed",
															"ready",
															"pending_fetch"
														]
													},
													"sessionId": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"messageId": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"createdAt": { "type": "number" }
												},
												"required": [
													"id",
													"kind",
													"name",
													"url",
													"mimeType",
													"content",
													"selected",
													"status",
													"sessionId",
													"messageId",
													"createdAt"
												],
												"additionalProperties": true
											}
										},
										"artifacts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"kind": {
														"type": "string",
														"enum": ["mindmap", "report"]
													},
													"content": { "type": "string" },
													"updatedAt": { "type": "number" }
												},
												"required": [
													"kind",
													"content",
													"updatedAt"
												],
												"additionalProperties": true
											}
										},
										"latestJob": { "oneOf": [{
											"type": "null",
											"const": null
										}, {
											"type": "object",
											"properties": {
												"id": { "type": "string" },
												"kind": {
													"type": "string",
													"enum": [
														"mindmap",
														"report",
														"summary"
													]
												},
												"status": {
													"type": "string",
													"enum": [
														"failed",
														"running",
														"completed",
														"pending"
													]
												},
												"stage": {
													"type": "string",
													"enum": ["fetch", "generate"]
												},
												"partialText": { "type": "string" },
												"errorText": { "type": "string" },
												"updatedAt": { "type": "number" }
											},
											"required": [
												"id",
												"kind",
												"status",
												"stage",
												"partialText",
												"errorText",
												"updatedAt"
											],
											"additionalProperties": true
										}] },
										"createdAt": { "type": "number" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"title",
										"content",
										"summary",
										"tags",
										"sourceType",
										"sourceUrl",
										"fetchStatus",
										"sources",
										"artifacts",
										"latestJob",
										"createdAt",
										"updatedAt"
									],
									"additionalProperties": true
								}
							} },
							"required": ["entries"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 188,
						"column": 3
					}
				},
				"notebooks/put": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookPutRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"title": { "type": "string" },
									"content": { "type": "string" },
									"summary": { "type": "string" },
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["title", "content"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookPutRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_put_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"title": { "type": "string" },
									"content": { "type": "string" },
									"summary": { "type": "string" },
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["title", "content"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_put_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 221,
						"column": 3
					}
				},
				"notebooks/removeSource": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookRemoveSourceRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"sourceId": { "type": "string" }
								},
								"required": ["id", "sourceId"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookRemoveSourceRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_removeSource_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"sourceId": { "type": "string" }
								},
								"required": ["id", "sourceId"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookRemoveSourceResult",
						create: _deepseek_ai_dsh_notebooks_notebooks_removeSource_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"removed": { "type": "boolean" },
								"entry": {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"title": { "type": "string" },
										"content": { "type": "string" },
										"summary": { "type": "string" },
										"tags": {
											"type": "array",
											"items": { "type": "string" }
										},
										"sourceType": {
											"type": "string",
											"enum": [
												"manual",
												"url",
												"document",
												"chat_answer",
												"notebook"
											]
										},
										"sourceUrl": { "oneOf": [{
											"type": "null",
											"const": null
										}, { "type": "string" }] },
										"fetchStatus": {
											"type": "string",
											"enum": [
												"failed",
												"ready",
												"pending_fetch"
											]
										},
										"sources": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"kind": {
														"type": "string",
														"enum": [
															"manual",
															"url",
															"document",
															"chat_answer"
														]
													},
													"name": { "type": "string" },
													"url": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"mimeType": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"content": { "type": "string" },
													"selected": { "type": "boolean" },
													"status": {
														"type": "string",
														"enum": [
															"failed",
															"ready",
															"pending_fetch"
														]
													},
													"sessionId": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"messageId": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"createdAt": { "type": "number" }
												},
												"required": [
													"id",
													"kind",
													"name",
													"url",
													"mimeType",
													"content",
													"selected",
													"status",
													"sessionId",
													"messageId",
													"createdAt"
												],
												"additionalProperties": true
											}
										},
										"artifacts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"kind": {
														"type": "string",
														"enum": ["mindmap", "report"]
													},
													"content": { "type": "string" },
													"updatedAt": { "type": "number" }
												},
												"required": [
													"kind",
													"content",
													"updatedAt"
												],
												"additionalProperties": true
											}
										},
										"latestJob": { "oneOf": [{
											"type": "null",
											"const": null
										}, {
											"type": "object",
											"properties": {
												"id": { "type": "string" },
												"kind": {
													"type": "string",
													"enum": [
														"mindmap",
														"report",
														"summary"
													]
												},
												"status": {
													"type": "string",
													"enum": [
														"failed",
														"running",
														"completed",
														"pending"
													]
												},
												"stage": {
													"type": "string",
													"enum": ["fetch", "generate"]
												},
												"partialText": { "type": "string" },
												"errorText": { "type": "string" },
												"updatedAt": { "type": "number" }
											},
											"required": [
												"id",
												"kind",
												"status",
												"stage",
												"partialText",
												"errorText",
												"updatedAt"
											],
											"additionalProperties": true
										}] },
										"createdAt": { "type": "number" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"title",
										"content",
										"summary",
										"tags",
										"sourceType",
										"sourceUrl",
										"fetchStatus",
										"sources",
										"artifacts",
										"latestJob",
										"createdAt",
										"updatedAt"
									],
									"additionalProperties": true
								}
							},
							"required": ["removed", "entry"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 298,
						"column": 3
					}
				},
				"notebooks/saveChatAnswer": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSaveChatAnswerRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"answerText": { "type": "string" },
									"questionText": { "type": "string" },
									"sessionId": { "type": "string" },
									"messageId": { "type": "string" },
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["answerText"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSaveChatAnswerRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"answerText": { "type": "string" },
									"questionText": { "type": "string" },
									"sessionId": { "type": "string" },
									"messageId": { "type": "string" },
									"tags": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["answerText"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_saveChatAnswer_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 341,
						"column": 3
					}
				},
				"notebooks/setArtifact": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookArtifactRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": ["mindmap", "report"]
									},
									"content": { "type": "string" }
								},
								"required": [
									"id",
									"kind",
									"content"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookArtifactRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setArtifact_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"kind": {
										"type": "string",
										"enum": ["mindmap", "report"]
									},
									"content": { "type": "string" }
								},
								"required": [
									"id",
									"kind",
									"content"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_setArtifact_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 316,
						"column": 3
					}
				},
				"notebooks/setSourceSelection": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSourceSelectionRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"sourceIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["id", "sourceIds"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSourceSelectionRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"sourceIds": {
										"type": "array",
										"items": { "type": "string" }
									}
								},
								"required": ["id", "sourceIds"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_setSourceSelection_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 287,
						"column": 3
					}
				},
				"notebooks/setSummary": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummaryRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"summary": { "type": "string" }
								},
								"required": ["id", "summary"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummaryRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_setSummary_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"summary": { "type": "string" }
								},
								"required": ["id", "summary"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_setSummary_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 311,
						"column": 3
					}
				},
				"notebooks/summarize": {
					service: "notebooks",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummarizeRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookSummarizeRequest",
							create: _deepseek_ai_dsh_notebooks_notebooks_summarize_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-notebooks/types#NotebookEntry",
						create: _deepseek_ai_dsh_notebooks_notebooks_summarize_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"content": { "type": "string" },
								"summary": { "type": "string" },
								"tags": {
									"type": "array",
									"items": { "type": "string" }
								},
								"sourceType": {
									"type": "string",
									"enum": [
										"manual",
										"url",
										"document",
										"chat_answer",
										"notebook"
									]
								},
								"sourceUrl": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"fetchStatus": {
									"type": "string",
									"enum": [
										"failed",
										"ready",
										"pending_fetch"
									]
								},
								"sources": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"kind": {
												"type": "string",
												"enum": [
													"manual",
													"url",
													"document",
													"chat_answer"
												]
											},
											"name": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"mimeType": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"content": { "type": "string" },
											"selected": { "type": "boolean" },
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"ready",
													"pending_fetch"
												]
											},
											"sessionId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"messageId": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"kind",
											"name",
											"url",
											"mimeType",
											"content",
											"selected",
											"status",
											"sessionId",
											"messageId",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"artifacts": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"kind": {
												"type": "string",
												"enum": ["mindmap", "report"]
											},
											"content": { "type": "string" },
											"updatedAt": { "type": "number" }
										},
										"required": [
											"kind",
											"content",
											"updatedAt"
										],
										"additionalProperties": true
									}
								},
								"latestJob": { "oneOf": [{
									"type": "null",
									"const": null
								}, {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"kind": {
											"type": "string",
											"enum": [
												"mindmap",
												"report",
												"summary"
											]
										},
										"status": {
											"type": "string",
											"enum": [
												"failed",
												"running",
												"completed",
												"pending"
											]
										},
										"stage": {
											"type": "string",
											"enum": ["fetch", "generate"]
										},
										"partialText": { "type": "string" },
										"errorText": { "type": "string" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"kind",
										"status",
										"stage",
										"partialText",
										"errorText",
										"updatedAt"
									],
									"additionalProperties": true
								}] },
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"content",
								"summary",
								"tags",
								"sourceType",
								"sourceUrl",
								"fetchStatus",
								"sources",
								"artifacts",
								"latestJob",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/notebooks/src/index.ts",
						"line": 326,
						"column": 3
					}
				}
			}
		}, zod.z);
		//#endregion
		//#region lib/types/types.js
		/** Public wire values for durable Codemini-style notebooks. */
		/**
		* Construct a notebook identity at its owning boundary.
		* @param value - persisted or wire identity.
		* @returns branded notebook identity.
		*/
		const NotebookId = (value) => value;
		//#endregion
		//#region lib/types/mention.js
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
		//#region lib/types/client/hydrate.js
		/** Fill optional notebook fields after a Remote round-trip. */
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
		//#region lib/types/client/locales.js
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
			"studio.mindmapInvalid": "这份内容不是可渲染的思维导图。请重新生成。",
			"studio.failed": "生成失败：{error}",
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
			"overlay.crashBack": "返回列表",
			"markdown.copy": "复制",
			"markdown.copied": "已复制",
			"markdown.code": "代码",
			"markdown.wrap": "自动换行",
			"markdown.unwrap": "取消换行",
			"markdown.footnotes": "脚注"
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
			"studio.mindmapInvalid": "This is not a renderable mind map. Generate again.",
			"studio.failed": "Generation failed: {error}",
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
			"overlay.crashBack": "Back to library",
			"markdown.copy": "Copy",
			"markdown.copied": "Copied",
			"markdown.code": "Code",
			"markdown.wrap": "Wrap",
			"markdown.unwrap": "Unwrap",
			"markdown.footnotes": "Footnotes"
		};
		//#endregion
		//#region lib/types/client/ui-store.js
		/** Root-scoped overlay route: open/close plus the selected notebook, synced to the URL hash. */
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
		//#region lib/types/client/NotebooksSidebarEntry.js
		/** Sidebar foot control that opens the global notebook workspace. */
		/** Render the sidebar launch button for the frame-wide notebook overlay. */
		function NotebooksSidebarEntry({ wide, t, ...face }) {
			const open = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getOpen);
			return (0, react_jsx_runtime.jsx)("div", {
				className: wide ? sidebar_entry_module_css_default.layer : `${sidebar_entry_module_css_default.layer} ${sidebar_entry_module_css_default.rail}`,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: sidebar_entry_module_css_default.badge,
					"data-active": open || void 0,
					"aria-pressed": open,
					"aria-label": t("view.notebooks"),
					onClick: () => {
						face.store.setOpen(!open);
					},
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 16 }), wide ? (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_entry_module_css_default.badgeLabel,
						children: t("view.notebooks")
					}) : null]
				})
			});
		}
		//#endregion
		//#region lib/types/studio-mermaid.js
		/** Extract a Mermaid mindmap from model output; ignore planning prose. */
		const FENCE_PATTERN = /```(?:mermaid|mmd)\s*\r?\n([\s\S]*?)```/i;
		const BARE_MINDMAP_PATTERN = /(?:^|\n)(mindmap(?:[ \t]+root)?[\s\S]*)$/i;
		/** Return a fenced mermaid document, or '' when the model did not emit a diagram. */
		function extractMermaidFence(raw) {
			const fenced = raw.match(FENCE_PATTERN);
			if (fenced !== null) {
				const body = fenced[1].trim();
				return body === "" ? "" : `\`\`\`mermaid\n${body}\n\`\`\``;
			}
			const bare = raw.match(BARE_MINDMAP_PATTERN);
			if (bare === null) return "";
			const body = bare[1].trim();
			if (!/^mindmap\b/i.test(body)) return "";
			if (!/\n\s+\S/.test(body)) return "";
			return `\`\`\`mermaid\n${body}\n\`\`\``;
		}
		/** Inner mermaid source for rendering. */
		function mermaidSourceFromArtifact(raw) {
			const fenced = extractMermaidFence(raw);
			if (fenced === "") return "";
			return fenced.replace(/^```(?:mermaid|mmd)\s*\r?\n/i, "").replace(/\r?\n```\s*$/u, "").trim();
		}
		/** Parse Mermaid mindmap syntax into a tree the Studio UI can draw. */
		function parseMindmapTree(raw) {
			const source = mermaidSourceFromArtifact(raw);
			if (source === "") return null;
			const lines = source.split(/\r?\n/).map((line) => line.replace(/\t/g, "  ")).filter((line) => line.trim() !== "" && !line.trim().startsWith("%%"));
			if (lines.length === 0 || !/^mindmap\b/i.test(lines[0].trim())) return null;
			const items = [];
			for (const line of lines.slice(1)) {
				const label = mindmapLabel(line.trim());
				if (label === "") continue;
				items.push({
					indent: line.match(/^ */u)?.[0].length ?? 0,
					label
				});
			}
			if (items.length === 0) return null;
			const roots = [];
			let index = 0;
			while (index < items.length) {
				const parsed = buildMindmap(items, index, items[index].indent);
				roots.push(parsed.node);
				index = parsed.next;
			}
			if (roots.length === 1) return roots[0];
			return {
				label: "Mindmap",
				children: roots
			};
		}
		function buildMindmap(items, start, indent) {
			const children = [];
			let index = start + 1;
			while (index < items.length && items[index].indent > indent) {
				const child = buildMindmap(items, index, items[index].indent);
				children.push(child.node);
				index = child.next;
			}
			return {
				node: {
					label: items[start].label,
					children
				},
				next: index
			};
		}
		function mindmapLabel(raw) {
			const stripped = raw.replace(/^::icon\([^)]*\)\s*/u, "").trim();
			return (stripped.match(/^(?:[\w.-]+)?(?:\(\((.+)\)\)|\[\[(.+)\]\]|\[\((.+)\)\]|\(\[(.+)\]\)|\{\{(.+)\}\}|\{(.+)\}|\[(.+)\]|\((.+)\))$/u)?.slice(1).find((part) => part !== void 0) ?? stripped).replace(/^["']|["']$/gu, "").trim();
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-notebooks/src/client/views.module.css.mjs
		const css$3 = ".xDpCDq_shell{box-sizing:border-box;background:var(--dsw-alias-bg-base);height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex:1;overflow:auto}.xDpCDq_workspace{box-sizing:border-box;background:var(--dsw-alias-bg-base);width:100%;height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex-direction:column;display:flex;overflow:hidden}.xDpCDq_content{box-sizing:border-box;width:min(1540px,100%);margin-inline:auto;padding:24px clamp(18px,3vw,40px) 48px}.xDpCDq_libraryTopBar{justify-content:flex-start;margin-bottom:8px;display:flex}.xDpCDq_notebookLoading{min-height:220px;color:var(--dsw-alias-label-caption);justify-content:center;align-items:center;gap:10px;font-size:12px;display:flex}.xDpCDq_spinner{flex:none;animation:.8s linear infinite xDpCDq_notebooks-spin}@keyframes xDpCDq_notebooks-spin{to{transform:rotate(360deg)}}.xDpCDq_toolbar,.xDpCDq_toolbarActions,.xDpCDq_filters,.xDpCDq_viewToggle,.xDpCDq_libraryTitle,.xDpCDq_workspaceHeader,.xDpCDq_sourceActions,.xDpCDq_paneHeader,.xDpCDq_paneActions,.xDpCDq_studioTabs,.xDpCDq_modalHeader,.xDpCDq_modalHeading,.xDpCDq_modalFooter,.xDpCDq_modalFooter>div,.xDpCDq_fileRow{align-items:center;display:flex}.xDpCDq_toolbar,.xDpCDq_libraryTitle,.xDpCDq_workspaceHeader,.xDpCDq_paneHeader,.xDpCDq_modalHeader,.xDpCDq_modalFooter{justify-content:space-between}.xDpCDq_toolbar{gap:20px}.xDpCDq_filters,.xDpCDq_toolbarActions,.xDpCDq_sourceActions,.xDpCDq_studioTabs,.xDpCDq_modalFooter>div{gap:7px}.xDpCDq_filters{min-width:0;overflow-x:auto}.xDpCDq_primaryButton,.xDpCDq_secondaryButton,.xDpCDq_backButton,.xDpCDq_deleteText,.xDpCDq_chip,.xDpCDq_activeChip,.xDpCDq_iconButton,.xDpCDq_createCard{color:inherit;font:inherit;cursor:pointer;border:0}.xDpCDq_primaryButton{background:var(--dsw-alias-label-primary);min-height:38px;color:var(--dsw-alias-bg-base);border-radius:999px;align-items:center;gap:6px;padding:0 16px;font-size:12px;font-weight:650;display:inline-flex;box-shadow:inset 0 1px #ffffff14,0 8px 18px #0000001f}.xDpCDq_primaryButton:hover{opacity:.9;transform:translateY(-.5px)}.xDpCDq_ghostButton{min-height:30px;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;border-radius:8px;align-items:center;gap:6px;padding:0 10px;font-size:11px;display:inline-flex}.xDpCDq_ghostButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_primaryButton:disabled,.xDpCDq_secondaryButton:disabled,.xDpCDq_iconButton:disabled{cursor:default;opacity:.5}.xDpCDq_secondaryButton,.xDpCDq_backButton{background:var(--dsw-alias-interactive-bg-hover-solid);min-height:36px;color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:6px;padding:0 13px;font-size:12px;display:inline-flex}.xDpCDq_deleteText{color:var(--dsw-alias-state-error-primary);background:0 0;border-radius:9px;padding:8px 11px}.xDpCDq_chip,.xDpCDq_activeChip{min-height:34px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:999px;flex:none;padding:0 14px;font-size:12px}.xDpCDq_chip:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_activeChip{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-label-primary)}.xDpCDq_input,.xDpCDq_textarea,.xDpCDq_search,.xDpCDq_select,.xDpCDq_sourceInput,.xDpCDq_summaryEditor,.xDpCDq_studioEditor{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}.xDpCDq_input,.xDpCDq_search,.xDpCDq_select{border-radius:999px;height:38px;padding:0 13px}.xDpCDq_search{width:min(230px,25vw)}.xDpCDq_textarea{resize:vertical;border-radius:12px;min-height:130px;padding:11px 13px}.xDpCDq_input:focus,.xDpCDq_textarea:focus,.xDpCDq_search:focus,.xDpCDq_select:focus,.xDpCDq_sourceInput:focus,.xDpCDq_summaryEditor:focus,.xDpCDq_studioEditor:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}.xDpCDq_viewToggle{border:1px solid var(--dsw-alias-border-l1);border-radius:999px;gap:0;overflow:hidden}.xDpCDq_iconButton{width:38px;height:38px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:10px;place-items:center;padding:0;display:inline-grid}.xDpCDq_viewToggle .xDpCDq_iconButton{border-radius:0}.xDpCDq_viewToggle .xDpCDq_iconButton+.xDpCDq_iconButton{border-left:1px solid var(--dsw-alias-border-l1)}.xDpCDq_iconButton[data-active=true],.xDpCDq_iconButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-state-business-primary)}.xDpCDq_library{margin-top:34px}.xDpCDq_libraryTitle h2{letter-spacing:-.025em;margin:0;font-size:24px;font-weight:600}.xDpCDq_libraryTitle p{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:12px}.xDpCDq_notebookGrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:22px;display:grid}.xDpCDq_notebookList{flex-direction:column;gap:10px;margin-top:22px;display:flex}.xDpCDq_createCard{border:1px solid var(--dsw-alias-border-l1);min-height:208px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;display:flex}.xDpCDq_createCard:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_createCard span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:54px;height:54px;color:var(--dsw-alias-state-business-primary);border-radius:50%;place-items:center;margin-bottom:14px;font-size:24px;display:grid}.xDpCDq_createCard strong{font-size:14px}.xDpCDq_notebookCard{--card-tint:#5b8def;isolation:isolate;box-sizing:border-box;border:1px solid color-mix(in srgb, var(--card-tint) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--card-tint) 15%, var(--dsw-alias-bg-base));border-radius:16px;flex-direction:column;min-height:208px;padding:18px;transition:transform .18s,border-color .18s;display:flex;position:relative;overflow:hidden}.xDpCDq_notebookCard:hover{border-color:color-mix(in srgb, var(--card-tint) 50%, var(--dsw-alias-border-l1));transform:translateY(-2px)}.xDpCDq_notebookCard[data-busy]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l1))}.xDpCDq_notebookCard[data-list]{flex-direction:row;align-items:center;gap:14px;min-height:86px}.xDpCDq_cardInfo span{color:var(--dsw-alias-label-caption);align-items:center;gap:6px;font-size:10px;display:inline-flex}.xDpCDq_cardOpen{z-index:0;cursor:pointer;background:0 0;border:0;position:absolute;inset:0}.xDpCDq_cardEmoji{z-index:1;pointer-events:none;font-size:36px}.xDpCDq_cardInfo{z-index:1;pointer-events:none;min-width:0;margin-top:auto}.xDpCDq_notebookCard[data-list] .xDpCDq_cardInfo{flex:1;margin-top:0}.xDpCDq_cardInfo h3{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:10px 0 6px;font-size:16px;overflow:hidden}.xDpCDq_notebookCard[data-list] .xDpCDq_cardInfo h3{margin-top:0}.xDpCDq_cardInfo p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0 0 12px;font-size:12px;line-height:1.55;display:-webkit-box;overflow:hidden}.xDpCDq_deleteButton{z-index:2;width:28px;height:28px;color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;border-radius:50%;position:absolute;top:10px;right:10px}.xDpCDq_deleteButton:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary)}.xDpCDq_emptyState{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;min-height:260px;margin-top:22px;padding:28px;display:flex}.xDpCDq_emptyState>span{background:var(--dsw-specific-tip);border-radius:14px;place-items:center;width:48px;height:48px;font-size:22px;display:grid}.xDpCDq_emptyState strong{margin-top:14px;font-size:13px}.xDpCDq_emptyState p{color:var(--dsw-alias-label-caption);margin:6px 0 16px;font-size:12px}.xDpCDq_error,.xDpCDq_modalError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:10px;padding:10px 12px;font-size:12px}.xDpCDq_error{margin-top:16px}.xDpCDq_modalBackdrop{z-index:100;box-sizing:border-box;backdrop-filter:blur(8px);background:#080a0e94;place-items:center;padding:8px;display:grid;position:fixed;inset:0}.xDpCDq_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:20px;flex-direction:column;width:min(580px,100%);max-height:min(720px,100dvh - 16px);display:flex;overflow:hidden;box-shadow:0 28px 90px #00000061}.xDpCDq_modalHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;padding:18px 22px}.xDpCDq_modalHeading{gap:12px;min-width:0}.xDpCDq_modalHeading>span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);border-radius:11px;flex:none;place-items:center;width:36px;height:36px;display:grid}.xDpCDq_modalHeading h3{margin:0;font-size:16px}.xDpCDq_modalHeading p{color:var(--dsw-alias-label-caption);margin:4px 0 0;font-size:11px}.xDpCDq_modalBody{gap:14px;min-height:0;padding:20px 22px;display:grid;overflow-y:auto}.xDpCDq_modalBody label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:7px;font-size:11px;display:flex}.xDpCDq_modalBody label b{color:var(--dsw-alias-label-caption);font-weight:400}.xDpCDq_modalBody .xDpCDq_input{border-radius:10px}.xDpCDq_modalFooter{border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-caption);flex:none;gap:14px;padding:14px 22px;font-size:10px}.xDpCDq_workspaceHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;gap:18px;padding:14px 24px}.xDpCDq_workspaceHeading{text-align:center;flex:1;min-width:0}.xDpCDq_workspaceHeader h2{text-overflow:ellipsis;white-space:nowrap;margin:0;font-size:19px;overflow:hidden}.xDpCDq_eyebrow{color:var(--dsw-alias-state-business-primary);letter-spacing:.12em;margin:0 0 6px;font-size:10px;font-weight:700}.xDpCDq_mobilePanes{gap:7px;padding:10px 16px 0;display:none}.xDpCDq_workspaceColumns{flex:1;grid-template-columns:minmax(220px,280px) minmax(360px,1fr) minmax(260px,360px);min-height:0;display:grid;overflow:hidden}.xDpCDq_sourcesPane,.xDpCDq_summaryPane,.xDpCDq_studioPane{border-right:1px solid var(--dsw-alias-border-l1);min-width:0;padding:20px;overflow:auto}.xDpCDq_studioPane{border-right:0}.xDpCDq_paneHeader{border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:14px;padding-bottom:12px}.xDpCDq_paneHeader h3{margin:0;font-size:13px}.xDpCDq_paneHeader p{color:var(--dsw-alias-label-caption);margin:5px 0 0;font-size:11px}.xDpCDq_paneHeader span{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-caption);border-radius:9px;padding:3px 7px;font-size:10px}.xDpCDq_paneActions{gap:7px}.xDpCDq_sourceInput,.xDpCDq_studioEditor{resize:vertical;border-radius:10px;width:100%;min-height:76px;padding:9px}.xDpCDq_sourceList{flex-direction:column;gap:7px;margin-top:14px;display:flex}.xDpCDq_sourceRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);opacity:.67;border-radius:11px;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:9px;display:grid}.xDpCDq_sourceRow[data-selected]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, var(--dsw-alias-border-l1));opacity:1}.xDpCDq_sourceRow[data-active]{box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}.xDpCDq_sourceOpen{min-width:0;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;gap:3px;padding:0;display:flex}.xDpCDq_sourceRow strong{text-overflow:ellipsis;white-space:nowrap;font-size:11px;overflow:hidden}.xDpCDq_sourceRow span{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;font-size:9px;overflow:hidden}.xDpCDq_sourceRow button,.xDpCDq_sourceLink{color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0}.xDpCDq_sourceLink{place-items:center;display:grid}.xDpCDq_summaryEditor{resize:vertical;border-radius:12px;width:100%;min-height:340px;padding:16px;line-height:1.7}.xDpCDq_contentPreview,.xDpCDq_artifactPreview{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;margin-top:18px;padding:14px}.xDpCDq_contentPreview h4{margin:0 0 8px;font-size:11px}.xDpCDq_contentPreview p,.xDpCDq_artifactPreview pre{color:var(--dsw-alias-label-tertiary);font:inherit;white-space:pre-wrap;margin:0;font-size:11px;line-height:1.65}.xDpCDq_studioEditor{min-height:210px;margin:12px 0}.xDpCDq_artifactPreview{gap:10px;max-height:none;display:grid;overflow:auto}.xDpCDq_mindmapCanvas{min-height:160px;padding:8px 4px;overflow:auto}.xDpCDq_mindmapRoot,.xDpCDq_mindmapBranch{gap:8px;min-width:0;display:grid}.xDpCDq_mindmapRoot{justify-items:start}.xDpCDq_mindmapBranch{border-left:1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, var(--dsw-alias-border-l1));padding-left:16px}.xDpCDq_mindmapChildren{gap:8px;display:grid}.xDpCDq_mindmapRootLabel,.xDpCDq_mindmapLabel{overflow-wrap:anywhere;border-radius:999px;max-width:100%;padding:6px 10px;font-size:12px;font-weight:600;line-height:1.4;display:inline-flex}.xDpCDq_mindmapRootLabel{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-state-business-primary)}.xDpCDq_mindmapLabel{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}.xDpCDq_mindmapFallback{color:var(--dsw-alias-label-tertiary);font:inherit;margin:0;font-size:12px;line-height:1.65}.xDpCDq_markdownDocument{min-width:0;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere;font-size:13px;line-height:1.7}.xDpCDq_markdownDocument[data-streaming]{position:relative}.xDpCDq_progress{border:1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 22%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent);color:var(--dsw-alias-label-secondary);border-radius:12px;align-items:center;gap:8px;margin:0 0 16px;padding:10px 12px;font-size:12px;display:flex;position:relative;overflow:hidden}.xDpCDq_progressBar{background:linear-gradient(90deg, transparent, var(--dsw-alias-state-business-primary), transparent);background-size:40% 100%;height:2px;animation:1.1s linear infinite xDpCDq_notebooks-progress;position:absolute;inset:auto 0 0}.xDpCDq_jobError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:12px;margin:0 0 16px;padding:10px 12px;font-size:12px;line-height:1.5}.xDpCDq_studioTabs{grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;display:grid}.xDpCDq_studioTab,.xDpCDq_studioTabActive{min-height:42px;font:inherit;cursor:pointer;border:0;border-radius:12px;justify-content:center;align-items:center;padding:0 10px;font-size:12px;font-weight:600;display:flex}.xDpCDq_studioTab{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-secondary)}.xDpCDq_studioTab:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.xDpCDq_studioTabActive{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);color:var(--dsw-alias-state-business-primary);box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 28%, transparent)}.xDpCDq_studioEmpty{text-align:center;flex-direction:column;justify-content:center;align-items:center;min-height:180px;padding:20px 16px;display:flex}.xDpCDq_studioEmpty strong{font-size:12px;font-weight:620}.xDpCDq_studioEmpty p{color:var(--dsw-alias-label-caption);margin:8px 0 0;font-size:11px;line-height:1.5}.xDpCDq_studioGenerate{background:var(--dsw-alias-label-primary);width:100%;min-height:40px;color:var(--dsw-alias-bg-base);font:inherit;cursor:pointer;border:0;border-radius:12px;justify-content:center;align-items:center;gap:8px;margin-top:auto;padding:0 14px;font-size:12px;font-weight:650;display:flex}.xDpCDq_studioGenerate:hover{opacity:.9}.xDpCDq_studioGenerate:disabled{cursor:default;opacity:.4}.xDpCDq_studioPane{flex-direction:column;display:flex}@keyframes xDpCDq_notebooks-progress{0%{background-position:-40% 0}to{background-position:140% 0}}.xDpCDq_emptyPane,.xDpCDq_hint{color:var(--dsw-alias-label-caption);margin-top:18px;font-size:12px;line-height:1.6}.xDpCDq_fileChips{flex-wrap:wrap;gap:6px;margin:8px 0 0;padding:0;list-style:none;display:flex}.xDpCDq_fileChips li{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:6px;padding:4px 8px;font-size:11px;display:inline-flex}.xDpCDq_fileChips button{color:var(--dsw-alias-label-caption);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.xDpCDq_studioPane>.xDpCDq_primaryButton{margin:4px 0 12px}.xDpCDq_confirmBackdrop{z-index:110;backdrop-filter:blur(10px);background:#0c0a096b;place-items:center;padding:24px;display:grid;position:fixed;inset:0}.xDpCDq_confirmCard{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 18%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:18px;gap:10px;width:min(380px,100%);padding:22px 22px 18px;display:grid;position:relative;overflow:hidden;box-shadow:0 18px 50px #00000038}.xDpCDq_confirmCard:before{background:var(--dsw-alias-state-error-primary);content:\"\";width:3px;position:absolute;inset:0 auto 0 0}.xDpCDq_confirmMark{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);border-radius:11px;place-items:center;width:36px;height:36px;display:grid}.xDpCDq_confirmMark:after{border:1.5px solid var(--dsw-alias-state-error-primary);background:radial-gradient(circle at 50% 32%, var(--dsw-alias-state-error-primary) 1.3px, transparent 1.5px) no-repeat, linear-gradient(var(--dsw-alias-state-error-primary), var(--dsw-alias-state-error-primary)) 50% 72% / 1.5px 5px no-repeat;content:\"\";border-radius:50%;width:14px;height:14px}.xDpCDq_confirmCard h3{letter-spacing:-.02em;margin:2px 0 0;font-size:16px;font-weight:620}.xDpCDq_confirmCard p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.xDpCDq_confirmActions{justify-content:flex-end;gap:8px;margin-top:8px;display:flex}.xDpCDq_confirmCancel,.xDpCDq_confirmDelete{height:34px;font:inherit;cursor:pointer;border:0;border-radius:10px;justify-content:center;align-items:center;gap:6px;padding:0 14px;font-size:12px;font-weight:600;display:inline-flex}.xDpCDq_confirmCancel{color:var(--dsw-alias-label-secondary);background:0 0}.xDpCDq_confirmCancel:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.xDpCDq_confirmDelete{background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-bg-base)}.xDpCDq_confirmDelete:hover{opacity:.9}.xDpCDq_confirmCancel:disabled,.xDpCDq_confirmDelete:disabled{opacity:.55}.xDpCDq_expandCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:18px;gap:12px;width:min(920px,100%);max-height:min(80dvh,720px);padding:18px 20px;display:grid;overflow:auto}.xDpCDq_expandCard header{justify-content:space-between;align-items:center;display:flex}.xDpCDq_expandCard h3{margin:0;font-size:16px}@media (width<=980px){.xDpCDq_toolbar{flex-direction:column;align-items:flex-start}.xDpCDq_toolbarActions{flex-wrap:wrap;width:100%}.xDpCDq_search{flex:1;width:auto}.xDpCDq_mobilePanes{display:flex}.xDpCDq_workspaceColumns{grid-template-columns:1fr}.xDpCDq_sourcesPane,.xDpCDq_summaryPane,.xDpCDq_studioPane{border-right:0;display:none}.xDpCDq_sourcesPane[data-mobile],.xDpCDq_summaryPane[data-mobile],.xDpCDq_studioPane[data-mobile]{display:block}}@media (width<=620px){.xDpCDq_content{padding:16px 12px 36px}.xDpCDq_toolbarActions{align-items:stretch}.xDpCDq_search{flex-basis:100%;width:100%}.xDpCDq_select{flex:1}.xDpCDq_notebookGrid{grid-template-columns:1fr}.xDpCDq_workspaceHeader{flex-wrap:wrap;align-items:flex-start}.xDpCDq_modalHeader,.xDpCDq_modalBody,.xDpCDq_modalFooter{padding-inline:16px}.xDpCDq_modalFooter{flex-direction:column;align-items:stretch}.xDpCDq_modalFooter>div{justify-content:flex-end}}@media (prefers-reduced-motion:reduce){.xDpCDq_notebookCard{transition:none}.xDpCDq_spinner,.xDpCDq_progressBar{animation:none}}";
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
			"mindmapBranch": "xDpCDq_mindmapBranch",
			"mindmapCanvas": "xDpCDq_mindmapCanvas",
			"mindmapChildren": "xDpCDq_mindmapChildren",
			"mindmapFallback": "xDpCDq_mindmapFallback",
			"mindmapLabel": "xDpCDq_mindmapLabel",
			"mindmapRoot": "xDpCDq_mindmapRoot",
			"mindmapRootLabel": "xDpCDq_mindmapRootLabel",
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
		//#region lib/types/client/MermaidMindmap.js
		/** Render a Studio mindmap from Mermaid mindmap source. */
		/** Draw an indented mindmap tree, or show a short error if the source is not a diagram. */
		function MermaidMindmap({ text, invalidLabel }) {
			const tree = parseMindmapTree(text);
			if (tree === null) return text.trim() === "" ? null : (0, react_jsx_runtime.jsx)("p", {
				className: views_module_css_default.mindmapFallback,
				children: invalidLabel
			});
			return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.mindmapCanvas,
				children: (0, react_jsx_runtime.jsx)(MindmapBranch, {
					node: tree,
					root: true
				})
			});
		}
		function MindmapBranch({ node, root = false }) {
			return (0, react_jsx_runtime.jsxs)("div", {
				className: root ? views_module_css_default.mindmapRoot : views_module_css_default.mindmapBranch,
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: root ? views_module_css_default.mindmapRootLabel : views_module_css_default.mindmapLabel,
					children: node.label
				}), node.children.length === 0 ? null : (0, react_jsx_runtime.jsx)("div", {
					className: views_module_css_default.mindmapChildren,
					children: node.children.map((child, index) => (0, react_jsx_runtime.jsx)(MindmapBranch, { node: child }, `${child.label}:${String(index)}`))
				})]
			});
		}
		//#endregion
		//#region lib/types/client/NotebooksView.js
		/** Codemini-aligned notebook library, sources, overview, and Studio workspace. */
		function markdownLabels(t) {
			return {
				code: {
					copyLabel: t("markdown.copy"),
					copiedLabel: t("markdown.copied"),
					toolbarLabels: {
						codeLabel: t("markdown.code"),
						wrapLabel: t("markdown.wrap"),
						unwrapLabel: t("markdown.unwrap")
					}
				},
				footnotes: t("markdown.footnotes")
			};
		}
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
				setSelected((current) => current?.id === next.id && !notebookEntryChanged(current, next) ? current : next);
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
			if (notebookId !== void 0 && notebookId !== null && selected === null && notebookLoading) return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.shell,
				children: (0, react_jsx_runtime.jsx)("div", {
					className: views_module_css_default.content,
					children: (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.notebookLoading,
						role: "status",
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
							className: views_module_css_default.spinner,
							size: 16
						}), (0, react_jsx_runtime.jsx)("span", { children: t("workspace.loading") })]
					})
				})
			});
			if (selected !== null) return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [(0, react_jsx_runtime.jsx)(NotebookWorkspace, {
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
				}), pendingDelete === null ? null : (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
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
			return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.content,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								"data-notebooks-view": "",
								hidden: true
							}),
							onClose === void 0 ? null : (0, react_jsx_runtime.jsx)("div", {
								className: views_module_css_default.libraryTopBar,
								children: (0, react_jsx_runtime.jsxs)("button", {
									className: views_module_css_default.backButton,
									type: "button",
									"aria-label": t("library.backAria"),
									onClick: onClose,
									children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineMedium, { size: 15 }), t("library.back")]
								})
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.toolbar,
								children: [(0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.filters,
									"aria-label": t("library.filterAria"),
									children: [
										["all", "filter.all"],
										["manual", "filter.manual"],
										["url", "filter.url"],
										["document", "filter.document"]
									].map(([id, key]) => (0, react_jsx_runtime.jsx)("button", {
										className: filter === id ? views_module_css_default.activeChip : views_module_css_default.chip,
										type: "button",
										"aria-current": filter === id ? "page" : void 0,
										onClick: () => {
											setFilter(id);
										},
										children: t(key)
									}, id))
								}), (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.toolbarActions,
									children: [
										(0, react_jsx_runtime.jsx)("input", {
											className: views_module_css_default.search,
											value: query,
											onChange: (event) => {
												setQuery(event.target.value);
											},
											placeholder: t("toolbar.search"),
											"aria-label": t("toolbar.searchAria")
										}),
										(0, react_jsx_runtime.jsxs)("select", {
											className: views_module_css_default.select,
											value: sort,
											onChange: (event) => {
												setSort(event.target.value);
											},
											"aria-label": t("toolbar.sortAria"),
											children: [(0, react_jsx_runtime.jsx)("option", {
												value: "recent",
												children: t("toolbar.sortRecent")
											}), (0, react_jsx_runtime.jsx)("option", {
												value: "title",
												children: t("toolbar.sortTitle")
											})]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: views_module_css_default.viewToggle,
											children: [(0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.gridView"),
												"aria-pressed": viewMode === "grid",
												"data-active": viewMode === "grid",
												onClick: () => {
													setViewMode("grid");
												},
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutlineMedium, { size: 16 })
											}), (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.listView"),
												"aria-pressed": viewMode === "list",
												"data-active": viewMode === "list",
												onClick: () => {
													setViewMode("list");
												},
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 16 })
											})]
										}),
										(0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.primaryButton,
											type: "button",
											onClick: () => {
												setError(null);
												setComposerOpen(true);
											},
											children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 15 }), t("action.new")]
										})
									]
								})]
							}),
							(0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.library,
								children: [
									(0, react_jsx_runtime.jsx)("header", {
										className: views_module_css_default.libraryTitle,
										children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: t("library.title") }), (0, react_jsx_runtime.jsx)("p", { children: t("library.itemCount", { count: visible.length }) })] })
									}),
									error === null || composerOpen ? null : (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.error,
										role: "alert",
										children: error
									}),
									visible.length === 0 ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.emptyState,
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 22 })
											}),
											(0, react_jsx_runtime.jsx)("strong", { children: query === "" ? t("empty.none") : t("empty.noMatch") }),
											(0, react_jsx_runtime.jsx)("p", { children: query === "" ? t("empty.hintStart") : t("empty.hintNoMatch") }),
											query === "" ? (0, react_jsx_runtime.jsxs)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													setComposerOpen(true);
												},
												children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 15 }), t("action.new")]
											}) : null
										]
									}) : (0, react_jsx_runtime.jsxs)("div", {
										className: viewMode === "grid" ? views_module_css_default.notebookGrid : views_module_css_default.notebookList,
										"aria-label": t("library.title"),
										children: [viewMode === "grid" ? (0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.createCard,
											type: "button",
											onClick: () => {
												setComposerOpen(true);
											},
											children: [(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 22 }) }), (0, react_jsx_runtime.jsx)("strong", { children: t("action.new") })]
										}) : null, visible.map((entry, index) => (0, react_jsx_runtime.jsx)(NotebookCard, {
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
					composerOpen ? (0, react_jsx_runtime.jsx)(NotebookComposer, {
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
					pendingDelete === null ? null : (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
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
			const jobFailed = job !== null && job.status === "failed" && job.kind === "summary";
			const busy = !jobFailed && job !== null && (job.status === "pending" || job.status === "running");
			const fetching = busy && job.kind === "summary" && job.stage === "fetch";
			const summarizing = busy && job.kind === "summary" && job.stage === "generate";
			const statusLine = jobFailed ? t("overview.failed", { error: job.errorText || t("overview.empty") }) : fetching ? t("overview.fetching", { detail: job.partialText }) : summarizing ? t("overview.summarizing") : t("card.sources", {
				count: entry.sources.length,
				date: formatDate(entry.updatedAt)
			});
			return (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.notebookCard,
				"data-list": list || void 0,
				"data-busy": busy || void 0,
				"data-failed": jobFailed || void 0,
				style: { "--card-tint": CARD_TONES[index % CARD_TONES.length] },
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.cardOpen,
						type: "button",
						onClick: onOpen,
						"aria-label": t("card.openAria", { title: entry.title })
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.cardEmoji,
						children: emoji || sourceEmoji(entry)
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.cardInfo,
						children: [
							(0, react_jsx_runtime.jsx)("h3", { children: title }),
							(0, react_jsx_runtime.jsx)("p", { children: jobFailed ? job.errorText || t("overview.empty") : busy ? fetching ? t("card.fetching") : t("card.summarizing") : entry.summary || entry.content }),
							(0, react_jsx_runtime.jsx)("span", { children: jobFailed ? statusLine : busy ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
								className: views_module_css_default.spinner,
								size: 11
							}), statusLine] }) : statusLine })
						]
					}),
					(0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.deleteButton,
						type: "button",
						"aria-label": t("workspace.delete"),
						onClick: (event) => {
							event.stopPropagation();
							onDelete();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 15 })
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
			return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.modalBackdrop,
				role: "presentation",
				children: (0, react_jsx_runtime.jsxs)("form", {
					className: views_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "new-notebook-title",
					onSubmit: submit,
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalHeader,
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.modalHeading,
								children: [(0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 18 })
								}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", {
									id: "new-notebook-title",
									children: t("composer.title")
								}), (0, react_jsx_runtime.jsx)("p", { children: t("composer.subtitle") })] })]
							}), (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.iconButton,
								type: "button",
								"aria-label": t("composer.closeAria"),
								disabled: busy,
								onClick: onClose,
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 16 })
							})]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalBody,
							children: [
								(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.titleLabel"), (0, react_jsx_runtime.jsx)("input", {
									className: views_module_css_default.input,
									value: title,
									onChange: (event) => {
										setTitle(event.target.value);
									},
									placeholder: t("composer.titlePlaceholder")
								})] }),
								(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.urls"), (0, react_jsx_runtime.jsx)("textarea", {
									className: views_module_css_default.textarea,
									value: urls,
									onChange: (event) => {
										setUrls(event.target.value);
									},
									placeholder: t("composer.urlsPlaceholder")
								})] }),
								(0, react_jsx_runtime.jsxs)("label", { children: [
									t("composer.documents"),
									(0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.fileRow,
										children: (0, react_jsx_runtime.jsxs)("label", {
											className: views_module_css_default.secondaryButton,
											children: [t("composer.chooseDocuments"), (0, react_jsx_runtime.jsx)("input", {
												hidden: true,
												multiple: true,
												type: "file",
												accept: ".txt,.md,text/plain,text/markdown",
												onChange: pickFiles
											})]
										})
									}),
									documents.length === 0 ? null : (0, react_jsx_runtime.jsx)("ul", {
										className: views_module_css_default.fileChips,
										children: documents.map((document, index) => (0, react_jsx_runtime.jsxs)("li", { children: [document.name, (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": document.name,
											onClick: () => {
												setDocuments((current) => current.filter((_, item) => item !== index));
											},
											children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 12 })
										})] }, `${document.name}-${index}`))
									})
								] }),
								(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.content"), (0, react_jsx_runtime.jsx)("textarea", {
									autoFocus: true,
									className: views_module_css_default.textarea,
									value: content,
									onChange: (event) => {
										setContent(event.target.value);
									},
									placeholder: t("composer.contentPlaceholder")
								})] }),
								error === null ? null : (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.modalError,
									role: "alert",
									children: error
								})
							]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalFooter,
							children: [(0, react_jsx_runtime.jsx)("span", { children: t("composer.footer") }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.secondaryButton,
								type: "button",
								disabled: busy,
								onClick: onClose,
								children: t("action.cancel")
							}), (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.primaryButton,
								type: "submit",
								disabled: busy || empty,
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
									className: views_module_css_default.spinner,
									size: 14
								}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 14 }), busy ? t("action.creating") : t("action.create")]
							})] })]
						})
					]
				})
			});
		}
		function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }) {
			const [, title] = splitEmoji(pending.title);
			const name = title || pending.title;
			return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.confirmBackdrop,
				role: "presentation",
				onClick: () => {
					if (!busy) onCancel();
				},
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.confirmCard,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "delete-notebook-title",
					onClick: (event) => {
						event.stopPropagation();
					},
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.confirmMark,
							"aria-hidden": "true"
						}),
						(0, react_jsx_runtime.jsx)("h3", {
							id: "delete-notebook-title",
							children: t("delete.title")
						}),
						(0, react_jsx_runtime.jsx)("p", { children: t("delete.body", { title: name }) }),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.confirmActions,
							children: [(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.confirmCancel,
								type: "button",
								disabled: busy,
								onClick: onCancel,
								children: t("action.cancel")
							}), (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.confirmDelete,
								type: "button",
								disabled: busy,
								onClick: onConfirm,
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
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
			const labels = (0, react.useMemo)(() => markdownLabels(t), [t]);
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
			const jobFailed = job !== null && job.status === "failed" && job.kind === "summary";
			const summarizing = !jobFailed && job !== null && job.kind === "summary" && (job.status === "pending" || job.status === "running");
			const fetching = summarizing && job.stage === "fetch";
			const generatingStudio = job !== null && job.kind === studioKind && (job.status === "pending" || job.status === "running");
			const studioFailed = job !== null && job.status === "failed" && job.kind === studioKind;
			const artifact = entry.artifacts.find((item) => item.kind === studioKind);
			const summaryDraft = summarizing && !fetching ? job.partialText : "";
			const summaryText = summaryDraft.trim() !== "" ? summaryDraft : entry.summary;
			const studioText = generatingStudio && job.partialText.trim() !== "" ? job.partialText : artifact?.content ?? "";
			const mindmapReady = studioKind === "mindmap" && parseMindmapTree(studioText) !== null;
			const viewing = entry.sources.find((source) => source.id === viewingSourceId) ?? null;
			const jobLive = summarizing || generatingStudio;
			(0, react.useEffect)(() => {
				if (!jobLive) return;
				const timer = window.setInterval(() => {
					api.get(entry.id).then((next) => {
						if (next !== null) onChange(next);
					}).catch(() => void 0);
				}, 2e3);
				return () => {
					window.clearInterval(timer);
				};
			}, [
				api,
				entry.id,
				onChange,
				jobLive
			]);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.workspace,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: views_module_css_default.workspaceHeader,
						children: [
							(0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.backButton,
								type: "button",
								onClick: onBack,
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineMedium, { size: 15 }), t("workspace.back")]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.workspaceHeading,
								children: [(0, react_jsx_runtime.jsx)("p", {
									className: views_module_css_default.eyebrow,
									children: t("workspace.notebook")
								}), (0, react_jsx_runtime.jsx)("h2", { children: entry.title })]
							}),
							(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.deleteText,
								type: "button",
								onClick: onDelete,
								children: t("workspace.delete")
							})
						]
					}),
					error === null ? null : (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.error,
						role: "alert",
						children: error
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.mobilePanes,
						role: "tablist",
						"aria-label": t("library.title"),
						children: [
							["sources", "pane.sources"],
							["summary", "pane.summary"],
							["studio", "pane.studio"]
						].map(([id, key]) => (0, react_jsx_runtime.jsx)("button", {
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
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.workspaceColumns,
						"data-pane": mobilePane,
						children: [
							(0, react_jsx_runtime.jsxs)("aside", {
								className: views_module_css_default.sourcesPane,
								"data-mobile": mobilePane === "sources" || void 0,
								children: [
									(0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneHeader,
										children: [(0, react_jsx_runtime.jsx)("h3", { children: t("sources.title") }), (0, react_jsx_runtime.jsx)("span", { children: entry.sources.length })]
									}),
									(0, react_jsx_runtime.jsx)("textarea", {
										className: views_module_css_default.sourceInput,
										value: sourceDraft,
										onChange: (event) => {
											setSourceDraft(event.target.value);
										},
										placeholder: t("sources.urlPlaceholder")
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.sourceActions,
										children: [(0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.secondaryButton,
											type: "button",
											disabled: busy,
											onClick: addUrls,
											children: t("sources.add")
										}), (0, react_jsx_runtime.jsxs)("label", {
											className: views_module_css_default.secondaryButton,
											children: [t("sources.upload"), (0, react_jsx_runtime.jsx)("input", {
												hidden: true,
												multiple: true,
												type: "file",
												accept: ".txt,.md,text/plain,text/markdown",
												onChange: upload
											})]
										})]
									}),
									(0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.sourceList,
										children: entry.sources.map((source) => (0, react_jsx_runtime.jsx)(SourceRow, {
											source,
											job: entry.latestJob,
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
							(0, react_jsx_runtime.jsx)("main", {
								className: views_module_css_default.summaryPane,
								"data-mobile": mobilePane === "summary" || void 0,
								children: viewing === null ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									(0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneHeader,
										children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("overview.title") }), (0, react_jsx_runtime.jsx)("p", { children: t("overview.hint") })] }), (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.iconButton,
											type: "button",
											disabled: busy || summarizing,
											"aria-label": t("overview.resummarize"),
											title: t("overview.resummarize"),
											onClick: () => {
												run(() => api.summarize(entry.id));
											},
											children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
												className: summarizing ? views_module_css_default.spinner : void 0,
												size: 15
											})
										})]
									}),
									summarizing ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.progress,
										role: "status",
										children: [
											(0, react_jsx_runtime.jsx)("span", { className: views_module_css_default.progressBar }),
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
												className: views_module_css_default.spinner,
												size: 14
											}),
											(0, react_jsx_runtime.jsx)("span", { children: fetching ? t("overview.fetching", { detail: job.partialText }) : t("overview.summarizing") })
										]
									}) : null,
									jobFailed ? (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.jobError,
										role: "alert",
										children: t("overview.failed", { error: job.errorText || t("overview.empty") })
									}) : null,
									summaryText.trim() === "" ? (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.emptyPane,
										children: summarizing ? null : t("overview.empty")
									}) : (0, react_jsx_runtime.jsx)("article", {
										className: views_module_css_default.markdownDocument,
										"data-streaming": summarizing && !fetching || void 0,
										children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
											text: summaryText,
											streaming: summarizing && !fetching,
											labels
										})
									})
								] }) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.paneHeader,
									children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("source.original") }), (0, react_jsx_runtime.jsx)("p", { children: viewing.name })] }), (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.paneActions,
										children: [viewing.url === null ? null : (0, react_jsx_runtime.jsxs)("a", {
											className: views_module_css_default.secondaryButton,
											href: viewing.url,
											target: "_blank",
											rel: "noreferrer",
											children: [t("sources.openLink"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, { size: 13 })]
										}), (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.secondaryButton,
											type: "button",
											onClick: () => {
												setViewingSourceId(null);
											},
											children: t("overview.title")
										})]
									})]
								}), viewing.content.trim() === "" ? (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.emptyPane,
									children: viewing.status === "pending_fetch" ? t("sources.pending") : t("source.empty")
								}) : (0, react_jsx_runtime.jsx)("article", {
									className: views_module_css_default.markdownDocument,
									children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
										text: viewing.content,
										labels
									})
								})] })
							}),
							(0, react_jsx_runtime.jsxs)("aside", {
								className: views_module_css_default.studioPane,
								"data-mobile": mobilePane === "studio" || void 0,
								children: [
									(0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.paneHeader,
										children: (0, react_jsx_runtime.jsx)("h3", { children: t("studio.title") })
									}),
									(0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.studioTabs,
										children: ["mindmap", "report"].map((kind) => (0, react_jsx_runtime.jsx)("button", {
											className: studioKind === kind ? views_module_css_default.studioTabActive : views_module_css_default.studioTab,
											type: "button",
											onClick: () => {
												setStudioKind(kind);
											},
											children: t(kind === "mindmap" ? "studio.mindmap" : "studio.report")
										}, kind))
									}),
									generatingStudio ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.progress,
										role: "status",
										children: [
											(0, react_jsx_runtime.jsx)("span", { className: views_module_css_default.progressBar }),
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
												className: views_module_css_default.spinner,
												size: 14
											}),
											(0, react_jsx_runtime.jsx)("span", { children: t("studio.generating") })
										]
									}) : null,
									studioFailed ? (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.jobError,
										role: "alert",
										children: t("studio.failed", { error: job.errorText || t("studio.empty") })
									}) : null,
									studioText.trim() === "" ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.studioEmpty,
										children: [(0, react_jsx_runtime.jsx)("strong", { children: studioKind === "mindmap" ? t("studio.emptyMindmap") : t("studio.emptyReport") }), (0, react_jsx_runtime.jsx)("p", { children: t("studio.empty") })]
									}) : (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.artifactPreview,
										children: [mindmapReady ? (0, react_jsx_runtime.jsx)("button", {
											className: views_module_css_default.ghostButton,
											type: "button",
											onClick: () => {
												setExpandMindmap(true);
											},
											children: t("studio.expand")
										}) : null, studioKind === "mindmap" ? (0, react_jsx_runtime.jsx)(MermaidMindmap, {
											text: studioText,
											invalidLabel: t("studio.mindmapInvalid")
										}) : (0, react_jsx_runtime.jsx)("article", {
											className: views_module_css_default.markdownDocument,
											children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
												text: studioText,
												streaming: generatingStudio,
												labels
											})
										})]
									}),
									(0, react_jsx_runtime.jsxs)("button", {
										className: views_module_css_default.studioGenerate,
										type: "button",
										disabled: busy || generatingStudio || summarizing,
										onClick: () => {
											run(() => api.generateStudio(entry.id, studioKind));
										},
										children: [generatingStudio ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
											className: views_module_css_default.spinner,
											size: 14
										}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 14 }), generatingStudio ? t("studio.generating") : t("studio.generate")]
									})
								]
							})
						]
					}),
					expandMindmap && mindmapReady ? (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.confirmBackdrop,
						role: "presentation",
						onClick: () => {
							setExpandMindmap(false);
						},
						children: (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.expandCard,
							role: "dialog",
							"aria-modal": "true",
							"aria-label": t("studio.mindmap"),
							onClick: (event) => {
								event.stopPropagation();
							},
							children: [(0, react_jsx_runtime.jsxs)("header", { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("studio.mindmap") }), (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.iconButton,
								type: "button",
								"aria-label": t("composer.closeAria"),
								onClick: () => {
									setExpandMindmap(false);
								},
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 16 })
							})] }), (0, react_jsx_runtime.jsx)("article", {
								className: views_module_css_default.markdownDocument,
								children: (0, react_jsx_runtime.jsx)(MermaidMindmap, {
									text: studioText,
									invalidLabel: t("studio.mindmapInvalid")
								})
							})]
						})
					}) : null
				]
			});
		}
		function SourceRow({ source, job, t, active, onOpen, onToggle, onRemove }) {
			const summaryJob = job !== null && job.kind === "summary" && (job.status === "pending" || job.status === "running");
			const fetchingThis = summaryJob && job.stage === "fetch" && source.status === "pending_fetch";
			const statusLabel = fetchingThis ? t("sources.pending") : source.status === "pending_fetch" && summaryJob && job.stage === "generate" ? source.content.trim() !== "" ? hostname(source.url ?? "") : t("sources.failed") : source.status === "pending_fetch" ? t("sources.pending") : source.status === "failed" ? t("sources.failed") : source.kind === "url" ? hostname(source.url ?? "") : source.kind;
			return (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.sourceRow,
				"data-selected": source.selected || void 0,
				"data-active": active || void 0,
				"data-fetching": fetchingThis || void 0,
				children: [
					(0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: source.selected,
						onChange: onToggle,
						"aria-label": source.name
					}),
					(0, react_jsx_runtime.jsxs)("button", {
						className: views_module_css_default.sourceOpen,
						type: "button",
						onClick: onOpen,
						children: [(0, react_jsx_runtime.jsx)("strong", { children: source.name }), (0, react_jsx_runtime.jsx)("span", { children: statusLabel })]
					}),
					source.url === null ? null : (0, react_jsx_runtime.jsx)("a", {
						className: views_module_css_default.sourceLink,
						href: source.url,
						target: "_blank",
						rel: "noreferrer",
						"aria-label": t("sources.openLink"),
						onClick: (event) => {
							event.stopPropagation();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, { size: 13 })
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRemove,
						"aria-label": t("sources.remove"),
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 14 })
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
		function notebookEntryChanged(current, next) {
			if (current === null) return true;
			if (current.updatedAt !== next.updatedAt) return true;
			if (current.summary !== next.summary) return true;
			if (current.content !== next.content) return true;
			const cj = current.latestJob;
			const nj = next.latestJob;
			if (cj !== null || nj !== null) {
				if (cj === null || nj === null) return true;
				if (cj.id !== nj.id || cj.status !== nj.status || cj.stage !== nj.stage || cj.partialText !== nj.partialText || cj.errorText !== nj.errorText) return true;
			}
			if (current.sources.length !== next.sources.length) return true;
			for (let index = 0; index < next.sources.length; index += 1) {
				const cs = current.sources[index];
				const ns = next.sources[index];
				if (cs === void 0 || ns.id !== cs.id || ns.status !== cs.status || ns.content !== cs.content || ns.name !== cs.name || ns.selected !== cs.selected) return true;
			}
			return false;
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
		//#region lib/types/client/NotebooksOverlay.js
		/** Frame-wide overlay hosting the notebook library and workspace. */
		/** Keep render failures inside the overlay instead of abdicating the shell slot. */
		var NotebooksViewCrashBoundary = class extends react.Component {
			state = { error: null };
			static getDerivedStateFromError(error) {
				return { error };
			}
			render() {
				if (this.state.error === null) return this.props.children;
				return (0, react_jsx_runtime.jsxs)("div", {
					className: overlay_module_css_default.crash,
					role: "alert",
					children: [
						(0, react_jsx_runtime.jsx)("h3", { children: this.props.t("overlay.crashTitle") }),
						(0, react_jsx_runtime.jsx)("p", { children: this.props.t("overlay.crashHint") }),
						(0, react_jsx_runtime.jsx)("code", { children: this.state.error.message }),
						(0, react_jsx_runtime.jsx)("button", {
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
			return (0, react_jsx_runtime.jsx)("div", {
				className: overlay_module_css_default.overlay,
				"data-notebooks-overlay": true,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("view.notebooks"),
				children: (0, react_jsx_runtime.jsx)(NotebooksViewCrashBoundary, {
					t,
					onReset: () => {
						face.store.setNotebookId(null);
					},
					children: (0, react_jsx_runtime.jsx)(NotebooksView, {
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
		//#region lib/types/client/composer-notebook.js
		/** Composer helpers: insert or clear one notebook reference occurrence. */
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
		//#region lib/types/client/NotebooksComposerButton.js
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
			const panel = (0, react_jsx_runtime.jsxs)("div", {
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
				children: [(0, react_jsx_runtime.jsxs)("div", {
					className: composer_picker_module_css_default.header,
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: composer_picker_module_css_default.headerRow,
							children: [(0, react_jsx_runtime.jsx)("div", {
								className: composer_picker_module_css_default.title,
								children: t("picker.title")
							}), (0, react_jsx_runtime.jsx)("span", {
								className: composer_picker_module_css_default.count,
								children: filtered.length
							})]
						}),
						(0, react_jsx_runtime.jsx)("p", {
							className: composer_picker_module_css_default.help,
							children: t("picker.help")
						}),
						(0, react_jsx_runtime.jsxs)("label", {
							className: composer_picker_module_css_default.search,
							children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutlineMedium, { size: 14 }), (0, react_jsx_runtime.jsx)("input", {
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
				}), (0, react_jsx_runtime.jsx)("div", {
					className: composer_picker_module_css_default.list,
					children: loading ? (0, react_jsx_runtime.jsx)("div", {
						className: composer_picker_module_css_default.loading,
						children: t("picker.loading")
					}) : filtered.length === 0 ? (0, react_jsx_runtime.jsx)("div", {
						className: composer_picker_module_css_default.empty,
						children: t("picker.empty")
					}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [visible.map((entry) => {
						const blocked = isNotebookAskBlocked(entry);
						const active = activeOccurrence?.clipboardText === entry.mention || activeOccurrence?.ref === entry.mention;
						return (0, react_jsx_runtime.jsxs)("div", {
							className: active ? `${composer_picker_module_css_default.entry} ${composer_picker_module_css_default.entryActive}` : composer_picker_module_css_default.entry,
							children: [(0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: composer_picker_module_css_default.entryPick,
								disabled: blocked,
								onClick: () => {
									pickEntry(entry);
								},
								children: [(0, react_jsx_runtime.jsxs)("div", {
									className: composer_picker_module_css_default.entryTop,
									children: [(0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.entryTitle,
										children: entry.title
									}), active ? (0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.badge,
										children: t("picker.active")
									}) : blocked ? (0, react_jsx_runtime.jsx)("span", {
										className: composer_picker_module_css_default.badge,
										children: t("picker.summarizing")
									}) : null]
								}), (0, react_jsx_runtime.jsx)("span", {
									className: composer_picker_module_css_default.entryPreview,
									children: entry.summary
								})]
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: composer_picker_module_css_default.entryOpen,
								title: t("cite.open"),
								"aria-label": `${t("cite.open")}: ${entry.title}`,
								onClick: () => {
									openNotebook(entry.id);
									setOpen(false);
								},
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, { size: 15 })
							})]
						}, entry.id);
					}), hasMore ? (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: composer_picker_module_css_default.more,
						onClick: () => {
							setVisibleCount((count) => count + PAGE_SIZE);
						},
						children: t("picker.showMore", { count: String(filtered.length - visible.length) })
					}) : null] })
				})]
			});
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				(0, react_jsx_runtime.jsx)("button", {
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
					children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 18 })
				}),
				open && typeof document !== "undefined" ? (0, react_dom.createPortal)(panel, document.body) : null,
				error === "" ? null : (0, react_jsx_runtime.jsx)("span", {
					className: composer_picker_module_css_default.dockError,
					children: error
				})
			] });
		}
		//#endregion
		//#region lib/types/client/NotebooksComposerDock.js
		/** Show the active notebook cite chip when the composer holds one occurrence. */
		function NotebooksComposerDock({ sessionId, input, t, clearNotebook, openNotebook }) {
			const occurrence = input.occurrences.find((item) => item.source === "notebook");
			if (occurrence === void 0) return null;
			const notebookId = parseNotebookMentions(occurrence.clipboardText).ids[0];
			return (0, react_jsx_runtime.jsxs)("span", {
				className: composer_picker_module_css_default.dockChip,
				children: [(0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: composer_picker_module_css_default.dockOpen,
					title: t("cite.open"),
					"aria-label": `${t("cite.open")}: ${occurrence.label}`,
					onClick: () => {
						if (notebookId !== void 0) openNotebook(notebookId);
					},
					children: [
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 14 }),
						(0, react_jsx_runtime.jsx)("span", {
							className: composer_picker_module_css_default.dockLabel,
							children: occurrence.label
						}),
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, { size: 11 })
					]
				}), (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: composer_picker_module_css_default.dockRemove,
					title: t("picker.remove"),
					"aria-label": t("picker.remove"),
					onClick: () => {
						clearNotebook(sessionId);
					},
					children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 11 })
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
		//#region lib/types/client/NotebooksCiteChip.js
		/** Render one notebook cite chip that opens the overlay workspace. */
		function NotebooksCiteChip({ node, t, store }) {
			const data = node.data;
			return (0, react_jsx_runtime.jsx)("div", {
				className: notebook_cite_module_css_default.row,
				"data-notebooks-cite": data.notebookId,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: notebook_cite_module_css_default.chip,
					title: t("cite.open"),
					"aria-label": `${t("cite.open")}: ${data.title}`,
					onClick: () => {
						store.setNotebookId(data.notebookId);
					},
					children: [
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 14 }),
						(0, react_jsx_runtime.jsx)("span", {
							className: notebook_cite_module_css_default.label,
							children: data.title
						}),
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, {
							size: 12,
							className: notebook_cite_module_css_default.external
						})
					]
				})
			});
		}
		//#endregion
		//#region lib/types/client/notebook-cite-definition.js
		/** Conversation node for a clickable notebook badge under citing user bubbles. */
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
		function citeFromRecallSource(source, content) {
			if (readSourceField(source, "kind") !== "notebooks-recall") return null;
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
			return citeFromRecallSource(data.source, content) ?? citeFromUserMessage(content);
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
					anchorSeq: sourceKind === "notebooks-recall" ? seq - .1 : seq + .1,
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
		//#region lib/types/client/index.js
		/** Client mount for the notebook Remote contribution. */
		/** Required services: Remote client, slots, locale, sessions, conversation nodes, and optional triggers. */
		const inject = [
			"remote",
			"slots",
			"locale",
			"sessions",
			"inputTriggers",
			"uiConversation"
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
			ctx.uiConversation.events.register(notebookCiteDefinition);
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