import MarkdownIt from 'markdown-it'

let buffer = ''

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
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

// Inject IDs into heading_open tokens so rendered HTML headers have ids
md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const next = tokens[idx + 1]
  let text = ''
  if (next && next.type === 'inline') text = next.content
  const id = slugify(text || '')
  if (id) {
    // set or push id attribute
    if (!token.attrs) token.attrs = []
    const exists = token.attrs.findIndex((a) => a[0] === 'id')
    if (exists >= 0) token.attrs[exists][1] = id
    else token.attrs.push(['id', id])
  }
  return self.renderToken(tokens, idx, options)
}

onmessage = (ev) => {
  const { type, text } = ev.data
  if (type === 'chunk') {
    buffer += text
    // send incremental TOC updates so UI can populate early
    const toc = extractTocFrom(buffer)
    postMessage({ type: 'toc', payload: toc })
  } else if (type === 'done') {
    // final parse to HTML using markdown-it
    const html = md.render(buffer)
    const toc = extractTocFrom(buffer)
    postMessage({ type: 'html', payload: { html, toc } })
    buffer = ''
  }
}
