# 📓 Notebooks

English | [中文](README.md)

`@deepseek-ai/dsh-notebooks` brings Codemini-style durable notebooks to DSH. It provides storage, model tools, the generated `notebooks` Remote namespace, and a complete `随手记` Web workspace.

## ✨ Features

- 🗂️ Browse a searchable, filterable library in grid or list mode.
- 📝 Create durable notes with normalized tags and a manual source.
- 🌐 Attach URL references, captured Web text, conversation answers, and uploaded plain-text or Markdown documents.
- ✅ Select the exact sources used for an overview or Studio output.
- 🧠 Save evidence-grounded summaries, Mermaid mind maps, and Markdown reports.
- 🗑️ Update sources or delete notebooks directly from the workspace.

## 🚀 Quick Start

Install this bundle by itself:

```sh
dsh plugin --profile web add github:havingautism/dsh-notebooks
dsh web
```

Open the `随手记` tab. The patch provides explicit limits for entries, content, sources, and Studio artifacts; a later profile or home patch may replace the complete `notebooks` config.

## Model Experience

### Native tools

#### What the model sees

The model sees `notebook_list`, `notebook_write`, `notebook_add_source`, `notebook_set_summary`, `notebook_set_artifact`, and `notebook_delete`. A source Tool call carries already-read source text; the plugin never claims that saving a URL alone fetched its page.

#### Token effect

Fixed schema cost applies while the tools are visible. Result cost is proportional to matching summaries and content within configured limits.

#### KV Cache effect

The six static schemas extend the request header. Stored notebook content enters a request only through Tool results, so durable mutations do not rewrite an existing request prefix.

## Known Limitations and Deferred Work

- Browser upload currently extracts UTF-8 plain-text and Markdown files. PDF and DOCX extraction requires a composed attachment extractor and is not simulated with lossy browser text decoding.
- The Web URL form saves a reference. The model should read the page with the composed Web capability and then call `notebook_add_source` with captured text.
- Search uses bounded in-memory substring and exact-tag matching rather than ranked full-text retrieval.
