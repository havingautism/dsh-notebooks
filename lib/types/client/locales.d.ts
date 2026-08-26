/**
 * `notebooks` namespace dictionaries (view copy + slot labels).
 *
 * Mirrors the locale pattern of `@deepseek-ai/dsh-deepresearch`.
 */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "notebooks";
/** The notebooks dictionary key set. */
export type NotebooksKey = 'view.notebooks' | 'library.title' | 'library.back' | 'library.backAria' | 'library.itemCount' | 'library.filterAria' | 'filter.all' | 'filter.manual' | 'filter.url' | 'filter.document' | 'toolbar.search' | 'toolbar.searchAria' | 'toolbar.sortAria' | 'toolbar.sortRecent' | 'toolbar.sortTitle' | 'toolbar.gridView' | 'toolbar.listView' | 'action.new' | 'action.cancel' | 'action.creating' | 'action.create' | 'empty.none' | 'empty.noMatch' | 'empty.hintStart' | 'empty.hintNoMatch' | 'card.openAria' | 'card.sources' | 'card.summarizing' | 'card.fetching' | 'composer.title' | 'composer.subtitle' | 'composer.closeAria' | 'composer.titleLabel' | 'composer.titlePlaceholder' | 'composer.urls' | 'composer.urlsPlaceholder' | 'composer.documents' | 'composer.chooseDocuments' | 'composer.content' | 'composer.contentPlaceholder' | 'composer.footer' | 'delete.title' | 'delete.body' | 'delete.confirm' | 'workspace.back' | 'workspace.delete' | 'workspace.notebook' | 'workspace.loading' | 'sources.title' | 'sources.add' | 'sources.upload' | 'sources.urlPlaceholder' | 'sources.pending' | 'sources.failed' | 'sources.openOriginal' | 'sources.openLink' | 'sources.remove' | 'overview.title' | 'overview.hint' | 'overview.empty' | 'overview.fetching' | 'overview.summarizing' | 'overview.resummarize' | 'overview.failed' | 'studio.title' | 'studio.mindmap' | 'studio.report' | 'studio.empty' | 'studio.emptyMindmap' | 'studio.emptyReport' | 'studio.generate' | 'studio.generating' | 'studio.expand' | 'source.original' | 'source.empty' | 'pane.sources' | 'pane.summary' | 'pane.studio' | 'mention.section' | 'picker.title' | 'picker.help' | 'picker.search' | 'picker.loading' | 'picker.empty' | 'picker.active' | 'picker.summarizing' | 'picker.showMore' | 'picker.summaryPending' | 'picker.selectFailed' | 'picker.remove' | 'cite.open' | 'overlay.crashTitle' | 'overlay.crashHint' | 'overlay.crashBack';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The notebooks view copy. */
        'notebooks': NotebooksKey;
    }
}
/** Simplified Chinese dictionary. */
export declare const zh: Record<NotebooksKey, string>;
/** English dictionary. */
export declare const en: Record<NotebooksKey, string>;
//# sourceMappingURL=locales.d.ts.map