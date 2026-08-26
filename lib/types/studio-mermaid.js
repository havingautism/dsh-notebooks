/** Extract a Mermaid mindmap from model output; ignore planning prose. */
const FENCE_PATTERN = /```(?:mermaid|mmd)\s*\r?\n([\s\S]*?)```/i;
const BARE_MINDMAP_PATTERN = /(?:^|\n)(mindmap(?:[ \t]+root)?[\s\S]*)$/i;
/** Return a fenced mermaid document, or '' when the model did not emit a diagram. */
export function extractMermaidFence(raw) {
    const fenced = raw.match(FENCE_PATTERN);
    if (fenced !== null) {
        const body = fenced[1].trim();
        return body === '' ? '' : `\`\`\`mermaid\n${body}\n\`\`\``;
    }
    const bare = raw.match(BARE_MINDMAP_PATTERN);
    if (bare === null)
        return '';
    const body = bare[1].trim();
    if (!/^mindmap\b/i.test(body))
        return '';
    if (!/\n\s+\S/.test(body))
        return '';
    return `\`\`\`mermaid\n${body}\n\`\`\``;
}
/** Inner mermaid source for rendering. */
export function mermaidSourceFromArtifact(raw) {
    const fenced = extractMermaidFence(raw);
    if (fenced === '')
        return '';
    return fenced.replace(/^```(?:mermaid|mmd)\s*\r?\n/i, '').replace(/\r?\n```\s*$/u, '').trim();
}
/** Parse Mermaid mindmap syntax into a tree the Studio UI can draw. */
export function parseMindmapTree(raw) {
    const source = mermaidSourceFromArtifact(raw);
    if (source === '')
        return null;
    const lines = source.split(/\r?\n/)
        .map(line => line.replace(/\t/g, '  '))
        .filter(line => line.trim() !== '' && !line.trim().startsWith('%%'));
    if (lines.length === 0 || !/^mindmap\b/i.test(lines[0].trim()))
        return null;
    const items = [];
    for (const line of lines.slice(1)) {
        const label = mindmapLabel(line.trim());
        if (label === '')
            continue;
        items.push({ indent: line.match(/^ */u)?.[0].length ?? 0, label });
    }
    if (items.length === 0)
        return null;
    const roots = [];
    let index = 0;
    while (index < items.length) {
        const parsed = buildMindmap(items, index, items[index].indent);
        roots.push(parsed.node);
        index = parsed.next;
    }
    if (roots.length === 1)
        return roots[0];
    return { label: 'Mindmap', children: roots };
}
function buildMindmap(items, start, indent) {
    const children = [];
    let index = start + 1;
    while (index < items.length && items[index].indent > indent) {
        const child = buildMindmap(items, index, items[index].indent);
        children.push(child.node);
        index = child.next;
    }
    return { node: { label: items[start].label, children }, next: index };
}
function mindmapLabel(raw) {
    const stripped = raw.replace(/^::icon\([^)]*\)\s*/u, '').trim();
    const wrapped = stripped.match(/^(?:[\w.-]+)?(?:\(\((.+)\)\)|\[\[(.+)\]\]|\[\((.+)\)\]|\(\[(.+)\]\)|\{\{(.+)\}\}|\{(.+)\}|\[(.+)\]|\((.+)\))$/u);
    const inner = wrapped?.slice(1).find(part => part !== undefined);
    return (inner ?? stripped).replace(/^["']|["']$/gu, '').trim();
}
//# sourceMappingURL=studio-mermaid.js.map