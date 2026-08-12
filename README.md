# dsh-notebooks · 随手记

[English](README.en.md) | 中文

> DeepSeek Harness 的跨会话随手记插件。模型可以创建、检索、更新和删除笔记；数据进入 Harness 的 storage domain，并通过类型化 Remote API 提供给 Web UI。

**状态** Preview · **版本** 0.1.0 · **分支** `main`

## 特性

- **跨会话持久化**：笔记跟随当前 DSH profile 的存储后端，不依赖浏览器本地状态。
- **模型原生工具**：提供 `notebook_list`、`notebook_write`、`notebook_delete`。
- **更新与检索**：支持标题、正文、标签；按正文子串或标签过滤。
- **独立 Web Remote**：插件自行挂载 `remote.notebooks`，不要求修改 Harness 中央 Remote 清单。
- **明确容量限制**：最大条目数和单条正文长度由 `cordis.patch.yml` 配置。

## 快速开始

```sh
dsh plugin --profile web add github:dsh-external/dsh-notebooks
dsh web
```

打开 Web 后可以直接要求模型：

```text
请把“工具 UI 必须只依赖已记录的 call/result”记到随手记，标签为 ui 和 replay。
```

再开启一个会话并询问“查找带 replay 标签的随手记”。看到 `notebook_write` 和 `notebook_list` 调用，且第二个会话能读到第一条笔记，即安装成功。

如果希望在侧栏直接浏览和编辑笔记，再安装 [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui)。

## 工具

| 工具 | 用途 |
| --- | --- |
| `notebook_list` | 列出全部笔记，或按正文/标题子串、标签筛选 |
| `notebook_write` | 新建笔记；传入现有 `id` 时更新，同时保留创建时间 |
| `notebook_delete` | 按 `id` 删除；不存在时返回 `deleted: false` |

Web 插件还可以通过 `remote.notebooks.list/put/delete` 使用同一份数据。

## 数据与配置

默认补丁允许 10000 条笔记，单条正文最多 50000 字符。数据由 profile 已组合的 `storage-domain` 后端保存，因此具体文件位置、事务语义和备份策略跟随该 profile。插件不会把笔记写进 Git 仓库或浏览器 Local Storage。

## 验证与开发

仓库提交了可直接安装的 `lib/` 发布产物；源码所在 DSH 工作区使用以下聚焦检查：

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/extensions.spec.ts
pnpm --filter @deepseek-ai/dsh-notebooks bundle -- --env.DSH_BUILD_FACE=client
```

对本仓已提交产物做快速语法检查：`npm run verify`。

## 已知限制

- 当前是全局 storage domain，没有项目级集合、共享权限或全文相关性排序。
- 标签匹配不区分大小写；正文检索是有界内存子串匹配。
- 本仓是 Harness 私有主仓中对应扩展包的独立分发仓库。
