import React, { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const MarkdownBody = styled('div')(({ theme }) => ({
  // Only the truly necessary rules
  backgroundColor: theme.palette.background.paper,        // dark mode support
  padding: theme.spacing(3),                              // readable horizontal spacing
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    scrollMarginTop: theme.spacing(12),                   // fixed header compensation
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
  // Responsive padding (matches original mobile behavior)
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}))

export default function MarkdownViewer({ html, progress }) {
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
    <Box sx={{ width: '100%' }}>
      {progress > 0 && progress < 100 && <LinearProgress variant="determinate" value={progress} />}
      <MarkdownBody
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    </Box>
  )
}
