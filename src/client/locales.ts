/**
 * `notebooks` namespace dictionaries (view copy + slot labels).
 *
 * Mirrors the locale pattern of `@deepseek-ai/dsh-deepresearch`.
 */

/** Dictionary namespace owned by this plugin. */
export const NS = 'notebooks'

/** The notebooks dictionary key set. */
export type NotebooksKey =
  | 'view.notebooks'
  | 'library.title'
  | 'library.back'
  | 'library.backAria'
  | 'library.itemCount'
  | 'library.filterAria'
  | 'filter.all'
  | 'filter.manual'
  | 'filter.url'
  | 'filter.document'
  | 'toolbar.search'
  | 'toolbar.searchAria'
  | 'toolbar.sortAria'
  | 'toolbar.sortRecent'
  | 'toolbar.sortTitle'
  | 'toolbar.gridView'
  | 'toolbar.listView'
  | 'action.new'
  | 'action.cancel'
  | 'action.creating'
  | 'action.create'
  | 'empty.none'
  | 'empty.noMatch'
  | 'empty.hintStart'
  | 'empty.hintNoMatch'
  | 'card.openAria'
  | 'card.sources'
  | 'card.summarizing'
  | 'card.fetching'
  | 'composer.title'
  | 'composer.subtitle'
  | 'composer.closeAria'
  | 'composer.titleLabel'
  | 'composer.titlePlaceholder'
  | 'composer.urls'
  | 'composer.urlsPlaceholder'
  | 'composer.documents'
  | 'composer.chooseDocuments'
  | 'composer.content'
  | 'composer.contentPlaceholder'
  | 'composer.footer'
  | 'delete.title'
  | 'delete.body'
  | 'delete.confirm'
  | 'workspace.back'
  | 'workspace.delete'
  | 'workspace.notebook'
  | 'workspace.loading'
  | 'sources.title'
  | 'sources.add'
  | 'sources.upload'
  | 'sources.urlPlaceholder'
  | 'sources.pending'
  | 'sources.failed'
  | 'sources.openOriginal'
  | 'sources.openLink'
  | 'sources.remove'
  | 'overview.title'
  | 'overview.hint'
  | 'overview.empty'
  | 'overview.fetching'
  | 'overview.summarizing'
  | 'overview.resummarize'
  | 'overview.failed'
  | 'studio.title'
  | 'studio.mindmap'
  | 'studio.report'
  | 'studio.empty'
  | 'studio.emptyMindmap'
  | 'studio.emptyReport'
  | 'studio.generate'
  | 'studio.generating'
  | 'studio.expand'
  | 'source.original'
  | 'source.empty'
  | 'pane.sources'
  | 'pane.summary'
  | 'pane.studio'
  | 'mention.section'
  | 'picker.title'
  | 'picker.help'
  | 'picker.search'
  | 'picker.loading'
  | 'picker.empty'
  | 'picker.active'
  | 'picker.summarizing'
  | 'picker.showMore'
  | 'picker.summaryPending'
  | 'picker.selectFailed'
  | 'picker.remove'
  | 'cite.open'
  | 'overlay.crashTitle'
  | 'overlay.crashHint'
  | 'overlay.crashBack'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The notebooks view copy. */
    'notebooks': NotebooksKey
  }
}

