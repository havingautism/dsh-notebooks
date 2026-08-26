import { randomUUID } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { createUserMessage, freezeMessage } from "@deepseek-ai/dsh-llm";
import { SessionId } from "@deepseek-ai/dsh-session";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { homedir } from "node:os";
import * as StorageSqlite from "@deepseek-ai/dsh-storage-sqlite";
import * as WebFetchHttp from "@deepseek-ai/dsh-web-fetch-http";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
//#region lib/types/generate.js
/** Pure notebook generation helpers shared by the service and tests. */
const TITLE_PATTERN = /^(?:#{1,6}\s*)?(?:\*\*)?Title(?:\*\*)?:\s*(?:\*\*)?\s*/i;
const SUMMARY_PATTERN = /^(?:#{1,6}\s*)?(?:\*\*)?Summary(?:\*\*)?:\s*(?:\*\*)?\s*$/i;
/** Sources currently selected for summary and Studio work. */
function selectedSources(entry) {
	return entry.sources.filter((source) => source.selected);
}
/** Combine selected source bodies into one bounded generation input. */
function combineSources(sources, maxChars = 24e3) {
	let remaining = maxChars;
	const sections = [];
	for (const source of sources) {
		if (remaining <= 0) break;
		const body = source.content.trim();
		if (body === "") continue;
		const clipped = body.slice(0, remaining);
		sections.push([
			`## Source: ${source.name || source.url || "Untitled"}`,
			source.url === null ? "" : `URL: ${source.url}`,
			clipped
		].filter((part) => part !== "").join("\n"));
		remaining -= clipped.length;
	}
	return sections.join("\n\n---\n\n");
}
/** Parse a model summary that starts with Title/Summary markers. */
function parseGeneratedSummary(rawResult) {
	const raw = rawResult.trim();
	if (raw === "") return {
		title: "",
		summary: ""
	};
	const lines = raw.split(/\r?\n/);
	const titleIndex = lines.findIndex((line) => TITLE_PATTERN.test(line.trim()));
	const summaryIndex = lines.findIndex((line) => SUMMARY_PATTERN.test(line.trim()));
	const title = titleIndex >= 0 ? normalizeGeneratedTitle(lines[titleIndex].trim().replace(TITLE_PATTERN, "")) : "";
	let summary = raw;
	if (summaryIndex >= 0) summary = lines.slice(summaryIndex + 1).join("\n").trim();
	else if (titleIndex >= 0) summary = lines.filter((_, index) => index !== titleIndex).join("\n").trim();
	return {
		title,
		summary
	};
}
/** Ensure a generated title has an emoji and stays short. */
function normalizeGeneratedTitle(rawTitle) {
	let title = rawTitle.replace(/^#+\s*/u, "").replace(/\*\*/gu, "").replace(/\s+/gu, " ").trim();
	if (title === "") return "";
	if (!/\p{Extended_Pictographic}/u.test(title)) title = `📝 ${title}`;
	return Array.from(title).slice(0, 64).join("").trim();
}
/** Fallback title when the model omits one. */
function fallbackTitle(input) {
	const explicit = input.title?.trim() ?? "";
	const sourceUrl = input.sourceUrl?.trim() ?? "";
	if (explicit !== "" && explicit !== sourceUrl) return normalizeGeneratedTitle(explicit);
	const firstContentLine = (input.contentText ?? "").split(/\r?\n/).map((line) => line.replace(/^#+\s*/u, "").trim()).find((line) => line !== "");
	if (firstContentLine !== void 0) return normalizeGeneratedTitle(Array.from(firstContentLine).slice(0, 36).join(""));
	try {
		return normalizeGeneratedTitle(new URL(sourceUrl).hostname.replace(/^www\./u, ""));
	} catch {
		return normalizeGeneratedTitle(sourceUrl);
	}
}
/** Fallback title for a saved chat answer. */
function fallbackChatTitle(questionText, answerText) {
	const question = questionText.trim();
	if (question !== "") return normalizeGeneratedTitle(Array.from(question).slice(0, 36).join(""));
	const firstAnswerLine = answerText.split(/\r?\n/).map((line) => line.replace(/^#+\s*/u, "").trim()).find((line) => line !== "");
	return firstAnswerLine === void 0 ? "📝 Chat answer" : normalizeGeneratedTitle(Array.from(firstAnswerLine).slice(0, 36).join(""));
}
/** Library card kind derived from attached sources. */
function entryKindFromSources(sources) {
	if (sources.length > 1) return "notebook";
	return sources[0]?.kind ?? "manual";
}
/** Follow-up context injected beside a citing user message. */
function buildAskContext(entry, summary) {
	const sources = selectedSources(entry);
	const lines = [
		"<notebook_context>",
		"The user previously saved and read the following multi-source note.",
		"Treat its synthesized summary and source list as user-provided reading context.",
		"",
		`Title: ${entry.title || "(untitled)"}`,
		`Entry ID: ${entry.id}`
	];
	if (entry.sourceUrl !== null) lines.push(`Source URL: ${entry.sourceUrl}`);
	if (sources.length > 0) {
		lines.push(`Selected sources (${String(sources.length)}):`);
		for (const source of sources) lines.push(`- ${source.name || source.url || "Untitled source"}${source.url === null ? "" : ` — ${source.url}`}`);
	}
	lines.push("", "Summary:", summary === "" ? "No summary available yet." : summary, "</notebook_context>");
	return lines.join("\n");
}
/** Whether a URL can be fetched as a notebook source. */
function isAbsoluteHttpUrl(value) {
	return /^https?:\/\//iu.test(value.trim());
}
const JINA_TIMEOUT_MS = 8e3;
function jinaSignal(userSignal) {
	const timeout = AbortSignal.timeout(JINA_TIMEOUT_MS);
	if (userSignal === void 0) return timeout;
	const any = AbortSignal.any;
	return any === void 0 ? timeout : any([userSignal, timeout]);
}
/**
* Pull a readable title and body out of a web-fetch HTML fallback.
* Jina already returns markdown; this only runs when the fallback stored a page.
*/
function extractHtmlArticle(html, sourceUrl = "") {
	const raw = html.trim();
	if (raw === "" || !/<(?:html|head|body|article|div|meta|title)\b/i.test(raw)) return {
		title: "",
		content: raw
	};
	const ogTitle = raw.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ?? raw.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1];
	const titleTag = raw.match(/<title[^>]*>([^<]+)/i)?.[1];
	const title = decodeHtmlEntities((ogTitle ?? titleTag ?? "").trim());
	const content = decodeHtmlEntities((raw.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? raw.match(/class=["'][^"']*article-content[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section|article)>/i)?.[1] ?? raw.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? raw).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/h[1-6]>/gi, "\n\n").replace(/<[^>]+>/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim());
	return {
		title: title || hostnameOf(sourceUrl),
		content
	};
}
function decodeHtmlEntities(value) {
	return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
function hostnameOf(value) {
	try {
		return new URL(value).hostname.replace(/^www\./u, "");
	} catch {
		return value;
	}
}
/** Jina Reader proxy URL for one source page, matching Codemini scrapbook. */
function jinaReaderUrl(sourceUrl) {
	return `https://r.jina.ai/http://${sourceUrl.trim().replace(/^https?:\/\//iu, "")}`;
}
/**
* Parse a Jina Reader response into title and markdown body.
* Strips Title/URL/Published/Warning metadata lines, matching Codemini.
*/
function parseJinaReaderResponse(text, sourceUrl = "") {
	const raw = text.trim();
	if (raw === "") return {
		title: sourceUrl.trim(),
		text: ""
	};
	const titleMatch = raw.match(/^Title:\s*(.+)$/m);
	const cleaned = (raw.match(/(?:^|\n)Markdown Content:\s*\n([\s\S]*)$/)?.[1] ?? raw).split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "" && !/^Warning:/i.test(line) && !/^URL Source:/i.test(line) && !/^Published Time:/i.test(line) && !/^Title:/i.test(line)).join("\n").trim();
	return {
		title: (titleMatch?.[1] ?? sourceUrl).trim(),
		text: cleaned
	};
}
/**
* Fetch one notebook URL the Codemini way: Jina Reader first, then `ctx.web.fetch`.
* Jina does not require `web-fetch-http`; the fallback does.
*/
async function fetchNotebookUrl(url, options = {}) {
	const fetchImpl = options.fetchImpl ?? globalThis.fetch;
	try {
		const response = await fetchImpl(jinaReaderUrl(url), {
			headers: { "user-agent": options.userAgent ?? "dsh-notebooks scrapbook-fetch" },
			signal: jinaSignal(options.signal)
		});
		if (response.ok) {
			const text = (await response.text()).trim();
			if (text !== "") {
				const parsed = parseJinaReaderResponse(text, url);
				if (parsed.text !== "") return {
					title: parsed.title,
					content: parsed.text
				};
			}
		}
	} catch {}
	const web = options.web;
	if (web === void 0) throw new Error("notebooks: web fetch is not available");
	const result = await web.fetch({ url }, options.signal);
	const extracted = extractHtmlArticle(result.body.content.trim(), result.url || url);
	let title = extracted.title;
	if (title === "") try {
		title = new URL(result.url || url).hostname.replace(/^www\./u, "");
	} catch {
		title = url;
	}
	return {
		title,
		content: extracted.content
	};
}
/** Clip generation input and mark truncation. */
function truncateForGeneration(text, maxChars = 12e3) {
	const normalized = text.trim();
	if (normalized.length <= maxChars) return normalized;
	return `${normalized.slice(0, maxChars).trimEnd()}\n\n[truncated]`;
}
/** Resolve Studio system prompt text. */
function studioPrompt(kind) {
	return kind === "mindmap" ? "Create a concise Mermaid mindmap grounded only in the provided sources. Return exactly one fenced mermaid block using Mermaid mindmap syntax. Use a short root label and 2-4 levels. Keep node labels concise and avoid punctuation that breaks Mermaid." : "Write a polished research report grounded only in the provided sources. Use Markdown with an executive summary, key findings, evidence grouped by source, and conclusions. Call out disagreements or uncertainty instead of inventing facts.";
}
/** Compact preview used when a summary is still missing. */
function previewSummary(entry) {
	const base = (entry.summary || entry.content || entry.title || entry.sourceUrl || "").trim();
	if (base === "") return "No summary available yet.";
	return base.length > 280 ? `${base.slice(0, 277).trimEnd()}...` : base;
}
//#endregion
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
//#region lib/types/prompts.js
/** Host generation prompts for notebook summaries and Studio artifacts. */
/** System prompt for an evidence-grounded notebook overview. */
const SUMMARY_SYSTEM_PROMPT = [
	"You are writing a detailed note summary for later follow-up questions.",
	"Summarize only the provided source material.",
	"Your first line must be exactly `Title: <one relevant emoji> <concise title>`.",
	"Keep the generated title specific, natural, and under 36 characters.",
	"After the title, write a line containing exactly `Summary:` and then the summary.",
	"Be comprehensive and concrete: capture the main thesis, important details, key facts, structure, and useful context.",
	"Prefer a well-structured markdown summary with short paragraphs and concise bullets when helpful.",
	"If the source includes meaningful images and you want to reference them, preserve their markdown image references.",
	"Do not invent facts that are not present in the source."
].join(" ");
/** System prompt for a Mermaid mind map grounded in selected sources. */
const MINDMAP_SYSTEM_PROMPT = [
	"Create a concise Mermaid mindmap grounded only in the provided sources.",
	"Return exactly one fenced mermaid block using Mermaid mindmap syntax.",
	"Use a short root label and 2-4 levels. Keep node labels concise and avoid punctuation that breaks Mermaid."
].join(" ");
/** System prompt for a Markdown research report grounded in selected sources. */
const REPORT_SYSTEM_PROMPT = [
	"Write a polished research report grounded only in the provided sources.",
	"Use Markdown with an executive summary, key findings, evidence grouped by source, and conclusions.",
	"Call out disagreements or uncertainty instead of inventing facts."
].join(" ");
//#endregion
//#region lib/types/platform.js
/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
/** Shared sqlite filename for notebooks and deepresearch domains. */
const SHARED_SQLITE_FILENAME = "dsh.sqlite";
/** Resolve `$DSH_HOME`, defaulting to `~/.dsh`. */
function resolveDshHome(env = process.env) {
	const configured = env.DSH_HOME?.trim();
	if (configured === void 0 || configured === "") return join(homedir(), ".dsh");
	return configured.startsWith("~") ? join(homedir(), configured.slice(1)) : configured;
}
/** Canonical sqlite file both product plugins mount when the host has none. */
function defaultSharedSqlitePath(env = process.env) {
	return join(resolveDshHome(env), "storages", SHARED_SQLITE_FILENAME);
}
/** @deprecated Use {@link defaultSharedSqlitePath}; kept for callers that still name the notebooks file. */
function defaultNotebooksSqlitePath(env = process.env) {
	return defaultSharedSqlitePath(env);
}
/** Leftover plugin-named sqlite from before the shared-file cutover. */
function legacyNotebooksSqlitePath(sqlitePath) {
	return join(dirname(sqlitePath), "notebooks.sqlite");
}
function sqliteMounted(ctx) {
	return ctx.storage.backend.names().includes("sqlite");
}
function canMountHttpFetch(ctx) {
	const web = ctx.get("web");
	return web !== void 0 && typeof web.registerFetchProvider === "function";
}
function isAlreadyMountedError(error) {
	const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
	return /already registered|duplicate-backend|WEB_DUPLICATE_PROVIDER/i.test(text);
}
/** Register the sqlite backend when the host has not already done so. */
async function ensureSqliteBackend(ctx, path) {
	if (sqliteMounted(ctx)) return;
	try {
		await ctx.plugin(StorageSqlite, { path });
	} catch (error) {
		if (sqliteMounted(ctx) || isAlreadyMountedError(error)) return;
		throw error;
	}
}
/** Register the HTTP fetch provider when `ctx.web` exists and has none. */
async function ensureHttpFetchProvider(ctx) {
	if (!canMountHttpFetch(ctx)) return;
	try {
		await ctx.plugin(WebFetchHttp);
	} catch (error) {
		if (isAlreadyMountedError(error)) return;
		throw error;
	}
}
/** Send one storage-domain name to sqlite without replacing other routes. */
function routeDomainToSqlite(ctx, domain) {
	const facility = ctx.storageDomain;
	const routes = facility.config.routes ?? (facility.config.routes = {});
	routes[domain] = "sqlite";
}
/** Ensure sqlite/fetch exist, then route this plugin's domain to sqlite. */
async function ensurePluginPlatform(ctx, options) {
	await ensureSqliteBackend(ctx, options.sqlitePath);
	routeDomainToSqlite(ctx, options.domain);
	await ensureHttpFetchProvider(ctx);
}
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
	url: z.string().nullable().default(null),
	mimeType: z.string().nullable().default(null),
	content: z.string().default(""),
	selected: z.boolean().default(true),
	status: z.enum([
		"ready",
		"pending_fetch",
		"failed"
	]).default("ready"),
	sessionId: z.string().nullable().default(null),
	messageId: z.string().nullable().default(null),
	createdAt: z.number()
});
/** Stored Studio artifact schema. */
const notebookArtifactSchema = z.object({
	kind: z.enum(["mindmap", "report"]),
	content: z.string(),
	updatedAt: z.number()
});
/** Stored host generation job schema. */
const notebookJobSchema = z.object({
	id: z.string(),
	kind: z.enum([
		"summary",
		"mindmap",
		"report"
	]),
	status: z.enum([
		"pending",
		"running",
		"completed",
		"failed"
	]),
	stage: z.enum(["fetch", "generate"]).default("generate"),
	partialText: z.string().default(""),
	errorText: z.string().default(""),
	updatedAt: z.number()
});
/** Stored notebook record schema. */
const notebookEntrySchema = z.object({
	id: z.string().transform(NotebookId),
	title: z.string(),
	content: z.string(),
	summary: z.string().default(""),
	tags: z.array(z.string()).default([]),
	sourceType: z.enum([
		"manual",
		"url",
		"document",
		"chat_answer",
		"notebook"
	]).default("manual"),
	sourceUrl: z.string().nullable().default(null),
	fetchStatus: z.enum([
		"ready",
		"pending_fetch",
		"failed"
	]).default("ready"),
	sources: z.array(notebookSourceSchema),
	artifacts: z.array(notebookArtifactSchema).default([]),
	latestJob: notebookJobSchema.nullable().default(null),
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Global notebook store shared by Sessions. */
const notebooksDomainSpec = defineDomain({
	name: "notebooks",
	version: 3,
	tables: { entries: domainTable(notebookEntrySchema) }
});
//#endregion
//#region lib/types/migrate.js
/** Copy leftover plugin-named sqlite rows into an empty notebooks domain table. */
const UNIT = "notebooks";
const TABLE = "entries";
/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
function loadSqliteTableValues(path, unit, table) {
	let db;
	try {
		db = new DatabaseSync(path, { readOnly: true });
	} catch {
		return [];
	}
	try {
		const physical = `u_${unit}_${table}`;
		if (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(physical) === void 0) return [];
		return db.prepare(`SELECT value FROM "${physical}"`).all().map((row) => JSON.parse(row.value));
	} finally {
		db.close();
	}
}
/**
* Copy leftover `notebooks.sqlite` entries into an empty domain table.
* Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
*/
async function importLegacyNotebooksIfEmpty(legacyPath, liveSqlitePath, table) {
	if ([...table.entries()].length > 0) return 0;
	if (resolve(legacyPath) === resolve(liveSqlitePath)) return 0;
	try {
		await access(legacyPath, constants.R_OK);
	} catch {
		return 0;
	}
	let imported = 0;
	for (const raw of loadSqliteTableValues(legacyPath, UNIT, TABLE)) {
		const entry = notebookEntrySchema.parse(raw);
		await table.put(entry.id, entry);
		imported += 1;
	}
	return imported;
}
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
		sourceType: {
			type: "string",
			required: true
		},
		sourceUrl: {
			required: true,
			oneOf: [{ type: "string" }, { type: "null" }]
		},
		fetchStatus: {
			type: "string",
			required: true
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
					status: {
						type: "string",
						required: true
					},
					sessionId: {
						required: true,
						oneOf: [{ type: "string" }, { type: "null" }]
					},
					messageId: {
						required: true,
						oneOf: [{ type: "string" }, { type: "null" }]
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
		latestJob: {
			required: true,
			oneOf: [{ type: "null" }, {
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
							"summary",
							"mindmap",
							"report"
						]
					},
					status: {
						type: "string",
						required: true,
						enum: [
							"pending",
							"running",
							"completed",
							"failed"
						]
					},
					stage: {
						type: "string",
						required: true,
						enum: ["fetch", "generate"]
					},
					partialText: {
						type: "string",
						required: true
					},
					errorText: {
						type: "string",
						required: true
					},
					updatedAt: {
						type: "number",
						required: true
					}
				}
			}]
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
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _get_decorators;
	let _candidates_decorators;
	let _put_decorators;
	let _create_decorators;
	let _addSource_decorators;
	let _setSourceSelection_decorators;
	let _removeSource_decorators;
	let _setSummary_decorators;
	let _setArtifact_decorators;
	let _summarize_decorators;
	let _generateStudio_decorators;
	let _saveChatAnswer_decorators;
	let _delete_decorators;
	return class NotebooksService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_get_decorators = [Remote("get")];
			_candidates_decorators = [Remote("candidates")];
			_put_decorators = [Remote("put")];
			_create_decorators = [Remote("create")];
			_addSource_decorators = [Remote("addSource")];
			_setSourceSelection_decorators = [Remote("setSourceSelection")];
			_removeSource_decorators = [Remote("removeSource")];
			_setSummary_decorators = [Remote("setSummary")];
			_setArtifact_decorators = [Remote("setArtifact")];
			_summarize_decorators = [Remote("summarize")];
			_generateStudio_decorators = [Remote("generateStudio")];
			_saveChatAnswer_decorators = [Remote("saveChatAnswer")];
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
			__esDecorate(this, null, _candidates_decorators, {
				kind: "method",
				name: "candidates",
				static: false,
				private: false,
				access: {
					has: (obj) => "candidates" in obj,
					get: (obj) => obj.candidates
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
			__esDecorate(this, null, _create_decorators, {
				kind: "method",
				name: "create",
				static: false,
				private: false,
				access: {
					has: (obj) => "create" in obj,
					get: (obj) => obj.create
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
			__esDecorate(this, null, _summarize_decorators, {
				kind: "method",
				name: "summarize",
				static: false,
				private: false,
				access: {
					has: (obj) => "summarize" in obj,
					get: (obj) => obj.summarize
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _generateStudio_decorators, {
				kind: "method",
				name: "generateStudio",
				static: false,
				private: false,
				access: {
					has: (obj) => "generateStudio" in obj,
					get: (obj) => obj.generateStudio
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _saveChatAnswer_decorators, {
				kind: "method",
				name: "saveChatAnswer",
				static: false,
				private: false,
				access: {
					has: (obj) => "saveChatAnswer" in obj,
					get: (obj) => obj.saveChatAnswer
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
		static inject = [
			"storage",
			"storageDomain",
			"tools"
		];
		static Config = s.object({
			runnerEnabled: s.boolean().default(false),
			runnerCwd: s.string().default(process.cwd()),
			maxEntries: s.number().step(1).min(1).required(),
			maxContentChars: s.number().step(1).min(1).required(),
			maxSourcesPerEntry: s.number().step(1).min(1).required(),
			maxSourceChars: s.number().step(1).min(1).required(),
			maxArtifactChars: s.number().step(1).min(1).required(),
			sqlitePath: s.string()
		});
		table;
		mutationTail = Promise.resolve();
		activeJobs = /* @__PURE__ */ new Map();
		/** @param ctx - Host context carrying storage and Tool registries. @param config - Capacity and generation limits. */
		constructor(ctx, config) {
			super(ctx, "notebooks");
			this.config = config;
		}
		async [Service.init]() {
			const sqlitePath = this.config.sqlitePath?.trim() || defaultSharedSqlitePath();
			await ensurePluginPlatform(this.ctx, {
				domain: "notebooks",
				sqlitePath
			});
			const domain = await this.ctx.storageDomain.open(notebooksDomainSpec);
			this.ctx.effect(() => () => domain.close(), "notebooks.domainClose");
			this.table = domain.table("entries");
			await importLegacyNotebooksIfEmpty(legacyNotebooksSqlitePath(sqlitePath), sqlitePath, this.table);
			this.registerTools();
			this.ctx.on("agent/pre-step", async ({ signal }, next) => {
				const decision = await next();
				if (decision.kind === "reject") return decision;
				return {
					kind: "enter",
					messages: await this.injectMentions(decision.messages, signal)
				};
			}, { prepend: true });
			this.ctx.effect(() => async () => {
				const runs = [...this.activeJobs.values()];
				for (const run of runs) {
					run.controller.abort();
					run.handle?.agent.cancel({ kind: "disposed" });
				}
				await Promise.allSettled(runs.map((run) => run.promise));
			}, "notebooks.runnerDrain");
		}
		list(request) {
			const query = request.query?.trim().toLocaleLowerCase();
			const tag = request.tag?.trim().toLocaleLowerCase();
			return { entries: [...this.requireTable().entries()].map(([, entry]) => snapshot(entry)).filter((entry) => query === void 0 || query === "" || searchableText(entry).includes(query)).filter((entry) => tag === void 0 || tag === "" || entry.tags.some((candidate) => candidate.toLocaleLowerCase() === tag)).filter((entry) => request.sourceKind === void 0 || entry.sources.some((source) => source.kind === request.sourceKind)).sort((left, right) => right.updatedAt - left.updatedAt) };
		}
		get(request) {
			const entry = this.requireTable().get(request.id);
			return entry === void 0 ? null : snapshot(entry);
		}
		candidates(request) {
			const query = request.query?.trim().toLocaleLowerCase() ?? "";
			return { candidates: this.list({ query }).entries.slice(0, 20).map((entry) => ({
				id: entry.id,
				title: entry.title,
				mention: formatNotebookMention(entry.id, entry.title || entry.id),
				summary: previewSummary(entry),
				summarizing: entry.summary.trim() === "" && (entry.latestJob?.status === "pending" || entry.latestJob?.status === "running")
			})) };
		}
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
				const sources = current?.sources ?? [this.manualSource(title, content, now)];
				const entry = snapshot({
					id,
					title,
					content,
					summary: request.summary?.trim() ?? current?.summary ?? "",
					tags: normalizeTags(request.tags ?? current?.tags ?? []),
					sourceType: entryKindFromSources(sources),
					sourceUrl: sources.find((source) => source.url !== null)?.url ?? current?.sourceUrl ?? null,
					fetchStatus: sources.some((source) => source.status === "pending_fetch") ? "pending_fetch" : "ready",
					sources,
					artifacts: current?.artifacts ?? [],
					latestJob: current?.latestJob ?? null,
					createdAt: current?.createdAt ?? now,
					updatedAt: current === void 0 ? now : Math.max(now, current.updatedAt + 1)
				});
				await table.put(id, entry);
				this.emitProgress(entry);
				if (current === void 0) this.launchSummary(id);
				return snapshot(entry);
			});
		}
		create(request) {
			return this.enqueue(async () => {
				const sources = this.buildCreateSources(request);
				if (sources.length === 0) throw new TypeError("notebooks: notebook requires at least one source");
				const table = this.requireTable();
				if (table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
				const now = Date.now();
				const first = sources[0];
				const title = request.title?.trim() || first.name;
				const id = NotebookId(`note-${randomUUID()}`);
				const pending = sources.some((source) => source.status === "pending_fetch");
				const entry = snapshot({
					id,
					title,
					content: first.content,
					summary: "",
					tags: normalizeTags(request.tags ?? []),
					sourceType: entryKindFromSources(sources),
					sourceUrl: sources.find((source) => source.url !== null)?.url ?? null,
					fetchStatus: pending ? "pending_fetch" : "ready",
					sources,
					artifacts: [],
					latestJob: null,
					createdAt: now,
					updatedAt: now
				});
				await table.put(id, entry);
				this.emitProgress(entry);
				this.launchSummary(id);
				return snapshot(entry);
			});
		}
		addSource(request) {
			return this.update(request.id, (entry) => {
				if (entry.sources.length >= this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`);
				const source = this.buildSource(request);
				return this.withInvalidatedDerived({
					...entry,
					sources: [...entry.sources, source]
				});
			}).then((entry) => {
				this.launchSummary(entry.id);
				return entry;
			});
		}
		setSourceSelection(request) {
			return this.update(request.id, (entry) => {
				const selected = new Set(request.sourceIds);
				const known = new Set(entry.sources.map((source) => source.id));
				for (const id of selected) if (!known.has(id)) throw new Error(`notebooks: source ${id} not found`);
				if (![...entry.sources].some((source) => selected.has(source.id))) throw new Error("notebooks: select at least one source");
				return this.withInvalidatedDerived({
					...entry,
					sources: entry.sources.map((source) => ({
						...source,
						selected: selected.has(source.id)
					}))
				});
			}).then((entry) => {
				this.launchSummary(entry.id);
				return entry;
			});
		}
		removeSource(request) {
			let removed = false;
			return this.update(request.id, (entry) => {
				const sources = entry.sources.filter((source) => source.id !== request.sourceId);
				removed = sources.length !== entry.sources.length;
				return this.withInvalidatedDerived({
					...entry,
					sources
				});
			}).then((entry) => {
				if (removed && entry.sources.length > 0) this.launchSummary(entry.id);
				return {
					removed,
					entry
				};
			});
		}
		setSummary(request) {
			return this.update(request.id, (entry) => ({
				...entry,
				summary: requiredText(request.summary, "summary")
			}));
		}
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
		summarize(request) {
			const entry = this.requireEntry(request.id);
			this.launchSummary(entry.id);
			return Promise.resolve(snapshot(this.requireEntry(entry.id)));
		}
		generateStudio(request) {
			if (!this.config.runnerEnabled) return Promise.reject(/* @__PURE__ */ new Error("notebooks: generation runner is disabled"));
			const entry = this.requireEntry(request.id);
			this.launchStudio(entry.id, request.kind);
			return Promise.resolve(snapshot(this.requireEntry(entry.id)));
		}
		saveChatAnswer(request) {
			const answerText = requiredText(request.answerText, "answer");
			this.assertLength(answerText, this.config.maxSourceChars, "answer");
			const title = request.title?.trim() || fallbackChatTitle(request.questionText ?? "", answerText);
			return this.enqueue(async () => {
				const table = this.requireTable();
				if (table.size >= this.config.maxEntries) throw new RangeError(`notebooks: entry limit ${this.config.maxEntries} reached`);
				const now = Date.now();
				const id = NotebookId(`note-${randomUUID()}`);
				const source = this.createSource({
					kind: "chat_answer",
					name: title,
					content: answerText,
					sessionId: optionalText(request.sessionId),
					messageId: optionalText(request.messageId),
					createdAt: now
				});
				const entry = snapshot({
					id,
					title,
					content: answerText,
					summary: "",
					tags: normalizeTags(request.tags ?? []),
					sourceType: "chat_answer",
					sourceUrl: null,
					fetchStatus: "ready",
					sources: [source],
					artifacts: [],
					latestJob: null,
					createdAt: now,
					updatedAt: now
				});
				await table.put(id, entry);
				this.emitProgress(entry);
				this.launchSummary(id);
				return snapshot(entry);
			});
		}
		delete(request) {
			return this.enqueue(async () => {
				this.stopJob(request.id);
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
					content: { type: "string" }
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
				name: "notebook_save_chat_answer",
				description: "Save a conversation answer as a durable notebook for later follow-up.",
				parameters: {
					title: { type: "string" },
					answerText: {
						type: "string",
						required: true
					},
					questionText: { type: "string" },
					sessionId: { type: "string" },
					messageId: { type: "string" }
				},
				output: {
					schema: ENTRY_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Saved chat answer as notebook "${value.title}" (${value.id}).`
					}]
				},
				execute: (args) => this.saveChatAnswer(args),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Save chat answer",
					rawInput: args.title ?? args.answerText.slice(0, 32)
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
		async injectMentions(messages, signal) {
			return (await Promise.all(messages.map(async (message) => {
				if (message.source.kind !== "user") return [message];
				const ids = [];
				const content = message.content.map((block) => {
					if (block.type !== "text") return block;
					const parsed = parseNotebookMentions(block.text);
					ids.push(...parsed.ids);
					return {
						type: "text",
						text: parsed.text
					};
				});
				const id = ids[0];
				if (id === void 0) return [message];
				signal.throwIfAborted();
				const entry = this.requireTable().get(id);
				if (entry === void 0) return [freezeMessage({
					...message,
					content
				})];
				const context = createUserMessage({
					content: [{
						type: "text",
						text: buildAskContext(entry, entry.summary.trim() || previewSummary(entry))
					}],
					source: {
						kind: "plugin",
						plugin: "@deepseek-ai/dsh-notebooks",
						form: "recall",
						notebookId: entry.id,
						notebookTitle: entry.title || entry.id
					}
				});
				return [freezeMessage({
					...message,
					content
				}), context];
			}))).flat();
		}
		launchSummary(id) {
			if (!this.config.runnerEnabled) return;
			this.launchJob(id, "summary", async (run, entry) => {
				const pending = entry.sources.filter((source) => source.kind === "url" && source.content === "" && source.url !== null);
				if (pending.length > 0) await this.patchJob(id, run.jobId, {
					status: "running",
					stage: "fetch",
					partialText: pending[0].name || pending[0].url || ""
				});
				const fetched = await this.fetchPendingSources(entry, run.controller.signal, run.jobId);
				await this.patchJob(id, run.jobId, {
					status: "running",
					stage: "generate",
					partialText: ""
				});
				const contentText = truncateForGeneration(combineSources(selectedSources(fetched)) || fetched.content);
				const generated = parseGeneratedSummary(await this.complete({
					run,
					system: SUMMARY_SYSTEM_PROMPT,
					user: ["Please write a detailed note summary for future follow-up questions.", contentText].join("\n\n"),
					onDraft: (text) => {
						this.patchJob(id, run.jobId, {
							status: "running",
							stage: "generate",
							partialText: text
						});
					}
				}));
				const title = generated.title || fallbackTitle({
					title: fetched.title,
					sourceUrl: fetched.sourceUrl,
					contentText
				});
				const summary = generated.summary;
				if (summary === "") throw new Error("Empty note summary");
				await this.update(id, (current) => ({
					...current,
					title,
					content: contentText || current.content,
					summary,
					sources: fetched.sources,
					fetchStatus: contentText || current.content ? "ready" : current.fetchStatus,
					latestJob: job(run.jobId, "summary", "completed", summary, "")
				}));
			});
		}
		launchStudio(id, kind) {
			if (!this.config.runnerEnabled) throw new Error("notebooks: generation runner is disabled");
			this.launchJob(id, kind, async (run, entry) => {
				const sourceText = combineSources(selectedSources(entry));
				if (sourceText === "") throw new Error("No selected source content is available");
				const content = (await this.complete({
					run,
					system: kind === "mindmap" ? MINDMAP_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT,
					user: studioPrompt(kind) + "\n\n" + sourceText,
					onDraft: (text) => {
						this.patchJob(id, run.jobId, {
							status: "running",
							stage: "generate",
							partialText: text
						});
					}
				})).trim();
				if (content === "") throw new Error("Model returned empty content");
				this.assertLength(content, this.config.maxArtifactChars, `${kind} content`);
				const artifact = {
					kind,
					content,
					updatedAt: Date.now()
				};
				await this.update(id, (current) => ({
					...current,
					artifacts: [...current.artifacts.filter((item) => item.kind !== kind), artifact],
					latestJob: job(run.jobId, kind, "completed", content, "")
				}));
			});
		}
		launchJob(id, kind, work) {
			this.stopJob(id);
			const jobId = `notejob-${randomUUID()}`;
			const run = {
				jobId,
				controller: new AbortController()
			};
			this.activeJobs.set(id, run);
			this.update(id, (entry) => ({
				...entry,
				latestJob: job(jobId, kind, "pending", "", "", kind === "summary" ? "fetch" : "generate")
			}));
			run.promise = (async () => {
				try {
					await this.update(id, (entry) => ({
						...entry,
						latestJob: job(jobId, kind, "running", "", "", kind === "summary" ? "fetch" : "generate")
					}));
					const entry = this.requireEntry(id);
					if (this.activeJobs.get(id)?.jobId !== jobId) return;
					await work(run, entry);
				} catch (error) {
					if (run.controller.signal.aborted) return;
					const message = error instanceof Error ? error.message : String(error);
					await this.update(id, (entry) => ({
						...entry,
						latestJob: job(jobId, kind, "failed", entry.latestJob?.partialText ?? "", message)
					})).catch(() => void 0);
				} finally {
					if (this.activeJobs.get(id)?.jobId === jobId) this.activeJobs.delete(id);
				}
			})();
		}
		async fetchPendingSources(entry, signal, jobId) {
			const sources = [...entry.sources];
			const pendingIndexes = sources.map((source, index) => source.kind === "url" && source.content === "" && source.url !== null ? index : -1).filter((index) => index >= 0);
			let fetchedCount = 0;
			for (let index = 0; index < sources.length; index += 1) {
				const source = sources[index];
				if (source.kind !== "url" || source.content !== "" || source.url === null) continue;
				fetchedCount += 1;
				if (jobId !== void 0) await this.patchJob(entry.id, jobId, {
					status: "running",
					stage: "fetch",
					partialText: `${String(fetchedCount)}/${String(pendingIndexes.length)} ${source.name || source.url}`
				});
				try {
					const fetched = await this.fetchUrl(source.url, signal);
					sources[index] = {
						...source,
						name: fetched.title || source.name,
						content: fetched.content,
						status: fetched.content === "" ? "failed" : "ready"
					};
				} catch {
					sources[index] = {
						...source,
						status: "failed"
					};
				}
			}
			const content = selectedSources({
				...entry,
				sources
			}).map((source) => source.content).find((text) => text !== "") ?? entry.content;
			const fetchStatus = sources.some((source) => source.status === "pending_fetch") ? "pending_fetch" : sources.some((source) => source.status === "failed") && content === "" ? "failed" : "ready";
			const next = {
				...entry,
				sources,
				content,
				fetchStatus,
				sourceUrl: sources.find((source) => source.url !== null)?.url ?? entry.sourceUrl
			};
			await this.update(entry.id, (current) => ({
				...current,
				sources: next.sources,
				content: next.content,
				fetchStatus: next.fetchStatus,
				sourceUrl: next.sourceUrl
			}));
			return this.requireEntry(entry.id);
		}
		async fetchUrl(url, signal) {
			const web = this.ctx.get("web");
			return web === void 0 ? fetchNotebookUrl(url, { signal }) : fetchNotebookUrl(url, {
				signal,
				web
			});
		}
		async complete(spec) {
			const agents = this.ctx.get("agents");
			const agentDefaultModel = this.ctx.get("agentDefaultModel");
			const agentPresets = this.ctx.get("agentPresets");
			if (agents === void 0 || agentDefaultModel === void 0 || agentPresets === void 0) throw new Error("notebooks: generation agents are not available");
			const selection = agentDefaultModel.currentSelection();
			const handle = await agents.create({
				sessionId: SessionId(`notebooks-run-${randomUUID()}`),
				meta: {
					cwd: resolve(this.config.runnerCwd),
					origin: "subagent",
					delegationDepth: 1
				},
				agentOptions: {
					provider: selection.provider,
					model: selection.model
				},
				signal: spec.run.controller.signal,
				setup: async (agentCtx) => {
					await agentPresets.mount(agentCtx, "standard");
					agentCtx.tools.restrict({ allow: [] });
					agentCtx.systemPrompt.section({
						name: "notebooks:runner",
						order: 1e4,
						text: spec.system
					});
				}
			});
			spec.run.handle = handle;
			const stopDraft = watchDraft(handle, spec.onDraft);
			try {
				if (spec.run.controller.signal.aborted) return "";
				handle.agent.followup(createUserMessage({
					content: [{
						type: "text",
						text: spec.user
					}],
					source: { kind: "user" }
				}));
				await handle.agent.whenIdle();
				return lastAssistantText(handle);
			} finally {
				stopDraft();
				await handle.dispose();
				delete spec.run.handle;
			}
		}
		async patchJob(id, jobId, patch) {
			await this.update(id, (entry) => {
				if (entry.latestJob?.id !== jobId) return entry;
				return {
					...entry,
					latestJob: {
						...entry.latestJob,
						...patch,
						updatedAt: Date.now()
					}
				};
			}).catch(() => void 0);
		}
		stopJob(id) {
			const run = this.activeJobs.get(id);
			if (run === void 0) return;
			run.controller.abort();
			run.handle?.agent.cancel({ kind: "user" });
			this.activeJobs.delete(id);
		}
		buildCreateSources(request) {
			const now = Date.now();
			const sources = [];
			for (const raw of request.urls ?? []) {
				const url = raw.trim();
				if (url === "") continue;
				if (!isAbsoluteHttpUrl(url)) throw new TypeError("notebooks: source URL requires an absolute http or https URL");
				sources.push(this.createSource({
					kind: "url",
					name: hostname(url),
					url,
					content: "",
					status: "pending_fetch",
					createdAt: now
				}));
			}
			const content = request.content?.trim() ?? "";
			if (content !== "") {
				this.assertLength(content, this.config.maxContentChars, "content");
				sources.push(this.manualSource(request.title?.trim() || "Manual note", content, now));
			}
			for (const document of request.documents ?? []) {
				const body = requiredText(document.content, "document content");
				this.assertLength(body, this.config.maxSourceChars, "document content");
				sources.push(this.createSource({
					kind: "document",
					name: requiredText(document.name, "document name"),
					mimeType: document.mimeType || "text/plain",
					content: body,
					createdAt: now
				}));
			}
			if (sources.length > this.config.maxSourcesPerEntry) throw new RangeError(`notebooks: source limit ${this.config.maxSourcesPerEntry} reached`);
			return sources;
		}
		buildSource(request) {
			const url = optionalText(request.url);
			const content = request.content?.trim() ?? "";
			if (request.kind === "url") {
				const href = url ?? "";
				if (!isAbsoluteHttpUrl(href)) throw new TypeError("notebooks: source URL requires an absolute http or https URL");
				return this.createSource({
					kind: "url",
					name: requiredText(request.name, "source name"),
					url: href,
					content,
					status: content === "" ? "pending_fetch" : "ready"
				});
			}
			if (content === "") throw new TypeError("notebooks: source content is required");
			this.assertLength(content, this.config.maxSourceChars, "source content");
			return this.createSource({
				kind: request.kind,
				name: requiredText(request.name, "source name"),
				url,
				mimeType: optionalText(request.mimeType),
				content,
				sessionId: optionalText(request.sessionId),
				messageId: optionalText(request.messageId)
			});
		}
		createSource(payload) {
			return {
				id: NotebookSourceId(`source-${randomUUID()}`),
				kind: payload.kind,
				name: payload.name,
				url: payload.url ?? null,
				mimeType: payload.mimeType ?? (payload.kind === "manual" ? "text/plain" : null),
				content: payload.content,
				selected: payload.selected !== false,
				status: payload.status ?? "ready",
				sessionId: payload.sessionId ?? null,
				messageId: payload.messageId ?? null,
				createdAt: payload.createdAt ?? Date.now()
			};
		}
		manualSource(title, content, createdAt) {
			return this.createSource({
				kind: "manual",
				name: title,
				mimeType: "text/plain",
				content,
				createdAt
			});
		}
		withInvalidatedDerived(entry) {
			return {
				...entry,
				summary: "",
				artifacts: [],
				sourceType: entryKindFromSources(entry.sources),
				sourceUrl: entry.sources.find((source) => source.url !== null)?.url ?? null,
				fetchStatus: entry.sources.some((source) => source.status === "pending_fetch") ? "pending_fetch" : "ready"
			};
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
				this.emitProgress(entry);
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
		requireEntry(id) {
			const entry = this.requireTable().get(id);
			if (entry === void 0) throw new Error(`notebooks: entry ${id} not found`);
			return snapshot(entry);
		}
		emitProgress(entry) {
			this.ctx.emit("notebooks/progress", snapshot(entry));
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
function hostname(value) {
	try {
		return new URL(value).hostname.replace(/^www\./u, "");
	} catch {
		return value || "网页资料";
	}
}
function job(id, kind, status, partialText, errorText, stage = "generate") {
	return {
		id,
		kind,
		status,
		stage,
		partialText,
		errorText,
		updatedAt: Date.now()
	};
}
function snapshot(entry) {
	return Object.freeze({
		...entry,
		tags: [...entry.tags],
		sources: entry.sources.map((source) => Object.freeze({ ...source })),
		artifacts: entry.artifacts.map((artifact) => Object.freeze({ ...artifact })),
		latestJob: entry.latestJob === null ? null : Object.freeze({ ...entry.latestJob })
	});
}
function lastAssistantText(handle) {
	const agent = handle.agent;
	const messages = Array.isArray(agent.messages) ? agent.messages : Array.isArray(agent.session?.messages) ? agent.session.messages : [];
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message.role !== "assistant") continue;
		const text = messageText(message.content);
		if (text !== "") return text;
	}
	return "";
}
function messageText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.map((block) => typeof block === "string" ? block : String(block.text ?? "")).join("");
}
function watchDraft(handle, onDraft) {
	let last = "";
	let streamed = "";
	let timer;
	const push = (text) => {
		const next = text.trim();
		if (next === "" || next === last) return;
		last = next;
		onDraft(next.slice(0, 12e3));
	};
	const emit = () => {
		push(streamed || lastAssistantText(handle));
	};
	const schedule = () => {
		if (timer !== void 0) return;
		timer = setTimeout(() => {
			timer = void 0;
			emit();
		}, 80);
	};
	const ctx = handle.agent.ctx;
	const offChunk = ctx?.on?.("assistant/chunk", (payload) => {
		const chunk = payload?.chunk;
		if (chunk?.type === "text-delta" && chunk.text) {
			const first = streamed === "";
			streamed += chunk.text;
			if (first) emit();
			else schedule();
		}
	});
	const offMessage = ctx?.on?.("assistant/message", (payload) => {
		const text = messageText(payload?.message?.content);
		if (text !== "") {
			streamed = text;
			emit();
		}
	});
	const poll = setInterval(emit, 200);
	emit();
	return () => {
		if (timer !== void 0) clearTimeout(timer);
		clearInterval(poll);
		offChunk?.();
		offMessage?.();
	};
}
//#endregion
export { NotebookId, NotebookSourceId, NotebooksService, NotebooksService as default, buildAskContext, combineSources, defaultNotebooksSqlitePath, defaultSharedSqlitePath, entryKindFromSources, extractHtmlArticle, fallbackChatTitle, fallbackTitle, fetchNotebookUrl, formatNotebookMention, importLegacyNotebooksIfEmpty, jinaReaderUrl, legacyNotebooksSqlitePath, notebookArtifactSchema, notebookEntrySchema, notebookJobSchema, notebookSourceSchema, notebooksDomainSpec, parseGeneratedSummary, parseJinaReaderResponse, parseNotebookMentions, selectedSources };
