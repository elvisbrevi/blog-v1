import type { MouseEvent } from 'react';
import { Marked, type Tokens } from 'marked';

// Returns highlighted HTML for a code block, or undefined for unknown languages.
export type CodeHighlighter = (code: string, language: string) => string | undefined;

const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

// Remove HTML attributes from markdown image syntax (left over from Hashnode)
// Example: ![alt](url align="center") -> ![alt](url)
function cleanMarkdownImages(markdown: string): string {
    let cleaned = markdown.replace(/!\[(.*?)\]\((.*?)\s+align=["'].*?["']\)/g, '![$1]($2)');
    cleaned = cleaned.replace(/!\[(.*?)\]\((.*?)\s+\w+=["'].*?["']\)/g, '![$1]($2)');
    return cleaned;
}

function createMarked(highlight?: CodeHighlighter): Marked {
    return new Marked({
        renderer: {
            // Every image is wrapped in a link so Fancybox can show it in a
            // lightbox (see lightbox.ts); off-screen images load lazily.
            image({ href, title, text }: Tokens.Image) {
                const src = escapeHtml(href);
                const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
                return `<a href="${src}" data-fancybox><img src="${src}" alt="${escapeHtml(text)}"${titleAttribute} loading="lazy" decoding="async"></a>`;
            },
            // Code blocks get a header with their language and a copy button
            // (handled by handleCodeCopy).
            code({ text, lang }: Tokens.Code) {
                const language = escapeHtml((lang ?? '').trim().split(/\s+/)[0]);
                const body = highlight?.(text, language) ?? escapeHtml(text);
                const className = language ? `hljs language-${language}` : 'hljs';
                return `<div class="code-block"><div class="code-block-header"><span>${language}</span><button type="button" class="copy-code">Copy</button></div><pre><code class="${className}">${body}</code></pre></div>\n`;
            }
        }
    });
}

export function renderMarkdown(markdown: string, options: { highlight?: CodeHighlighter } = {}): string {
    return createMarked(options.highlight).parse(cleanMarkdownImages(markdown), { async: false });
}

// Posts start with `# <title>`, which the post page already renders as its heading.
export function stripLeadingTitle(markdown: string, title: string): string {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const match = markdown.match(/^\s*#\s+(.+?)[ \t]*(?:\r?\n|$)/);
    if (match && normalize(match[1]) === normalize(title)) {
        return markdown.slice(match[0].length);
    }
    return markdown;
}

// Click handler for the copy buttons rendered next to each code block.
export function handleCodeCopy(event: MouseEvent<HTMLElement>) {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.copy-code');
    const code = button?.closest('.code-block')?.querySelector('code');
    if (!button || !code) return;

    const showResult = (label: string) => {
        button.textContent = label;
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    };

    if (!navigator.clipboard) {
        showResult('Copy failed');
        return;
    }
    navigator.clipboard.writeText(code.textContent ?? '').then(
        () => showResult('Copied!'),
        () => showResult('Copy failed')
    );
}
