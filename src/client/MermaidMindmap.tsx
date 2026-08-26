/** Render a Studio mindmap from Mermaid mindmap source. */

import { parseMindmapTree, type MindmapNode } from '../studio-mermaid.ts'
import css from './views.module.css'

/** Draw an indented mindmap tree, or show a short error if the source is not a diagram. */
export function MermaidMindmap({ text, invalidLabel }: { text: string; invalidLabel: string }) {
  const tree = parseMindmapTree(text)
  if (tree === null) return text.trim() === '' ? null : <p className={css.mindmapFallback}>{invalidLabel}</p>
  return <div className={css.mindmapCanvas}><MindmapBranch node={tree} root /></div>
}

function MindmapBranch({ node, root = false }: { node: MindmapNode; root?: boolean }) {
  return <div className={root ? css.mindmapRoot : css.mindmapBranch}>
    <span className={root ? css.mindmapRootLabel : css.mindmapLabel}>{node.label}</span>
    {node.children.length === 0 ? null : <div className={css.mindmapChildren}>
      {node.children.map((child, index) => <MindmapBranch key={`${child.label}:${String(index)}`} node={child} />)}
    </div>}
  </div>
}