/** Simplified Chinese dictionary. */
export const zh: Record<NotebooksKey, string> = {
  'view.notebooks': '随手记',
  'library.title': '我的笔记',
  'library.back': '返回对话',
  'library.backAria': '关闭随手记',
  'library.itemCount': '{count} 条笔记',
  'library.filterAria': '笔记筛选',
  'filter.all': '全部',
  'filter.manual': '我的笔记',
  'filter.url': '网页资料',
  'filter.document': '文档',
  'toolbar.search': '搜索笔记',
  'toolbar.searchAria': '搜索笔记',
  'toolbar.sortAria': '笔记排序',
  'toolbar.sortRecent': '最近更新',
  'toolbar.sortTitle': '按标题',
  'toolbar.gridView': '网格视图',
  'toolbar.listView': '列表视图',
  'action.new': '新建笔记',
  'action.cancel': '取消',
  'action.creating': '创建中…',
  'action.create': '创建笔记',
  'empty.none': '还没有笔记',
  'empty.noMatch': '没有匹配的笔记',
  'empty.hintStart': '记录灵感，或整理链接和文档。',
  'empty.hintNoMatch': '试试其他关键词或清除搜索条件。',
  'card.openAria': '打开笔记：{title}',
  'card.sources': '{count} 个来源 · {date}',
  'card.summarizing': '总结中',
  'card.fetching': '抓取中',
  'composer.title': '创建笔记',
  'composer.subtitle': '记录想法，稍后继续补充来源和产物。',
  'composer.closeAria': '关闭',
  'composer.titleLabel': '标题',
  'composer.titlePlaceholder': '可选，可包含 emoji',
  'composer.urls': '网页链接',
  'composer.urlsPlaceholder': 'https://example.com/article\nhttps://example.com/report',
  'composer.documents': '文档',
  'composer.chooseDocuments': '上传 TXT 或 Markdown',
  'composer.content': '内容',
  'composer.contentPlaceholder': '写下背景、目标或第一条资料…',
  'composer.footer': '创建后会自动抓取链接并生成综合总结',
  'delete.title': '删除笔记？',
  'delete.body': '将永久删除「{title}」。',
  'delete.confirm': '删除',
  'workspace.back': '我的笔记',
  'workspace.delete': '删除笔记',
  'workspace.notebook': 'NOTEBOOK',
  'workspace.loading': '正在打开笔记…',
  'sources.title': '来源',
  'sources.add': '添加链接',
  'sources.upload': '上传文本',
  'sources.urlPlaceholder': 'https://',
  'sources.pending': '正在抓取…',
  'sources.failed': '抓取失败',
  'sources.openOriginal': '查看原文',
  'sources.openLink': '打开原链接',
  'sources.remove': '移除来源',
  'overview.title': '综合总结',
  'overview.hint': '基于当前选中的来源整理',
  'overview.empty': '还没有综合总结。',
  'overview.fetching': '正在抓取来源… {detail}',
  'overview.summarizing': '正在生成综合总结…',
  'overview.resummarize': '重新总结',
  'overview.failed': '总结失败：{error}',
  'studio.title': 'Studio',
  'studio.mindmap': '思维导图',
  'studio.report': '报告',
  'studio.empty': '基于选中来源生成内容。',
  'studio.emptyMindmap': '从选中来源生成思维导图。',
  'studio.emptyReport': '从选中来源生成报告。',
  'studio.generate': '生成',
  'studio.generating': '生成中…',
  'studio.expand': '放大思维导图',
  'source.original': '原文',
  'source.empty': '暂无正文',
  'pane.sources': '来源',
  'pane.summary': '总结',
  'pane.studio': 'Studio',
  'mention.section': '随手记',
  'picker.title': '随手记',
  'picker.help': '选一篇笔记作为追问上下文，发送后模型会读到它的综合总结。',
  'picker.search': '搜索笔记',
  'picker.loading': '正在加载笔记…',
  'picker.empty': '还没有可引用的笔记',
  'picker.active': '已选中',
  'picker.summarizing': '总结中',
  'picker.showMore': '显示更多 · {count}',
  'picker.summaryPending': '这篇笔记还在生成综合总结，请稍后再试。',
  'picker.selectFailed': '未能把笔记加入输入框，请重试。',
  'picker.remove': '移除笔记',
  'cite.open': '打开笔记',
  'overlay.crashTitle': '随手记无法显示',
  'overlay.crashHint': '工作区遇到渲染错误。可以返回笔记列表继续。',
  'overlay.crashBack': '返回列表',
}

