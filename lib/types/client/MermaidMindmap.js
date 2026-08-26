import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Render a Studio mindmap from Mermaid mindmap source. */
import { parseMindmapTree } from "../studio-mermaid.js";
import css from './views.module.css';
/** Draw an indented mindmap tree, or show a short error if the source is not a diagram. */
export function MermaidMindmap({ text, invalidLabel }) {
    const tree = parseMindmapTree(text);
    if (tree === null)
        return text.trim() === '' ? null : _jsx("p", { className: css.mindmapFallback, children: invalidLabel });
    return _jsx("div", { className: css.mindmapCanvas, children: _jsx(MindmapBranch, { node: tree, root: true }) });
}
function MindmapBranch({ node, root = false }) {
    return _jsxs("div", { className: root ? css.mindmapRoot : css.mindmapBranch, children: [_jsx("span", { className: root ? css.mindmapRootLabel : css.mindmapLabel, children: node.label }), node.children.length === 0 ? null : _jsx("div", { className: css.mindmapChildren, children: node.children.map((child, index) => _jsx(MindmapBranch, { node: child }, `${child.label}:${String(index)}`)) })] });
}
//# sourceMappingURL=MermaidMindmap.js.map