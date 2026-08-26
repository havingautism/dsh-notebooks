# 📓 Notebooks

[English](README.en.md) | 中文

`@deepseek-ai/dsh-notebooks` 把 Codemini 风格的持久随手记带到 DSH。它提供 SQLite 存储、模型工具、生成的 `notebooks` Remote namespace，以及侧栏打开的全局「随手记」工作区。

## ✨ 特性

- 🗂️ 在 `#notes` 资料库中用网格或列表浏览支持搜索、筛选和排序的笔记。
- 📝 创建混合来源笔记：手写内容、网页链接、TXT/Markdown 文档。
- 🌐 自动抓取未读网页，来源变更后清空总结和 Studio 产物并重新总结。
- ✅ 精确选择参与综合总结和 Studio 产物的来源。
- 🧠 由宿主私有 Agent 生成综合总结、Mermaid 思维导图和 Markdown 报告。
- 💬 对话输入框用笔记本图标打开弹出框，或 `@` 引用**一篇**笔记追问；消息气泡下显示可点击的笔记徽章并跳转到 `#notes/<id>`。
- 🗑️ 删除前确认；工作区可查看来源原文并跳转原链接。

## 🚀 快速开始

安装插件：

```sh
dsh plugin --profile web add github:havingautism/dsh-notebooks
dsh web
```

在左侧边栏底部打开「随手记」，或访问 `#notes` / `#notes/<id>`。插件 patch 启用 generation runner。启动时若宿主还没有 sqlite / HTTP fetch，会自行挂上；已经有了则共用。笔记和深度研究共用一份 sqlite（默认 `~/.dsh/storages/dsh.sqlite`），各自占用独立 domain（`notebooks` / `deepresearch`）。首次启动会把旧的 `notebooks.sqlite` 迁进这份库。单独安装即可使用，不必先装深度研究或手写 yml。不要再 YAML `insert` 一遍 `storage-sqlite`。

## 网页抓取与安全

DSH 默认 **不启用** 聊天里的 `web_fetch` 工具，也不挂载 `@deepseek-ai/dsh-web-fetch-http`（见 [dsh-base `cordis.patch.yml`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/base/cordis.patch.yml#L396-L418) 与 [Web 默认搜索决策说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-31-web-default-search.zh.md)）。原因是模型自选 URL 抓取存在 SSRF 等风险。

随手记抓取网页来源时 **优先走 Jina Reader**（`https://r.jina.ai/...`）。失败或正文为空时再回退到 `ctx.web.fetch`；若当时还没有 HTTP fetch provider，插件会自行挂上 `@deepseek-ai/dsh-web-fetch-http`。已挂过则跳过，因此和 `@deepseek-ai/dsh-deepresearch` 同时安装不会抢同一个 loader id。聊天里的 `web_fetch` 仍然保持关闭。

安装或使用网页抓取能力即表示你接受：宿主可对公网 URL 发起 HTTP(S) 请求；provider 有 URL 校验与体积/超时限制，但不能消除所有 SSRF 场景。请在可信环境使用。

## 模型体验

### Native 工具

#### What the model sees

模型会看到 `notebook_list`、`notebook_write`、`notebook_add_source`、`notebook_set_summary`、`notebook_set_artifact`、`notebook_save_chat_answer` 和 `notebook_delete`。普通聊天不会为选中的笔记改写系统提示；`@` 引用只在该轮用户消息旁注入 recall 上下文。

#### Token effect

工具可见时承担固定 schema 成本；结果成本与配置上限内匹配的总结和正文量成正比。追问注入只增加当前轮的笔记摘要。

#### KV Cache 影响

静态 schema 会扩展请求头。已保存内容只通过工具结果或该轮 recall 注入进入请求，因此持久数据变更不会重写已有请求前缀。

## 已知限制与后续工作

- 浏览器上传当前只提取 UTF-8 纯文本和 Markdown。PDF、DOCX 需要组合附件提取器，不会用有损的浏览器文本解码来假装支持。
- 对话气泡没有「保存到随手记」插槽；保存聊天回答走 Remote / `notebook_save_chat_answer` 工具。
- 运行中的私有生成 Agent 会随宿主进程停止；笔记本身保持持久化，但不会自动续跑中断的总结或 Studio 任务。
- 搜索采用有界的内存子串与精确标签匹配，不提供排序型全文检索。
