import MarkdownIt from 'markdown-it'

function slugify(text) {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      // Normalize to decompose combined letters (NFKD), so accents become separate marks
      .normalize('NFKD')
      // Remove diacritic marks
      .replace(/\p{M}/gu, '')
      // Remove any character that is not a letter, number, space or hyphen (unicode-aware)
      .replace(/[^\p{L}\p{N}\s-]+/gu, '')
      // Replace spaces with single hyphens
      .replace(/\s+/g, '-')
      // Collapse multiple hyphens
      .replace(/-+/g, '-')
      // Trim leading/trailing hyphens
      .replace(/^-|-$/g, '')
  )
}

function extractTocFrom(text) {
  const toc = []
  const regex = /^(#{1,6})\s+(.*)$/gm
  let m
  while ((m = regex.exec(text)) !== null) {
    const level = m[1].length
    const raw = m[2].trim()
    const id = slugify(raw)
    toc.push({ level, text: raw, id })
  }
  return toc
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const next = tokens[idx + 1]
  let text = ''
  if (next && next.type === 'inline') text = next.content
  const id = slugify(text || '')
  if (id) {
    if (!token.attrs) token.attrs = []
    const exists = token.attrs.findIndex((a) => a[0] === 'id')
    if (exists >= 0) token.attrs[exists][1] = id
    else token.attrs.push(['id', id])
  }
  return self.renderToken(tokens, idx, options)
}

// process a File by streaming it and calling callbacks for incremental TOC and final HTML
export async function processFile(file, { onToc, onHtml, onProgress } = {}) {
  if (!file) return
  const reader = file.stream().getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    buffer += chunk
    received += value.length
    if (onProgress && file.size) {
      const pct = Math.min(100, Math.round((received / file.size) * 100))
      try {
        onProgress(pct)
      } catch (e) {
        /* ignore */
      }
    }
    if (onToc) {
      try {
        onToc(extractTocFrom(buffer))
      } catch (e) {
        /* ignore */
      }
    }
  }

  const html = md.render(buffer)
  const toc = extractTocFrom(buffer)
  if (onHtml) onHtml({ html, toc })
  if (onProgress) onProgress(100)
}

export function extractToc(text) {
  return extractTocFrom(text || '')
}
