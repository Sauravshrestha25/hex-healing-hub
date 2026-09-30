/** Every <img src> in a rich-text body. */
export function imagesInHtml(html: string) {
  return [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map((match) => match[1]!.replace(/&amp;/g, "&"));
}
