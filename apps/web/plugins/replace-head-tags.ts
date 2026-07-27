type HeadReplacement = {
  /** Value to write into the tag. */
  content: string;
  /** Attribute holding the value (`content` for meta, `href` for link). */
  valueAttribute: string;
  /** Attribute that identifies the tag, e.g. `name="description"`. */
  matcher: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Rewrites the value of a single head tag in an HTML document.
 *
 * Deliberately narrow: it only touches self-closing `meta`/`link` tags that
 * carry the given identifying attribute, and leaves the document untouched when
 * no such tag exists.
 */
export function replaceHeadTag(html: string, replacement: HeadReplacement): string {
  const pattern = new RegExp(
    `(<(?:meta|link)[^>]*${escapeRegExp(replacement.matcher)}[^>]*${escapeRegExp(
      replacement.valueAttribute,
    )}=")[^"]*(")`,
  );

  return html.replace(pattern, `$1${escapeHtmlAttribute(replacement.content)}$2`);
}

export function replaceTitle(html: string, title: string): string {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtmlAttribute(title)}</title>`);
}
