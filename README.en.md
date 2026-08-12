# dsh-notebooks · Notebooks

English | [中文](README.md)

> Cross-session notes for DeepSeek Harness. The model can create, search, update, and delete notes; records live in the Harness storage domain and are exposed to Web UI plugins through a typed Remote API.

**Status** Preview · **Version** 0.1.0 · **Branch** `main`

## Features

- **Durable across sessions**: records follow the active DSH profile's storage backend.
- **Native model tools**: `notebook_list`, `notebook_write`, and `notebook_delete`.
- **Update and search**: titles, content, tags, substring filtering, and exact tag filtering.
- **Self-contained Web Remote**: the plugin mounts `remote.notebooks` without a central Harness Remote edit.
- **Explicit limits**: capacity and per-entry content limits live in `cordis.patch.yml`.

## Quick start

```sh
dsh plugin --profile web add github:dsh-external/dsh-notebooks
dsh web
```

Ask the model to save a note tagged `ui` and `replay`, then start another session and list notes tagged `replay`. Seeing `notebook_write` and `notebook_list`, with the second session reading the first note, verifies the installation.

Install [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui) to browse the same records in a dedicated Web tab.

## Tools

| Tool | Purpose |
| --- | --- |
| `notebook_list` | List all notes or filter by title/content substring and tag |
| `notebook_write` | Create a note; an existing `id` updates it while preserving creation time |
| `notebook_delete` | Delete by `id`; a missing entry returns `deleted: false` |

Web plugins use the same data through `remote.notebooks.list/put/delete`.

## Data and configuration

The patch permits 10,000 notes and 50,000 content characters per note. Data is owned by the profile's `storage-domain` backend, so location, transaction behavior, and backups follow that profile. Nothing is stored in the Git checkout or browser Local Storage.

## Verification and development

Installable `lib/` artifacts are committed. Focused checks in the DSH source workspace:

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/extensions.spec.ts
pnpm --filter @deepseek-ai/dsh-notebooks bundle -- --env.DSH_BUILD_FACE=client
```

Run `npm run verify` to syntax-check this repository's committed artifacts.

## Known limitations

- The first release uses one global storage domain; it has no project collections or sharing permissions.
- Tag matching is case-insensitive, while text search is bounded substring matching rather than ranked full-text search.
- This is the standalone distribution of the corresponding extension developed in the private Harness source tree.
