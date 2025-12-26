import DOMPurify from 'dompurify'
import { useEffect, useRef, useState } from 'react'
import { processFile } from '../utils/markdown'

import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import TocDrawer from './TocDrawer'

function HTMLView({ html }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    // enable smooth anchor scrolling
    containerRef.current.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const a = e.currentTarget
        const href = a.getAttribute('href')
        if (!href?.startsWith('#')) return
        e.preventDefault()
        const id = href.slice(1)
        const target = document.getElementById(id)
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [html])

  return (
    <Paper
      ref={containerRef}
      component="article"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      sx={{
        p: { xs: 2, md: 3 },
        '& h1': { typography: 'h3' },
        '& h2': { typography: 'h4' },
        '& h3': { typography: 'h5' },
        '& h4': { typography: 'h6' },
        '& h5': { typography: 'subtitle1' },
        '& h6': { typography: 'subtitle2' },
        '& p': { typography: 'body1' },
        '& a': {
          color: 'primary.main',
          '&:hover': { color: 'primary.light' },
        },
        '& img': { maxWidth: '100%', height: 'auto' },
        '& ul, & ol': { pl: 3, mb: 2 },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'grey.300',
          pl: 2,
          color: 'text.secondary',
          backgroundColor: 'action.hover',
        },
        '& table': { maxWidth: '100%', borderCollapse: 'collapse' },
        '& th, & td': {
          border: 'thin solid',
          borderColor: 'divider',
          p: 1,
        },
        '& pre': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          fontFamily: 'Monaco, Menlo, monospace',
        },
        '& code': { fontFamily: 'Monaco, Menlo, monospace' },
      }}
    />
  )
}

export default function MarkdownViewer({ content, drawerOpen, onDrawerClose }) {
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setHtml('')
    setToc([])
    setProgress(0)
    if (!content) return

    let cancelled = false
    processFile(content, {
      onProgress: (progress) => !cancelled && setProgress(progress),
      onToc: (toc) => !cancelled && setToc(toc),
      onHtml: (html) => !cancelled && setHtml(html),
    }).catch((e) => {
      console.error(e)
    })

    return () => {
      cancelled = true
    }
  }, [content])

  return (
    <>
      {progress > 0 && progress < 100 && (
        <LinearProgress variant="determinate" value={progress} />
      )}

      {html && <HTMLView html={html} />}

      <TocDrawer open={drawerOpen} onClose={onDrawerClose} toc={toc} />
    </>
  )
}
