# 📓 Notebooks

English | [中文](README.md)

`@deepseek-ai/dsh-notebooks` brings Codemini-style durable notebooks to DSH. It provides SQLite storage, model tools, the generated `notebooks` Remote namespace, and a sidebar-launched global `随手记` workspace.

## ✨ Features

- 🗂️ Browse a searchable, filterable library at `#notes` in grid or list mode.
- 📝 Create mixed-source notes from handwritten text, web links, and TXT/Markdown documents.
- 🌐 Fetch unread URLs automatically; source changes clear the overview and Studio artifacts and retrigger summarization.
- ✅ Select the exact sources used for an overview or Studio output.
- 🧠 Let a private host Agent generate overviews, Mermaid mind maps, and Markdown reports.
- 💬 Cite **one** notebook from the composer with `@` or the **Notebooks picker**; that turn receives `<notebook_context>`, and a clickable notebook badge under the user bubble opens `#notes/<id>`.
- 🗑️ Confirm before delete; inspect source originals and jump to the original URL.

## 🚀 Quick Start

Install this bundle by itself:

```sh
dsh plugin --profile web add github:havingautism/dsh-notebooks
dsh web
```

Open `随手记` from the sidebar footer, or visit `#notes` / `#notes/<id>`. The patch enables the generation runner. At boot, if the host has no sqlite / HTTP fetch yet, this plugin mounts them; if they already exist, it reuses them. Notebook data lives in the `notebooks` domain on that sqlite backend. A notebooks-only install is enough — you do not need Deep Research or a hand-written yml.

## Web fetch and security

DSH ships with chat `web_fetch` disabled and without `@deepseek-ai/dsh-web-fetch-http` mounted (see [dsh-base `cordis.patch.yml`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/base/cordis.patch.yml#L396-L418) and the [default Web search decision note](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-31-web-default-search.md)). Model-selected URL retrieval carries SSRF-style risk.

Notebooks fetches URL sources **through Jina Reader first** (`https://r.jina.ai/...`). It falls back to `ctx.web.fetch` when Jina fails or returns an empty body, and mounts `@deepseek-ai/dsh-web-fetch-http` itself when that provider is missing. An already-mounted provider is left alone, so installing alongside `@deepseek-ai/dsh-deepresearch` does not duplicate loader ids. Chat `web_fetch` stays off.

Using web fetch means the host may request public HTTP(S) URLs. The provider applies URL, size, and timeout limits but does not remove every SSRF scenario. Use in a trusted environment.

## Model Experience

### Native tools

#### What the model sees

The model sees `notebook_list`, `notebook_write`, `notebook_add_source`, `notebook_set_summary`, `notebook_set_artifact`, `notebook_save_chat_answer`, and `notebook_delete`. Ordinary chat does not rewrite the system prompt for a selected note; an `@` citation injects recall context beside that turn's user message.

#### Token effect

Fixed schema cost applies while the tools are visible. Result cost is proportional to matching summaries and content within configured limits. Follow-up injection adds only the current turn's notebook overview.

#### KV Cache effect

The static schemas extend the request header. Stored notebook content enters a request only through Tool results or that turn's recall injection, so durable mutations do not rewrite an existing request prefix.

## Known Limitations and Deferred Work

- Browser upload currently extracts UTF-8 plain-text and Markdown files. PDF and DOCX extraction requires a composed attachment extractor and is not simulated with lossy browser text decoding.
- Conversation message bubbles have no “save to notebooks” slot. Saving a chat answer uses the Remote API or the `notebook_save_chat_answer` tool.
- Private generation Agents stop with the host process. Notes stay durable, but interrupted summary or Studio jobs are not resumed automatically.
- Search uses bounded in-memory substring and exact-tag matching rather than ranked full-text retrieval.
