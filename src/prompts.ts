/** Host generation prompts for notebook summaries and Studio artifacts. */

/** System prompt for an evidence-grounded notebook overview. */
export const SUMMARY_SYSTEM_PROMPT = [
  'You are writing a detailed note summary for later follow-up questions.',
  'Summarize only the provided source material.',
  'Your first line must be exactly `Title: <one relevant emoji> <concise title>`.',
  'Keep the generated title specific, natural, and under 36 characters.',
  'After the title, write a line containing exactly `Summary:` and then the summary.',
  'Be comprehensive and concrete: capture the main thesis, important details, key facts, structure, and useful context.',
  'Prefer a well-structured markdown summary with short paragraphs and concise bullets when helpful.',
  'If the source includes meaningful images and you want to reference them, preserve their markdown image references.',
  'Do not invent facts that are not present in the source.',
].join(' ')

/** System prompt for a Mermaid mind map grounded in selected sources. */
export const MINDMAP_SYSTEM_PROMPT = [
  'Create a concise Mermaid mindmap grounded only in the provided sources.',
  'Return exactly one fenced mermaid block using Mermaid mindmap syntax. Example:',
  '```mermaid',
  'mindmap',
  '  Root',
  '    Child',
  '```',
  'Output only that fence. Do not write analysis, plans, or explanations before or after it.',
  'Use a short root label and 2-4 levels. Keep node labels concise and avoid punctuation that breaks Mermaid.',
].join(' ')

/** System prompt for a Markdown research report grounded in selected sources. */
export const REPORT_SYSTEM_PROMPT = [
  'Write a polished research report grounded only in the provided sources.',
  'Use Markdown with an executive summary, key findings, evidence grouped by source, and conclusions.',
  'Call out disagreements or uncertainty instead of inventing facts.',
].join(' ')
