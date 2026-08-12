# 📓 Notebooks

[English](README.en.md) | 中文

`@deepseek-ai/dsh-notebooks` 把 Codemini 风格的持久随手记带到 DSH。它提供存储、模型工具、生成的 `notebooks` Remote namespace，以及完整的“随手记”Web 工作区。

## ✨ 特性

- 🗂️ 使用网格或列表浏览支持搜索、筛选和排序的笔记库。
- 📝 创建带标准化标签和初始手写来源的持久笔记。
- 🌐 添加网页引用、已读取的网页正文、对话答案，以及纯文本或 Markdown 文档。
- ✅ 精确选择参与综合总结和 Studio 产物的来源。
- 🧠 保存有依据的总结、Mermaid 思维导图和 Markdown 报告。
- 🗑️ 直接在工作区中更新来源或删除笔记。

## 🚀 快速开始

单独安装本组合包：

```sh
dsh plugin --profile web add github:dsh-external/dsh-notebooks
dsh web
```

打开“随手记”标签页。组合包 patch 显式设置条目、正文、来源和 Studio 产物上限；后续 profile 或 home patch 可以替换完整的 `notebooks` config。

## 模型体验

### Native 工具

#### What the model sees

模型会看到 `notebook_list`、`notebook_write`、`notebook_add_source`、`notebook_set_summary`、`notebook_set_artifact` 和 `notebook_delete`。来源工具调用必须携带已经读取的正文；插件不会把仅保存 URL 说成已抓取页面。

#### Token effect

工具可见时承担固定 schema 成本；结果成本与配置上限内匹配的总结和正文量成正比。

#### KV Cache 影响

六个静态 schema 会扩展请求头。已保存内容只通过工具结果进入请求，因此持久数据变更不会重写已有请求前缀。

## 已知限制与后续工作

- 浏览器上传当前只提取 UTF-8 纯文本和 Markdown。PDF、DOCX 需要组合附件提取器，不会用有损的浏览器文本解码来假装支持。
- Web 链接表单只保存引用。模型应先通过已组合的 Web 能力读取页面，再调用 `notebook_add_source` 保存正文。
- 搜索采用有界的内存子串与精确标签匹配，不提供排序型全文检索。
