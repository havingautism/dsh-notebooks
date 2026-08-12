# 📓 dsh-notebooks · 随手记

[English](README.en.md) | 中文

> DeepSeek Harness 的独立跨会话笔记插件。模型工具、持久存储、类型化 Remote API 和“随手记”Web 会话页都由本仓库自行提供。

**状态** Preview · **版本** 0.1.0 · **分支** `main`

## ✨ 特性

- 📝 创建、检索、更新和删除跨会话笔记。
- 🏷️ 按标题、正文子串或标准化标签筛选。
- 🤖 提供 `notebook_list`、`notebook_write`、`notebook_delete` 三个模型原生工具。
- 💬 自带“随手记”Web 会话页，可浏览、新建和删除笔记。
- 💾 使用当前 DSH profile 的 `storage-domain` 后端，不依赖浏览器本地状态。

## 🚀 快速开始

只安装本插件即可使用完整笔记能力：

```sh
dsh plugin --profile web add github:dsh-external/dsh-notebooks
dsh web
```

打开 Web 后会出现“随手记”会话页。也可以直接要求模型：

```text
请把“工具 UI 必须只依赖已记录的 call/result”记到随手记，标签为 ui 和 replay。
```

新开会话并检索 `replay` 标签；第二个会话能读取第一条笔记，即安装成功。

## 🛠️ 工具与 API

| 工具 | 用途 |
| --- | --- |
| `notebook_list` | 列出全部笔记，或按文本与标签筛选 |
| `notebook_write` | 新建笔记；传入现有 `id` 时更新并保留创建时间 |
| `notebook_delete` | 按 `id` 删除；不存在时返回 `deleted: false` |

Web 端通过同一插件挂载的 `remote.notebooks.list/put/delete` 访问相同数据。

## 🧩 独立性

Notebooks 不依赖 Deep Research 或 Ultra UI。安装或卸载另外两个插件不会改变笔记存储、模型工具、Remote 方法或“随手记”会话页。

## 💾 数据与配置

默认补丁允许 10000 条笔记，单条正文最多 50000 字符。具体文件位置、事务语义和备份策略由 profile 的 `storage-domain` 后端决定；插件不会把笔记写入 Git 仓库或浏览器 Local Storage。

## 🧪 验证与开发

本仓库提交了可直接安装的 `lib/` 发布产物。私有 Harness 源码工作区使用以下聚焦检查：

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/notebooks/tests/notebooks.spec.ts
pnpm --filter @deepseek-ai/dsh-notebooks run bundle
```

对本仓已提交产物运行 `npm run verify` 可做快速语法检查。

## ⚠️ 已知限制

- 当前使用一个全局 storage domain，没有项目级集合或共享权限。
- 正文搜索是有界子串匹配，不提供全文相关性排序。
- 本仓库是 Harness 私有主仓对应扩展包的独立分发仓库。
