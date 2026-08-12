# 📓 dsh-notebooks · Notebooks

English | [中文](README.md)

> An independent cross-session notes plugin for DeepSeek Harness. This repository owns the model tools, durable storage, typed Remote API, and Notebooks Web conversation view.

**Status** Preview · **Version** 0.1.0 · **Branch** `main`

## ✨ Features

- 📝 Create, search, update, and delete notes across sessions.
- 🏷️ Filter by title, content substring, or normalized tag.
- 🤖 Use the native `notebook_list`, `notebook_write`, and `notebook_delete` model tools.
- 💬 Browse, create, and delete notes in the built-in Notebooks conversation view.
- 💾 Persist through the active DSH profile's `storage-domain` backend instead of browser-local state.

## 🚀 Quick Start

Install this plugin by itself for the complete notebook capability:

```sh
dsh plugin --profile web add github:dsh-external/dsh-notebooks
dsh web
```

The Web app gains a Notebooks conversation view. Ask the model to save a note tagged `ui` and `replay`, then start another session and search for `replay`. The second session reading the first note verifies the installation.

## 🛠️ Tools and API

| Tool | Purpose |
| --- | --- |
| `notebook_list` | List all notes or filter by text and tag |
| `notebook_write` | Create a note; an existing `id` updates it while preserving creation time |
| `notebook_delete` | Delete by `id`; a missing entry returns `deleted: false` |

The Web client accesses the same records through the package-owned `remote.notebooks.list/put/delete` namespace.

## 🧩 Independence

Notebooks has no Deep Research or Ultra UI dependency. Installing or removing either plugin does not change notebook storage, model tools, Remote methods, or its conversation view.

## 💾 Data and Configuration

The default patch permits 10,000 notes and 50,000 content characters per note. Location, transaction behavior, and backups follow the profile's `storage-domain` backend. Nothing is stored in the Git checkout or browser Local Storage.

## 🧪 Verification and Development

Installable `lib/` artifacts are committed. Focused checks in the private Harness source workspace:

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/notebooks/tests/notebooks.spec.ts
pnpm --filter @deepseek-ai/dsh-notebooks run bundle
```

Run `npm run verify` for a quick syntax check of this repository's committed artifacts.

## ⚠️ Known Limitations

- The current release uses one global storage domain without project collections or sharing permissions.
- Text search is bounded substring matching rather than ranked full-text search.
- This is the standalone distribution of the corresponding extension developed in the private Harness source tree.