/** English dictionary. */
export const en: Record<NotebooksKey, string> = {
  'view.notebooks': 'Notebooks',
  'library.title': 'My notes',
  'library.back': 'Back to chat',
  'library.backAria': 'Close notebooks',
  'library.itemCount': '{count} notes',
  'library.filterAria': 'Note filters',
  'filter.all': 'All',
  'filter.manual': 'My notes',
  'filter.url': 'Web',
  'filter.document': 'Documents',
  'toolbar.search': 'Search notes',
  'toolbar.searchAria': 'Search notes',
  'toolbar.sortAria': 'Sort notes',
  'toolbar.sortRecent': 'Recently updated',
  'toolbar.sortTitle': 'By title',
  'toolbar.gridView': 'Grid view',
  'toolbar.listView': 'List view',
  'action.new': 'New note',
  'action.cancel': 'Cancel',
  'action.creating': 'Creating…',
  'action.create': 'Create note',
  'empty.none': 'No notes yet',
  'empty.noMatch': 'No matching notes',
  'empty.hintStart': 'Capture an idea, or collect links and documents.',
  'empty.hintNoMatch': 'Try another keyword or clear the search.',
  'card.openAria': 'Open note: {title}',
  'card.sources': '{count} sources · {date}',
  'card.summarizing': 'Summarizing',
  'card.fetching': 'Fetching',
  'composer.title': 'Create note',
  'composer.subtitle': 'Write an idea, then add sources and Studio later.',
  'composer.closeAria': 'Close',
  'composer.titleLabel': 'Title',
  'composer.titlePlaceholder': 'Optional, emoji welcome',
  'composer.urls': 'Web links',
  'composer.urlsPlaceholder': 'https://example.com/article\nhttps://example.com/report',
  'composer.documents': 'Documents',
  'composer.chooseDocuments': 'Upload TXT or Markdown',
  'composer.content': 'Content',
  'composer.contentPlaceholder': 'Write the background, goal, or first source…',
  'composer.footer': 'Links are fetched and an overview is generated after create',
  'delete.title': 'Delete this note?',
  'delete.body': '“{title}” will be deleted permanently.',
  'delete.confirm': 'Delete',
  'workspace.back': 'My notes',
  'workspace.delete': 'Delete note',
  'workspace.notebook': 'NOTEBOOK',
  'workspace.loading': 'Opening note…',
  'sources.title': 'Sources',
  'sources.add': 'Add link',
  'sources.upload': 'Upload text',
  'sources.urlPlaceholder': 'https://',
  'sources.pending': 'Fetching…',
  'sources.failed': 'Fetch failed',
  'sources.openOriginal': 'View original',
  'sources.openLink': 'Open original link',
  'sources.remove': 'Remove source',
  'overview.title': 'Overview',
  'overview.hint': 'Synthesized from the selected sources',
  'overview.empty': 'No overview yet.',
  'overview.fetching': 'Fetching sources… {detail}',
  'overview.summarizing': 'Generating overview…',
  'overview.resummarize': 'Resummarize',
  'overview.failed': 'Overview failed: {error}',
  'studio.title': 'Studio',
  'studio.mindmap': 'Mind map',
  'studio.report': 'Report',
  'studio.empty': 'Generate from the selected sources.',
  'studio.emptyMindmap': 'Generate a mind map from the selected sources.',
  'studio.emptyReport': 'Generate a report from the selected sources.',
  'studio.generate': 'Generate',
  'studio.generating': 'Generating…',
  'studio.expand': 'Expand mind map',
  'source.original': 'Original',
  'source.empty': 'No captured text',
  'pane.sources': 'Sources',
  'pane.summary': 'Overview',
  'pane.studio': 'Studio',
  'mention.section': 'Notebooks',
  'picker.title': 'Notebooks',
  'picker.help': 'Pick one note as follow-up context. The model reads its synthesized overview for that turn.',
  'picker.search': 'Search notes',
  'picker.loading': 'Loading notes…',
  'picker.empty': 'No notes to cite yet',
  'picker.active': 'Selected',
  'picker.summarizing': 'Summarizing',
  'picker.showMore': 'Show more · {count}',
  'picker.summaryPending': 'This note is still generating its overview. Try again soon.',
  'picker.selectFailed': 'Could not attach the note to the composer. Try again.',
  'picker.remove': 'Remove note',
  'cite.open': 'Open note',
  'overlay.crashTitle': 'Notebooks failed to render',
  'overlay.crashHint': 'The workspace hit a render error. You can return to the library.',
  'overlay.crashBack': 'Back to library',
}
