import React, { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

export default function MarkdownViewer({ html, progress }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    // enable smooth anchor scrolling
    containerRef.current.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href')
        if (!href || !href.startsWith('#')) return
        e.preventDefault()
        const id = href.slice(1)
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [html])

  return (
    <Box sx={{ width: '100%' }}>
      {progress > 0 && progress < 100 && <LinearProgress variant="determinate" value={progress} />}
      <div
        ref={containerRef}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    </Box>
  )
}
