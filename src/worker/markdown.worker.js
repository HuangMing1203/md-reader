import { marked } from 'marked'

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

onmessage = (ev) => {
  const { type, text } = ev.data
  if (type === 'chunk') {
    buffer += text
    // send incremental TOC updates so UI can populate early
    const toc = extractTocFrom(buffer)
    postMessage({ type: 'toc', payload: toc })
  } else if (type === 'done') {
    // final parse to HTML
    const renderer = new marked.Renderer()
    renderer.heading = function (text, level, raw, slugger) {
      const id = slugify(raw)
      return `<h${level} id="${id}">${text}</h${level}>\n`
    }

    const html = marked.parse(buffer, { renderer })
    const toc = extractTocFrom(buffer)
    postMessage({ type: 'html', payload: { html, toc } })
    buffer = ''
  }
}
