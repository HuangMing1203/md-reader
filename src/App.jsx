import React, { useEffect, useMemo, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import { CssBaseline } from '@mui/material'
import Upload from './components/Upload'
import TocDrawer from './components/TocDrawer'
import MarkdownViewer from './components/MarkdownViewer'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState([])
  const [progress, setProgress] = useState(0)

  const handleToggleDrawer = () => setDrawerOpen((s) => !s)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleToggleDrawer} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
            MD Reader
          </Typography>
          <Upload
            onProgress={setProgress}
            onToc={setToc}
            onHtml={({ html, toc }) => {
              setHtml(html)
              setToc(toc)
            }}
          />
        </Toolbar>
      </AppBar>

      <TocDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} toc={toc} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="md">
          <MarkdownViewer html={html} progress={progress} />
        </Container>
      </Box>
    </Box>
  )
}
