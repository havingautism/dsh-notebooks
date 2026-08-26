/** Extract a Mermaid mindmap from model output; ignore planning prose. */
/** Return a fenced mermaid document, or '' when the model did not emit a diagram. */
export declare function extractMermaidFence(raw: string): string;
/** Inner mermaid source for rendering. */
export declare function mermaidSourceFromArtifact(raw: string): string;
/** One node in a Mermaid mindmap tree. */
export interface MindmapNode {
    readonly label: string;
    readonly children: readonly MindmapNode[];
}
/** Parse Mermaid mindmap syntax into a tree the Studio UI can draw. */
export declare function parseMindmapTree(raw: string): MindmapNode | null;
//# sourceMappingURL=studio-mermaid.d.ts.map